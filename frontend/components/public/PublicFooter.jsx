import Link from "next/link";
import BrandLink from "@/components/BrandLink";

const footerLinks = [
  { href: "/about", label: "من نحن" },
  { href: "/services", label: "الخدمات" },
  { href: "/projects", label: "المشاريع" },
  { href: "/faq", label: "الأسئلة الشائعة" },
  { href: "/contact", label: "تواصل معنا" },
];

export default function PublicFooter() {
  return (
    <footer className="nt-footer">
      <div className="nt-container">
        <div className="nt-footer-top">
          <div className="nt-footer-brand">
            <BrandLink />
            <p>نحوّل الأفكار الواضحة إلى تجارب رقمية عملية، مصممة لتكبر مع أعمالك.</p>
          </div>
          <div className="nt-footer-links">
            <span className="nt-overline">روابط سريعة</span>
            {footerLinks.map((item) => (
              <Link key={item.href} href={item.href}>{item.label}</Link>
            ))}
          </div>
          <div className="nt-footer-contact">
            <span className="nt-overline">لديك فكرة؟</span>
            <p>أخبرنا بما تريد بناءه، وسنبدأ من الهدف لا من الأدوات.</p>
            <Link className="nt-text-link" href="/contact">تحدث عن مشروعك <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
        <div className="nt-footer-bottom">
          <span>© {new Date().getFullYear()} Norama Tech</span>
          <span>واجهة تعريفية مستقلة — لا تُرسل النماذج أو تحفظ بيانات المستخدمين.</span>
        </div>
      </div>
    </footer>
  );
}
