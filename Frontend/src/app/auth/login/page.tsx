// app/login/page.tsx
import LoginForm from "@/components/LoginForm/LoginForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const accessToken = (await cookies()).get("accessToken");
  if (accessToken) redirect("/");

  return (
    <div className="fixed top-0 left-0 min-h-screen flex flex-row w-full ">
      <div className="w-full bg-[#0d87d2]/80 flex flex-col items-center justify-center p-8 relative">
        <div className="max-w-md w-full space-y-8 z-2 shadow-lg rounded-xl border">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}