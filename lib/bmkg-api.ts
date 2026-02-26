import { BMKGEarthquake } from "@/types/earthquake";

// Fetch gempa terbaru dari BMKG API official endpoint
export async function fetchLatestEarthquakes(): Promise<BMKGEarthquake[]> {
  try {
    // Try multiple BMKG endpoints in order of preference
    const endpoints = [
      // Latest earthquake (auto)
      "https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json",
      // 15 latest M5.0+ earthquakes
      "https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json",
      // 15 felt earthquakes
      "https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json",
    ];

    let data = null;
    let lastError = null;

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          data = await response.json();
          if (data && data.Infogempa && data.Infogempa.gempa) {
            console.log("[v0] Successfully fetched earthquakes from:", endpoint);
            break;
          }
        }
      } catch (err) {
        lastError = err;
        continue;
      }
    }

    if (!data || !data.Infogempa) {
      console.warn("[v0] No earthquake data available from BMKG");
      return [];
    }

    // Handle both array and single object responses
    let gempaList: any[] = [];
    if (Array.isArray(data.Infogempa.gempa)) {
      gempaList = data.Infogempa.gempa;
    } else if (data.Infogempa.gempa && typeof data.Infogempa.gempa === 'object') {
      // Single earthquake object
      gempaList = [data.Infogempa.gempa];
    }

    if (gempaList.length === 0) {
      console.warn("[v0] No earthquake items in response");
      return [];
    }

    // Transform data BMKG ke format aplikasi kita
    return gempaList.map((item: any) => ({
      id: item.id || `bmkg-${Date.now()}-${Math.random()}`,
      earthquake_id: item.id,
      source: "BMKG",
      status: item.Status || "confirmed",
      region: item.Wilayah,
      magnitude: parseFloat(item.Magnitude || "0"),
      depth: parseFloat(item.Kedalaman || "0"),
      datetime: item.DateTime,
      latitude: parseFloat(item.Lintang || "0"),
      longitude: parseFloat(item.Bujur || "0"),
    }));
  } catch (error) {
    console.error("[v0] Error fetching BMKG earthquakes:", error);
    return [];
  }
}

// Fetch gempa historis - menggunakan endpoint gempaterkini (15 terbaru M5.0+)
export async function fetchEarthquakeHistory(
  limit: number = 15
): Promise<BMKGEarthquake[]> {
  try {
    const response = await fetch(
      "https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json",
      { cache: "no-store" }
    );

    if (!response.ok) {
      console.warn("[v0] Failed to fetch earthquake history:", response.status);
      return [];
    }

    const data = await response.json();

    if (!data.Infogempa) {
      console.warn("[v0] No earthquake history data available");
      return [];
    }

    // Handle both array and single object responses
    let gempaList: any[] = [];
    if (Array.isArray(data.Infogempa.gempa)) {
      gempaList = data.Infogempa.gempa;
    } else if (data.Infogempa.gempa && typeof data.Infogempa.gempa === 'object') {
      gempaList = [data.Infogempa.gempa];
    }

    return gempaList.slice(0, limit).map((item: any) => ({
      id: item.id || `bmkg-${Date.now()}-${Math.random()}`,
      earthquake_id: item.id,
      source: "BMKG",
      status: item.Status || "confirmed",
      region: item.Wilayah,
      magnitude: parseFloat(item.Magnitude || "0"),
      depth: parseFloat(item.Kedalaman || "0"),
      datetime: item.DateTime,
      latitude: parseFloat(item.Lintang || "0"),
      longitude: parseFloat(item.Bujur || "0"),
    }));
  } catch (error) {
    console.error("[v0] Error fetching earthquake history:", error);
    return [];
  }
}

// Fetch gempa dirasakan (15 felt earthquakes) - untuk menampilkan semua informasi kegempaan Indonesia
export async function fetchFeltEarthquakes(
  limit: number = 15
): Promise<BMKGEarthquake[]> {
  try {
    const response = await fetch(
      "https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json",
      { cache: "no-store" }
    );

    if (!response.ok) {
      console.warn("[v0] Failed to fetch felt earthquakes:", response.status);
      return [];
    }

    const data = await response.json();

    if (!data.Infogempa) {
      console.warn("[v0] No felt earthquake data available");
      return [];
    }

    // Handle both array and single object responses
    let gempaList: any[] = [];
    if (Array.isArray(data.Infogempa.gempa)) {
      gempaList = data.Infogempa.gempa;
    } else if (data.Infogempa.gempa && typeof data.Infogempa.gempa === 'object') {
      gempaList = [data.Infogempa.gempa];
    }

    return gempaList.slice(0, limit).map((item: any) => ({
      id: item.id || `bmkg-${Date.now()}-${Math.random()}`,
      earthquake_id: item.id,
      source: "BMKG",
      status: item.Status || "confirmed",
      region: item.Wilayah,
      magnitude: parseFloat(item.Magnitude || "0"),
      depth: parseFloat(item.Kedalaman || "0"),
      datetime: item.DateTime,
      latitude: parseFloat(item.Lintang || "0"),
      longitude: parseFloat(item.Bujur || "0"),
    }));
  } catch (error) {
    console.error("[v0] Error fetching felt earthquakes:", error);
    return [];
  }
}
