import { notFound } from "next/navigation";
import ProjectDetailsPage from "@/components/public/ProjectDetailsPage";
import { PROJECTS } from "@/data/norama";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export default async function Page({ params }) {
  const { slug } = await params;
  const project = PROJECTS.find((item) => item.slug === slug);
  if (!project) notFound();
  return <ProjectDetailsPage project={project} />;
}
