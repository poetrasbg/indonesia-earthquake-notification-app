import { NextRequest, NextResponse } from "next/server";

// POST /api/notification-settings - Buat pengaturan notifikasi baru
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      latitude,
      longitude,
      radius_km,
      min_intensity_level,
      notification_enabled,
      sound_enabled,
    } = body;

    // Validasi input
    if (!latitude || !longitude || !radius_km) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    if (radius_km < 5 || radius_km > 500) {
      return NextResponse.json(
        { error: "Radius harus antara 5-500 km" },
        { status: 400 }
      );
    }

    if (min_intensity_level < 1 || min_intensity_level > 9) {
      return NextResponse.json(
        { error: "Intensitas minimum harus 1-9" },
        { status: 400 }
      );
    }

    // TODO: Simpan ke Supabase database
    console.log("[v0] Notification setting created:", {
      latitude,
      longitude,
      radius_km,
      min_intensity_level,
      notification_enabled,
      sound_enabled,
      timestamp: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Pengaturan notifikasi berhasil disimpan",
        data: {
          id: `setting-${Date.now()}`,
          latitude,
          longitude,
          radius_km,
          min_intensity_level,
          notification_enabled,
          sound_enabled,
          created_at: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[v0] Error in POST /api/notification-settings:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

// GET /api/notification-settings - Ambil daftar pengaturan notifikasi
export async function GET(request: NextRequest) {
  try {
    // TODO: Ambil pengaturan dari Supabase berdasarkan user_id
    // Untuk sekarang, return empty list
    return NextResponse.json(
      {
        success: true,
        data: {
          settings: [],
          total: 0,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[v0] Error in GET /api/notification-settings:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
