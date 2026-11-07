import DashboardWorkspace from "@/components/dashboard/DashboardWorkspace";

export function generateStaticParams() {
  return [{ id: "USR-008" }, { id: "USR-004" }];
}

export default async function Page({ params }) {
  const { id } = await params;
  return <DashboardWorkspace mode="detail" entity="users" recordId={id} title="تفاصيل المستخدم" description="بيانات ثابتة للعرض فقط — لا يوجد مستخدم مسجل فعليًا." />;
}
