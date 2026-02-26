"use client";

import { Github, Mail, ExternalLink } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Tentang</h3>
            <p className="text-sm text-muted-foreground">
              IndonesianQuake adalah platform informasi gempa bumi real-time untuk Indonesia
              dengan sistem pelaporan dan notifikasi berbasis lokasi GPS.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Tautan</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="https://bmkg.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  BMKG <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary transition-colors"
                >
                  Dokumentasi
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Kontak</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                oxva38@proton.me
              </p>
              <p className="flex items-center gap-2">
                <Github className="w-4 h-4" />
                @indonesianquake
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>
            IndonesianQuake © {currentYear} - Semua Hak Dilindungi
          </p>
          <p className="text-xs mt-2">
            Data real-time dari BMKG | Dedicated to Earthquake Safety in Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
