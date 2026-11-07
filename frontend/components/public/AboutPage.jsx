import Link from "next/link";

const values = [
  ["01", "الوضوح أولًا", "نحوّل الأسئلة المعقدة إلى قرارات وتجارب مفهومة."],
  ["02", "تفاصيل تصنع الفرق", "نهتم بالأداء، سهولة الاستخدام، واتساق كل خطوة."],
  ["03", "شراكة مسؤولة", "نشارك المعرفة ونبني حلولًا قابلة للتطوير بعد الإطلاق."],
];

export default function AboutPage() {
  return (
    <>
      <section className="nt-page-hero">
        <div className="nt-container nt-page-hero-grid">
          <div><span className="nt-overline">من نحن</span><h1>شريكك التقني من <span>الفكرة إلى الأثر.</span></h1></div>
          <p>Norama Tech استوديو تقني يربط التفكير في المنتج بجودة التصميم والتطوير، لبناء تجارب رقمية تخدم الناس والأعمال.</p>
        </div>
      </section>
      <section className="nt-section nt-about-story">
        <div className="nt-container nt-about-grid">
          <div className="nt-about-visual"><div className="nt-about-mark">N<span>.</span></div><span className="nt-about-visual-caption">TECH WITH INTENTION</span><div className="nt-about-lines" aria-hidden="true" /></div>
          <div className="nt-about-copy">
            <span className="nt-overline">ما الذي نؤمن به</span>
            <h2>التقنية ليست الهدف.<br /><span>التجربة هي ما يبقى.</span></h2>
            <p>نبدأ من احتياج واضح، ثم نختار الأدوات التي تخدمه. نعمل على بناء واجهات عملية ومتقنة، مع اهتمام حقيقي بالتفاصيل التي تجعل المنتج أسرع وأسهل في الاستخدام.</p>
            <p>هذه النسخة التعريفية تعرض محتوى ونماذج تجريبية ثابتة، ويمكن استبدالها بمعلومات الفريق والأعمال الفعلية عند تجهيزها.</p>
            <Link className="nt-text-link" href="/services">استكشف خدماتنا <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>
      <section className="nt-section nt-values-section">
        <div className="nt-container">
          <div className="nt-section-heading"><div><span className="nt-overline">قيمنا</span><h2>مبادئ بسيطة، <span>تنفيذ جاد.</span></h2></div><p>كل قرار في المشروع يجب أن يساعد على الوصول إلى تجربة أفضل.</p></div>
          <div className="nt-values-grid">{values.map(([number, title, description]) => <article className="nt-value-card" key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></article>)}</div>
        </div>
      </section>
      <section className="nt-section nt-about-cta"><div className="nt-container nt-simple-cta"><div><span className="nt-overline">معًا نبدأ</span><h2>ما الذي تريد <span>بناءه؟</span></h2></div><Link className="nt-button nt-button-primary" href="/contact">حدثنا عن فكرتك <span aria-hidden="true">↗</span></Link></div></section>
    </>
  );
}
