"use client";

import { useMemo, useState } from "react";
import { PROJECTS } from "@/data/norama";
import ProjectCard from "@/components/public/ProjectCard";

const filters = ["الكل", ...new Set(PROJECTS.map((project) => project.category))];

export default function ProjectsBrowser() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("الكل");
  const visibleProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return PROJECTS.filter((project) => {
      const matchesCategory = category === "الكل" || project.category === category;
      const searchable = `${project.name} ${project.summary} ${project.category}`.toLowerCase();
      return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [category, query]);

  return (
    <>
      <div className="nt-project-toolbar">
        <label className="nt-search-field">
          <span className="nt-sr-only">ابحث في المشاريع</span>
          <span className="nt-search-icon" aria-hidden="true">⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث عن مشروع أو مجال..." />
        </label>
        <div className="nt-filter-list" aria-label="تصنيف المشاريع">
          {filters.map((item) => (
            <button key={item} type="button" className={category === item ? "is-selected" : ""} onClick={() => setCategory(item)} aria-pressed={category === item}>
              {item}
            </button>
          ))}
        </div>
      </div>
      <p className="nt-sample-disclaimer">جميع المشاريع المعروضة مفاهيم تجريبية لتوضيح أنواع الحلول الممكنة.</p>
      {visibleProjects.length ? (
        <div className="nt-project-grid">
          {visibleProjects.map((project) => <ProjectCard key={project.slug} project={project} />)}
        </div>
      ) : (
        <div className="nt-empty-state"><span aria-hidden="true">⌕</span><h2>لم نجد مشروعًا بهذا الوصف</h2><p>جرّب كلمة أخرى أو اختر تصنيفًا مختلفًا.</p></div>
      )}
      <p className="nt-result-count" aria-live="polite">{visibleProjects.length} مشاريع معروضة</p>
    </>
  );
}
