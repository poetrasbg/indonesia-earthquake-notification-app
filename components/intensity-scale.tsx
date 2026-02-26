"use client";

import { INTENSITY_LEVELS } from "@/types/earthquake";

interface IntensityScaleProps {
  selectedLevel?: number;
  showDescription?: boolean;
  interactive?: boolean;
  onSelect?: (level: number) => void;
  compact?: boolean;
}

/**
 * Komponen untuk menampilkan MMI (Modified Mercalli Intensity) scale
 * Membantu pengguna memahami dan memilih tingkat intensitas gempa
 */
export function IntensityScale({
  selectedLevel,
  showDescription = true,
  interactive = false,
  onSelect,
  compact = false,
}: IntensityScaleProps) {
  if (compact) {
    // Compact view - horizontal bar
    return (
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          Skala Intensitas Gempa (1-9)
        </p>
        <div className="flex gap-1 h-6">
          {INTENSITY_LEVELS.map((level) => (
            <button
              key={level.level}
              onClick={() => onSelect?.(level.level)}
              disabled={!interactive}
              title={`${level.level}: ${level.name}`}
              className={`flex-1 rounded text-xs font-bold text-white transition-all ${
                selectedLevel === level.level
                  ? `${level.color} ring-2 ring-offset-1 ring-primary`
                  : level.color
              } ${!interactive ? "cursor-default" : "hover:opacity-80 cursor-pointer"}`}
            >
              {level.level}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Full view
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-foreground">
        Skala Intensitas Gempa Bumi (MMI)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {INTENSITY_LEVELS.map((level) => (
          <button
            key={level.level}
            onClick={() => interactive && onSelect?.(level.level)}
            disabled={!interactive}
            className={`p-3 rounded-lg text-left transition-all ${
              selectedLevel === level.level
                ? "ring-2 ring-primary scale-105"
                : ""
            } ${
              interactive
                ? "hover:scale-102 cursor-pointer hover:shadow-md"
                : "cursor-default"
            } ${level.color} text-white`}
          >
            <div className="font-bold text-lg">Level {level.level}</div>
            <div className="font-semibold text-sm">{level.name}</div>
            {showDescription && (
              <div className="text-xs opacity-90 mt-1">
                {getIntensityDescription(level.level)}
              </div>
            )}
          </button>
        ))}
      </div>

      {selectedLevel && showDescription && (
        <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-3">
          <p className="text-sm font-medium text-foreground mb-1">
            Level {selectedLevel}: {INTENSITY_LEVELS[selectedLevel - 1].name}
          </p>
          <p className="text-sm text-muted-foreground">
            {getDetailedDescription(selectedLevel)}
          </p>
        </div>
      )}
    </div>
  );
}

// Helper functions untuk deskripsi intensitas
function getIntensityDescription(level: number): string {
  const descriptions: { [key: number]: string } = {
    1: "Tidak dirasakan",
    2: "Terasa oleh orang sensitif",
    3: "Terasa oleh beberapa orang",
    4: "Dirasakan banyak orang",
    5: "Ada kerusakan ringan",
    6: "Paku tertarik, bangunan rusak",
    7: "Kerusakan berat, jalan terputus",
    8: "Bangunan ambruk",
    9: "Kerusakan parah, topografi berubah",
  };

  return descriptions[level] || "";
}

function getDetailedDescription(level: number): string {
  const detailedDescriptions: { [key: number]: string } = {
    1: "Getaran tidak dirasakan oleh manusia atau hanya dirasakan oleh instrumen seismik.",
    2: "Getaran dirasakan oleh beberapa orang yang sedang diam, terutama di lantai tinggi.",
    3: "Getaran dirasakan di dalam ruangan, tetapi tidak semua orang merasakannya. Benda-benda kecil bisa berguncang.",
    4: "Getaran dirasakan oleh sebagian besar orang di dalam ruangan, beberapa di luar ruangan. Perabotan bergoyang sedikit, suara seperti truk berat melintasi.",
    5: "Getaran dirasakan hampir semua orang di dalam ruangan. Beberapa bangunan mengalami kerusakan ringan. Buku jatuh dari rak, lampu bergoyang.",
    6: "Getaran dirasakan oleh semua orang. Sebagian bangunan mengalami kerusakan sedang. Paku dapat tertarik, terjadi kerusakan pada cerobong asap.",
    7: "Beberapa bangunan mengalami kerusakan berat, jalan terputus, muncul retakan di tanah. Orang lari keluar rumah dalam panik.",
    8: "Sebagian besar bangunan mengalami kerusakan berat hingga ambruk. Kerusakan jembatan, jalur kereta api berubah bentuk.",
    9: "Hampir semua bangunan mengalami kerusakan parah hingga hancur. Banyak orang meninggal, perubahan topografi permukaan bumi terlihat jelas.",
  };

  return detailedDescriptions[level] || "";
}
