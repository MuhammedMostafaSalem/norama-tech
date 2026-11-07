import Link from "next/link";
import { FAQ_ITEMS } from "@/data/norama";

export default function FAQPage() {
  return (
    <>
      <section className="nt-page-hero"><div className="nt-container nt-page-hero-grid"><div><span className="nt-overline">الأسئلة الشائعة</span><h1>إجابات واضحة، <span>قبل أن نبدأ.</span></h1></div><p>معلومات تساعدك على معرفة طريقة العمل والخطوة المناسبة لمشروعك.</p></div></section>
      <section className="nt-section nt-faq-section"><div className="nt-container nt-faq-layout"><div className="nt-faq-aside"><span className="nt-overline">هل لديك سؤال آخر؟</span><h2>نحن هنا <span>للمساعدة.</span></h2><p>أرسل تفاصيل استفسارك وسنساعدك في تحديد نقطة البداية المناسبة.</p><Link className="nt-button nt-button-outline" href="/contact">تواصل معنا <span aria-hidden="true">↗</span></Link></div><div className="nt-faq-list">{FAQ_ITEMS.map((item, index) => <details className="nt-faq-item" key={item.question} open={index === 0}><summary><span>{item.question}</span><span className="nt-faq-toggle" aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div></div></section>
    </>
  );
}
