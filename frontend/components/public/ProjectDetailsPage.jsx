import Link from "next/link";
import { PROJECTS } from "@/data/norama";
import ProjectCard from "@/components/public/ProjectCard";

export default function ProjectDetailsPage({ project }) {
  const relatedProjects = PROJECTS.filter((item) => item.slug !== project.slug).slice(0, 2);

  return (
    <>
      <section className="nt-detail-hero">
        <div className="nt-container">
          <div className="nt-breadcrumb"><Link href="/projects">المشاريع</Link><span aria-hidden="true">/</span><span>{project.name}</span></div>
          <div className="nt-detail-heading">
            <div>
              <span className="nt-overline">{project.category} <span className="nt-detail-separator">·</span> {project.type}</span>
              <h1>{project.name}</h1>
              <p>{project.summary}</p>
            </div>
            <Link className="nt-button nt-button-primary" href={`/contact?project=${project.slug}`}>ناقش فكرة مشابهة <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="nt-detail-cover">
            <img src={project.image} alt={project.imageAlt} />
          </div>
        </div>
      </section>

      <section className="nt-section nt-detail-content">
        <div className="nt-container nt-detail-layout">
          <div className="nt-detail-prose">
            <span className="nt-overline">عن الفكرة</span>
            <h2>تجربة تبدأ من <span>احتياج حقيقي.</span></h2>
            <p>{project.overview}</p>
            <div className="nt-detail-story-grid">
              <article><span className="nt-story-index">01 / التحدي</span><h3>ما الذي نريد تحسينه؟</h3><p>{project.challenge}</p></article>
              <article><span className="nt-story-index">02 / المقاربة</span><h3>كيف تعاملنا معه؟</h3><p>{project.approach}</p></article>
            </div>
            <div className="nt-feature-list-wrap">
              <h3>ملامح التجربة</h3>
              <ul className="nt-feature-list">{project.features.map((feature) => <li key={feature}><span aria-hidden="true">✓</span>{feature}</li>)}</ul>
            </div>
          </div>
          <aside className="nt-detail-aside">
            <div className="nt-detail-aside-card">
              <span className="nt-overline">نطاق التصور</span>
              <h3>مفهوم تصميمي</h3>
              <p>هذا العمل نموذج توضيحي ثابت، وليس مشروعًا منفذًا أو مرتبطًا بعميل حقيقي.</p>
              <div className="nt-detail-tags">{project.technologies.map((item) => <span key={item}>{item}</span>)}</div>
            </div>
            <div className="nt-static-notice">
              <strong>واتساب غير مفعّل بعد</strong>
              <p>تتطلب هذه الميزة رقم الشركة المعتمد، كما أن النسخة الحالية لا تتضمن تسجيل دخول أو تحققًا من الهوية.</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="nt-section nt-related-section">
        <div className="nt-container">
          <div className="nt-section-heading"><div><span className="nt-overline">استكشف المزيد</span><h2>أفكار <span>أخرى.</span></h2></div><Link className="nt-text-link" href="/projects">كل المشاريع <span aria-hidden="true">←</span></Link></div>
          <div className="nt-project-grid">{relatedProjects.map((item) => <ProjectCard project={item} key={item.slug} />)}</div>
        </div>
      </section>
    </>
  );
}
