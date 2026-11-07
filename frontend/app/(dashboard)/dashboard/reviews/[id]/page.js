import DashboardWorkspace from "@/components/dashboard/DashboardWorkspace";

export function generateStaticParams() {
  return [{ id: "REV-003" }, { id: "REV-001" }];
}

export default async function Page({ params }) {
  const { id } = await params;
  return <DashboardWorkspace mode="detail" entity="reviews" recordId={id} title="تفاصيل التقييم" description="سجل توضيحي ثابت — لا يوجد تقييم مستخدم فعلي." />;
}
