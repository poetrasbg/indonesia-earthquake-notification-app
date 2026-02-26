// Service untuk menangani notifikasi suara dan popup
export class NotificationService {
  private audioContext: AudioContext | null = null;

  // Hitung jarak antara dua koordinat GPS menggunakan Haversine formula
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radius bumi dalam kilometer
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Putar suara alarm gempa
  playAlarmSound(duration: number = 5000): void {
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }

      const ctx = this.audioContext;
      const now = ctx.currentTime;
      const endTime = now + duration / 1000;

      // Buat oscillator untuk suara alarm
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();

      // Frekuensi alarm (gelombang merah/warning)
      osc1.frequency.setValueAtTime(880, now); // A5 note
      osc2.frequency.setValueAtTime(440, now); // A4 note
      lfo.frequency.setValueAtTime(5, now); // LFO frequency

      // Setup gain
      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, endTime);

      lfoGain.gain.setValueAtTime(200, now);

      // Connect nodes
      lfo.connect(lfoGain);
      lfoGain.connect(osc1.frequency);
      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Start oscillators
      osc1.start(now);
      osc2.start(now);
      lfo.start(now);

      // Stop oscillators
      osc1.stop(endTime);
      osc2.stop(endTime);
      lfo.stop(endTime);
    } catch (error) {
      console.error("[v0] Error playing alarm sound:", error);
    }
  }

  // Cek geolocation pengguna
  async getCurrentLocation(): Promise<{
    latitude: number;
    longitude: number;
  }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation tidak didukung browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  // Request permission untuk notifikasi browser
  async requestNotificationPermission(): Promise<boolean> {
    if (!("Notification" in window)) {
      console.warn("[v0] Browser tidak mendukung Web Notifications API");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }

    return false;
  }

  // Tampilkan notifikasi popup gempa
  showEarthquakeNotification(message: string, details: string): void {
    if (Notification.permission === "granted") {
      new Notification("⚠️ Peringatan Gempa Bumi", {
        body: message,
        icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%23ef4444' width='100' height='100'/><text x='50' y='60' font-size='60' fill='white' text-anchor='middle' font-weight='bold'>⚠</text></svg>",
        tag: "earthquake-alert",
        requireInteraction: true,
      });
    }
  }
}

export const notificationService = new NotificationService();
