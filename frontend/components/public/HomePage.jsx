import Link from "next/link";
import { FiCode, FiLayers, FiSmartphone, FiShoppingBag } from "react-icons/fi";
import { PROJECTS, SERVICES } from "@/data/norama";
import ProjectCard from "@/components/public/ProjectCard";

const serviceIcons = {
  code: FiCode,
  layers: FiLayers,
  design: FiSmartphone,
  store: FiShoppingBag,
};

export default function HomePage() {
  return (
    <>
      <section className="nt-hero">
        <div className="nt-container nt-hero-grid">
          <div className="nt-hero-copy">
            <span className="nt-eyebrow"><span className="nt-eyebrow-dot" /> استوديو تقني يصنع فرقًا</span>
            <h1>نحوّل أفكارك إلى <span>تجارب رقمية</span> تستحق أن تُستخدم.</h1>
            <p className="nt-hero-description">
              نصمم ونطور منتجات رقمية واضحة، سريعة، وقابلة للنمو — من أول سؤال إلى تجربة الإطلاق.
            </p>
            <div className="nt-hero-actions">
              <Link className="nt-button nt-button-primary" href="/contact">ابدأ مشروعك <span aria-hidden="true">↗</span></Link>
              <Link className="nt-button nt-button-quiet" href="/projects">اكتشف أعمالنا <span aria-hidden="true">←</span></Link>
            </div>
            <div className="nt-hero-proof">
              <span className="nt-proof-icon" aria-hidden="true">✳</span>
              <p><strong>تفكير واضح. تنفيذ متقن.</strong><br />شراكة تقنية من أول فكرة إلى ما بعدها.</p>
            </div>
          </div>
          <div className="nt-hero-visual">
            <div className="nt-hero-orbit nt-hero-orbit-one" />
            <div className="nt-hero-orbit nt-hero-orbit-two" />
            <img src="/images/norama-hero.png" alt="تكوين رقمي مستوحى من الدوائر الإلكترونية والواجهات التقنية" />
            <div className="nt-floating-note nt-floating-note-top"><span className="nt-status-dot" /> تجربة رقمية متكاملة</div>
            <div className="nt-floating-note nt-floating-note-bottom"><span className="nt-note-mark">N</span><span>واجهة عربية<br /><strong>من الفكرة للإطلاق</strong></span></div>
            <span className="nt-hero-caption">استراتيجية · تصميم · تطوير</span>
          </div>
        </div>
        <div className="nt-container nt-capability-strip">
          <span>ما نقدمه</span>
          <span>تجارب ويب</span>
          <span>منتجات رقمية</span>
          <span>أنظمة تصميم</span>
          <span>تجارة إلكترونية</span>
        </div>
      </section>

      <section className="nt-section nt-services-section">
        <div className="nt-container">
          <div className="nt-section-heading">
            <div>
              <span className="nt-overline">كيف نساعدك</span>
              <h2>التقنية المناسبة، <span>لأثر حقيقي.</span></h2>
            </div>
            <p>نجمع بين التفكير في المنتج وجودة التنفيذ لنصنع تجارب متماسكة من أول نقرة.</p>
          </div>
          <div className="nt-services-grid">
            {SERVICES.map((service) => {
              const Icon = serviceIcons[service.icon];
              return (
                <article className="nt-service-card" key={service.number}>
                  <div className="nt-service-card-top"><span className="nt-service-icon"><Icon aria-hidden="true" /></span><span>{service.number}</span></div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <Link href="/services" aria-label={`تفاصيل ${service.title}`} className="nt-card-link">اعرف المزيد <span aria-hidden="true">↗</span></Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="nt-section nt-projects-section">
        <div className="nt-container">
          <div className="nt-section-heading">
            <div>
              <span className="nt-overline">نماذج من الأعمال</span>
              <h2>أفكار تتحول إلى <span>واجهات.</span></h2>
            </div>
            <Link className="nt-text-link" href="/projects">عرض كل المشاريع <span aria-hidden="true">←</span></Link>
          </div>
          <p className="nt-sample-disclaimer">المعروض هنا مفاهيم تصميمية للتوضيح، وليست سجلاً لمشاريع منفذة.</p>
          <div className="nt-project-grid nt-project-grid-home">
            {PROJECTS.slice(0, 2).map((project) => <ProjectCard key={project.slug} project={project} />)}
          </div>
        </div>
      </section>

      <section className="nt-section nt-process-section">
        <div className="nt-container nt-process-layout">
          <div className="nt-process-intro">
            <span className="nt-overline">طريقة العمل</span>
            <h2>خطوات واضحة،<br /><span>من البداية للنهاية.</span></h2>
            <p>كل مشروع يبدأ بفهم ما يحتاجه المستخدم وما يحتاجه العمل — ثم نبني الطريق بينهما.</p>
            <Link className="nt-button nt-button-outline" href="/about">تعرف على Norama Tech</Link>
          </div>
          <div className="nt-process-list">
            {[
              ["01", "نستمع ونفهم", "نحدد الهدف، الجمهور، والنطاق قبل اختيار الحل."],
              ["02", "نخطط التجربة", "نرتب المحتوى والتدفق ونرسم شكل المنتج."],
              ["03", "نبني ونتحقق", "نطور واجهة دقيقة ونراجعها عبر الحالات والأجهزة."],
              ["04", "نطلق ونتطور", "نجهز المنتج للانطلاق ونحدد فرص التحسين التالية."],
            ].map(([number, title, description]) => (
              <div className="nt-process-step" key={number}>
                <span className="nt-process-number">{number}</span>
                <div><h3>{title}</h3><p>{description}</p></div>
                <span className="nt-process-arrow" aria-hidden="true">↗</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="nt-cta-section">
        <div className="nt-container nt-cta-card">
          <div className="nt-cta-orb" aria-hidden="true" />
          <div>
            <span className="nt-overline">الخطوة التالية تبدأ هنا</span>
            <h2>عندك فكرة؟<br /><span>خلّينا نبنيها معًا.</span></h2>
          </div>
          <Link className="nt-button nt-button-light" href="/contact">تحدث عن مشروعك <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </>
  );
}
