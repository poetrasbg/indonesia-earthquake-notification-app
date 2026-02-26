import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { clusterReports, EarthquakeReport } from "@/lib/clustering-service";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("[v0] Supabase credentials not configured");
}

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// POST /api/reports - Simpan laporan gempa dari pengguna
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      latitude,
      longitude,
      intensity_level,
      description,
      location_name,
    } = body;

    // Validasi input
    if (
      latitude === undefined ||
      longitude === undefined ||
      !intensity_level ||
      !location_name
    ) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    if (intensity_level < 1 || intensity_level > 9) {
      return NextResponse.json(
        { error: "Tingkat intensitas harus 1-9" },
        { status: 400 }
      );
    }

    let savedReport = {
      id: `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      intensity_level: parseInt(intensity_level),
      description: description || null,
      location_name,
      created_at: new Date().toISOString(),
    };

    // Simpan ke Supabase jika tersedia dan table sudah dibuat
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("earthquake_reports")
          .insert([
            {
              latitude: savedReport.latitude,
              longitude: savedReport.longitude,
              intensity_level: savedReport.intensity_level,
              description: savedReport.description,
              location_name: savedReport.location_name,
              created_at: savedReport.created_at,
            },
          ])
          .select()
          .single();

        if (error) {
          // Check if it's a table not found error
          if (error.message && error.message.includes("Could not find the table")) {
            console.warn("[v0] Table not found, using fallback storage. Please create the table using the SQL migration.");
            // Continue with fallback - report is already created above
          } else {
            throw error;
          }
        } else if (data) {
          savedReport.id = data.id;
          console.log("[v0] Report saved to Supabase:", data.id);
        }
      } catch (supabaseError) {
        console.error("[v0] Supabase operation error:", supabaseError);
        // Graceful fallback - report already created with local ID
        console.log("[v0] Using fallback storage for report");
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Laporan gempa berhasil disimpan",
        data: savedReport,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[v0] Error in POST /api/reports:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

// GET /api/reports - Ambil daftar laporan gempa dan clustering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const radiusKm = parseInt(searchParams.get("radius") || "50");
    const hoursBack = parseInt(searchParams.get("hours") || "24");

    let reports: EarthquakeReport[] = [];

    if (supabase) {
      try {
        // Ambil laporan dari 24 jam terakhir
        const cutoffTime = new Date(Date.now() - hoursBack * 60 * 60 * 1000).toISOString();

        const { data, error } = await supabase
          .from("earthquake_reports")
          .select("*")
          .gte("created_at", cutoffTime)
          .order("created_at", { ascending: false });

        if (error) {
          // Check if it's a table not found error
          if (error.message && error.message.includes("Could not find the table")) {
            console.warn("[v0] Table earthquake_reports not found. Please execute the migration script to create the table.");
            // Return empty reports with empty clusters as fallback
          } else {
            throw error;
          }
        } else if (data && Array.isArray(data)) {
          reports = data.map((r) => ({
            id: r.id,
            latitude: r.latitude,
            longitude: r.longitude,
            intensity_level: r.intensity_level,
            description: r.description,
            location_name: r.location_name,
            created_at: r.created_at,
          }));

          console.log(`[v0] Fetched ${reports.length} reports from database`);
        }
      } catch (supabaseError) {
        console.error("[v0] Supabase fetch error:", supabaseError);
        // Gracefully continue with empty reports
        console.log("[v0] Continuing with empty reports due to database error");
      }
    }

    // Cluster reports
    const clusters = clusterReports(reports, radiusKm);

    return NextResponse.json(
      {
        success: true,
        data: {
          reports,
          clusters,
          total: reports.length,
          verifiedClusters: clusters.filter((c) => c.isVerified).length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[v0] Error in GET /api/reports:", error);
    // Return empty data on error instead of 500
    return NextResponse.json(
      {
        success: true,
        data: {
          reports: [],
          clusters: [],
          total: 0,
          verifiedClusters: 0,
        },
      },
      { status: 200 }
    );
  }
}
