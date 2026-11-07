"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import BrandLink from "@/components/BrandLink";

const sections = [
  { label: "نظرة عامة", href: "/dashboard", mark: "01" },
  { label: "المشاريع", href: "/dashboard/projects", mark: "02" },
  { label: "التصنيفات", href: "/dashboard/categories", mark: "03" },
  { label: "المستخدمون", href: "/dashboard/users", mark: "04" },
  { label: "رسائل التواصل", href: "/dashboard/messages", mark: "05" },
  { label: "التقييمات", href: "/dashboard/reviews", mark: "06" },
  { label: "محتوى الموقع", href: "/dashboard/content", mark: "07" },
  { label: "الملف الشخصي", href: "/dashboard/profile", mark: "08" },
  { label: "إعدادات الموقع", href: "/dashboard/settings", mark: "09" },
];

export default function DashboardShell({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="nt-dashboard-shell">
      <aside className={`nt-sidebar${sidebarOpen ? " is-open" : ""}`}>
        <div className="nt-sidebar-brand">
          <BrandLink compact onClick={() => setSidebarOpen(false)} />
          <span className="nt-admin-label">ADMIN SPACE</span>
        </div>
        <nav className="nt-sidebar-nav" aria-label="قائمة الإدارة">
          <span className="nt-sidebar-caption">إدارة الموقع</span>
          {sections.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === item.href
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? "is-active" : ""}
                aria-current={active ? "page" : undefined}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="nt-sidebar-mark" aria-hidden="true">
                  {item.mark}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="nt-sidebar-bottom">
          <p>
            معاينة ثابتة
            <br />
            <span>لا يوجد تسجيل دخول أو حفظ بيانات.</span>
          </p>
          <Link href="/">← زيارة الموقع</Link>
        </div>
      </aside>
      <div className="nt-dashboard-main">
        <header className="nt-dashboard-topbar">
          <button
            className="nt-dashboard-menu"
            type="button"
            aria-label={sidebarOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
          <div className="nt-dashboard-topbar-label">
            <span className="nt-dashboard-topbar-dot" /> لوحة Norama Tech
          </div>
          <Link className="nt-dashboard-topbar-link" href="/">
            عرض الموقع <span aria-hidden="true">↗</span>
          </Link>
        </header>
        <main className="nt-dashboard-content">
          <div className="nt-dashboard-warning" role="note">
            <strong>واجهة إدارة تجريبية</strong>
            <span>
              هذه الصفحات للعرض فقط. لا توجد مصادقة أو صلاحيات أو تخزين بيانات
              بدون Backend.
            </span>
          </div>
          {children}
        </main>
      </div>
      {sidebarOpen && (
        <button
          className="nt-sidebar-backdrop"
          type="button"
          aria-label="إغلاق قائمة الإدارة"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
