import Link from "next/link";
import { LOGO_SOURCE_URL } from "@/data/norama";

export default function BrandLink({ compact = false, onClick }) {
  return (
    <Link
      className={`nt-brand${compact ? " nt-brand-compact" : ""}`}
      href="/"
      onClick={onClick}
    >
      <img
        className="nt-brand-mark"
        src={LOGO_SOURCE_URL}
        alt="شعار نوراما تك"
      />
      <span className="nt-brand-copy">
        <span className="nt-brand-name">Norama Tech</span>
        {!compact && <span className="nt-brand-tagline">نبني ما هو قادم</span>}
      </span>
    </Link>
  );
}
