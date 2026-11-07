import Link from "next/link";
import BrandLink from "@/components/BrandLink";

export default function AuthLayout({ children }) {
  return (
    <main className="nt-auth-frame">
      <section className="nt-auth-aside">
        <BrandLink />
        <div className="nt-auth-aside-copy"><span className="nt-overline">NORAMA TECH</span><h2>تقنية أوضح.<br /><span>تجربة أفضل.</span></h2><p>واجهات الحسابات هنا للمعاينة فقط، دون تسجيل أو حفظ بيانات.</p></div>
        <Link href="/" className="nt-auth-back">← العودة إلى الموقع</Link>
      </section>
      <section className="nt-auth-main">{children}</section>
    </main>
  );
}
