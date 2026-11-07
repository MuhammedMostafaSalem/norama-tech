import Link from "next/link";
import { FiCode, FiLayers, FiSmartphone, FiShoppingBag } from "react-icons/fi";
import { SERVICES } from "@/data/norama";

const icons = { code: FiCode, layers: FiLayers, design: FiSmartphone, store: FiShoppingBag };
const deliverables = ["جلسة فهم نطاق المشروع", "خطة تجربة ومخرجات واضحة", "واجهة متجاوبة وسهلة الاستخدام", "مراجعة وتسليم منظم"];

export default function ServicesPage() {
  return (
    <>
      <section className="nt-page-hero">
        <div className="nt-container nt-page-hero-grid"><div><span className="nt-overline">خدماتنا</span><h1>كل ما يحتاجه منتجك <span>لينطلق بثقة.</span></h1></div><p>من أول تصور إلى واجهة جاهزة للاستخدام، نختار نطاق العمل المناسب ونبني كل مرحلة على هدف واضح.</p></div>
      </section>
      <section className="nt-section nt-services-page">
        <div className="nt-container nt-services-grid nt-services-grid-page">
          {SERVICES.map((service) => {
            const Icon = icons[service.icon];
            return <article className="nt-service-card nt-service-card-large" key={service.number}><div className="nt-service-card-top"><span className="nt-service-icon"><Icon aria-hidden="true" /></span><span>{service.number}</span></div><h2>{service.title}</h2><p>{service.description}</p><ul>{deliverables.slice(0, service.number === "03" ? 3 : 4).map((item) => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul></article>;
          })}
        </div>
      </section>
      <section className="nt-section nt-service-cta"><div className="nt-container nt-simple-cta"><div><span className="nt-overline">هل لديك سؤال؟</span><h2>لنبدأ من <span>احتياجك.</span></h2></div><Link className="nt-button nt-button-primary" href="/contact">اطلب استشارة <span aria-hidden="true">↗</span></Link></div></section>
    </>
  );
}
