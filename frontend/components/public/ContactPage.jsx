import { FiMail, FiMapPin, FiMessageCircle } from "react-icons/fi";
import ContactForm from "@/components/public/ContactForm";

const contactChannels = [
  { icon: FiMail, title: "البريد الإلكتروني", value: "يُضاف عند تجهيز بيانات الشركة" },
  { icon: FiMessageCircle, title: "واتساب", value: "يتطلب رقم الشركة المعتمد" },
  { icon: FiMapPin, title: "الموقع", value: "تُضاف بيانات الموقع لاحقًا" },
];

export default function ContactPage() {
  return (
    <>
      <section className="nt-page-hero nt-contact-hero"><div className="nt-container nt-page-hero-grid"><div><span className="nt-overline">تواصل معنا</span><h1>فكرتك تستحق <span>بداية واضحة.</span></h1></div><p>شاركنا الهدف الذي تريد الوصول إليه، وسنساعدك على تحويله إلى خطوات قابلة للتنفيذ.</p></div></section>
      <section className="nt-section nt-contact-section"><div className="nt-container nt-contact-layout"><div className="nt-contact-copy"><span className="nt-overline">لنبدأ الحديث</span><h2>أخبرنا عن <span>مشروعك.</span></h2><p>أكمل النموذج لإلقاء نظرة على تجربة التواصل. هذه النسخة لا ترسل الرسائل ولا تحفظها لعدم وجود backend.</p><div className="nt-contact-channel-list">{contactChannels.map(({ icon: Icon, title, value }) => <div className="nt-contact-channel" key={title}><span className="nt-contact-channel-icon"><Icon aria-hidden="true" /></span><span><strong>{title}</strong><small>{value}</small></span></div>)}</div></div><div className="nt-contact-form-card"><ContactForm /></div></div></section>
    </>
  );
}
