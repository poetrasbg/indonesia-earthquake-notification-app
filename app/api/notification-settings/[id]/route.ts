import { NextRequest, NextResponse } from "next/server";

// DELETE /api/notification-settings/[id] - Hapus pengaturan notifikasi
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { error: "ID pengaturan tidak ditemukan" },
        { status: 400 }
      );
    }

    // TODO: Hapus dari Supabase database
    console.log("[v0] Notification setting deleted:", id);

    return NextResponse.json(
      {
        success: true,
        message: "Pengaturan notifikasi berhasil dihapus",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[v0] Error in DELETE /api/notification-settings/[id]:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

// PUT /api/notification-settings/[id] - Update pengaturan notifikasi
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID pengaturan tidak ditemukan" },
        { status: 400 }
      );
    }

    const {
      radius_km,
      min_intensity_level,
      notification_enabled,
      sound_enabled,
    } = body;

    // Validasi input
    if (radius_km && (radius_km < 5 || radius_km > 500)) {
      return NextResponse.json(
        { error: "Radius harus antara 5-500 km" },
        { status: 400 }
      );
    }

    if (
      min_intensity_level &&
      (min_intensity_level < 1 || min_intensity_level > 9)
    ) {
      return NextResponse.json(
        { error: "Intensitas minimum harus 1-9" },
        { status: 400 }
      );
    }

    // TODO: Update di Supabase database
    console.log("[v0] Notification setting updated:", id, body);

    return NextResponse.json(
      {
        success: true,
        message: "Pengaturan notifikasi berhasil diperbarui",
        data: {
          id,
          ...body,
          updated_at: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[v0] Error in PUT /api/notification-settings/[id]:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
