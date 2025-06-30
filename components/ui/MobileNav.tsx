import React, { useState, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function MobileNav({
  navRef,
  children,
}: {
  navRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode[];
}) {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    const updateNavHeight = () => {
      if (navRef.current) {
        if ("offsetHeight" in navRef.current) {
          setNavHeight(navRef.current.offsetHeight);
        }
      }
    };

    updateNavHeight();
    window.addEventListener("resize", updateNavHeight);
    return () => window.removeEventListener("resize", updateNavHeight);
  }, [navRef]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", open);
  }, [open]);

  return (
    <>
      <div className="flex gap-8">
        <button
          aria-label="Toggle navigation menu"
          onClick={() => setOpen((v) => !v)}
          className="xl:hidden inline-flex h-10 w-10 items-center justify-center rounded-md transition-transform focus:outline-none focus:ring-2 focus:ring-gray-800"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        style={{ top: navHeight }}
        className={`fixed inset-0 z-40 bg-black/20 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        ref={drawerRef}
        style={{ top: navHeight }}
        role="dialog"
        aria-modal="true"
        className="fixed left-0 right-0 z-50 max-h-screen overflow-y-auto pointer-events-none"
      >
        <div
          className={`w-full justify-items-center bg-white py-4 shadow-lg transition-transform duration-300 ${
            open ? "translate-y-0 pointer-events-auto" : "-translate-y-full"
          }`}
        >
          <nav className="space-y-1 container px-4 py-4">{children}</nav>
        </div>
      </div>
    </>
  );
}
