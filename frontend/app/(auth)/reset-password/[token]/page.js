import AuthScreen from "@/components/auth/AuthScreen";

export function generateStaticParams() {
  return [{ token: "preview" }];
}

export default function Page() {
  return <AuthScreen variant="reset" />;
}
