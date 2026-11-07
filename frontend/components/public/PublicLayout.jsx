import PublicFooter from "@/components/public/PublicFooter";
import PublicHeader from "@/components/public/PublicHeader";

export default function PublicLayout({ children }) {
  return (
    <div className="nt-public-frame">
      <PublicHeader />
      <main>{children}</main>
      <PublicFooter />
    </div>
  );
}
