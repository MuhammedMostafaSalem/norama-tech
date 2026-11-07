"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_ITEMS } from "@/data/norama";
import BrandLink from "@/components/BrandLink";

export default function PublicHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="nt-header">
      <div className="nt-container nt-header-inner">
        <BrandLink onClick={closeMenu} />
        <button
          className="nt-menu-toggle"
          type="button"
          aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
          aria-expanded={menuOpen}
          aria-controls="nt-primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
        <nav
          id="nt-primary-navigation"
          className={`nt-nav${menuOpen ? " is-open" : ""}`}
          aria-label="التنقل الرئيسي"
        >
          {NAV_ITEMS.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                className={active ? "is-active" : ""}
                href={item.href}
                onClick={closeMenu}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          <Link className="nt-button nt-button-quiet nt-nav-cta nt-nav-login" href="/login" onClick={closeMenu}>
            تسجيل الدخول
          </Link>
          <Link className="nt-button nt-button-primary nt-nav-cta" href="/contact" onClick={closeMenu}>
            ابدأ مشروعك <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
