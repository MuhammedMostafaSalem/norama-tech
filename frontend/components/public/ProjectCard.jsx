import Link from "next/link";

export default function ProjectCard({ project }) {
  return (
    <article className="nt-project-card">
      <Link className="nt-project-image-link" href={`/projects/${project.slug}`} aria-label={`عرض مشروع ${project.name}`}>
        <img className="nt-project-image" src={project.image} alt={project.imageAlt} loading="lazy" />
        <span className="nt-project-image-arrow" aria-hidden="true">↗</span>
      </Link>
      <div className="nt-project-card-copy">
        <div className="nt-project-meta">
          <span>{project.category}</span>
          <span className="nt-concept-tag">{project.type}</span>
        </div>
        <h3><Link href={`/projects/${project.slug}`}>{project.name}</Link></h3>
        <p>{project.summary}</p>
      </div>
    </article>
  );
}
