"use client";

import { AlertTriangle, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary-foreground/20 p-2 rounded-lg">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">IndonesianQuake</h1>
              <p className="text-xs opacity-80 hidden sm:block">
                Sistem Informasi Gempa Bumi Indonesia
              </p>
            </div>
          </div>

          {/* Spacer untuk desktop */}
          <p className="text-sm hidden md:block">
            Platform ini masih dalam tahap ujicoba
          </p>

          {/* Mobile menu button */}
          <button className="md:hidden text-primary-foreground">
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
