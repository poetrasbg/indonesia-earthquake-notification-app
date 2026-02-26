/**
 * Earthquake intensity estimation utilities
 */

/**
 * Estimate intensity level based on magnitude and depth
 * @param magnitude - Earthquake magnitude (Richter scale)
 * @param depth - Depth in kilometers
 * @returns Estimated intensity (1-9)
 */
export function estimateIntensity(magnitude: number, depth: number): number {
  // Base intensity from magnitude
  let intensity = Math.ceil(magnitude - 1);

  // Adjust for depth
  if (depth < 30) {
    // Shallow earthquakes are more damaging
    intensity += 1;
  } else if (depth > 100) {
    // Deep earthquakes are less damaging
    intensity -= 1;
  }

  // Clamp between 1 and 9
  return Math.max(1, Math.min(9, intensity));
}

/**
 * Get intensity description
 */
export function getIntensityDescription(intensity: number): string {
  const descriptions: Record<number, string> = {
    1: "Tidak terasa",
    2: "Terasa sangat ringan",
    3: "Terasa ringan",
    4: "Terasa sedang",
    5: "Terasa kuat",
    6: "Terasa sangat kuat",
    7: "Kerusakan ringan",
    8: "Kerusakan sedang",
    9: "Kerusakan parah",
  };

  return descriptions[intensity] || "Tidak diketahui";
}

/**
 * Get risk level based on intensity
 */
export function getRiskLevel(intensity: number): "low" | "medium" | "high" | "critical" {
  if (intensity <= 3) return "low";
  if (intensity <= 5) return "medium";
  if (intensity <= 7) return "high";
  return "critical";
}
