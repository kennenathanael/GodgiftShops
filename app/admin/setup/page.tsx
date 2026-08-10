import { prisma } from "@/lib/prisma";
import SetupForm from "./SetupForm";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  const adminCount = await prisma.admin.count();

  if (adminCount > 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm text-center">
          <p className="mb-4">
            Setup already completed. An admin account already exists.
          </p>
          <a href="/admin/login" className="text-brand underline">
            Go to login
          </a>
        </div>
      </div>
    );
  }

  return <SetupForm />;
}
