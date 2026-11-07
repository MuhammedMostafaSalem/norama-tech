import Link from "next/link";
import ProjectsBrowser from "@/components/public/ProjectsBrowser";

export default function Page() {
  return <>
    <section className="nt-page-hero nt-projects-hero"><div className="nt-container nt-page-hero-grid"><div><span className="nt-overline">أعمالنا</span><h1>نماذج رقمية، <span>وأفكار قابلة للنمو.</span></h1></div><p>استكشف مجموعة من المفاهيم التوضيحية التي تعكس طريقة التفكير في المنتج والتجربة.</p></div><div className="nt-container nt-breadcrumb"><Link href="/">الرئيسية</Link><span aria-hidden="true">/</span><span>المشاريع</span></div></section>
    <section className="nt-section nt-project-listing"><div className="nt-container"><ProjectsBrowser /></div></section>
  </>;
}
