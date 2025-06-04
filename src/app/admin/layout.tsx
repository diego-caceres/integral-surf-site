import { cookies } from "next/headers";
// import { redirect } from "next/navigation"; // Removed unused import
import AdminLoginForm from "./components/AdminLoginForm"; // We will create this component
import AdminNavbar from "./components/AdminNavbar"; // We will create this component

const ADMIN_AUTH_COOKIE_NAME = "integralsurf-admin-auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isAuthenticated =
    cookieStore.get(ADMIN_AUTH_COOKIE_NAME)?.value === "true";

  if (!isAuthenticated) {
    // If not authenticated, show the login form.
    // The AdminLoginForm will handle the actual login submission to an API route.
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl">
          <h1 className="text-3xl font-bold text-center text-primary mb-6">
            Admin Login
          </h1>
          <AdminLoginForm />
        </div>
      </div>
    );
  }

  // If authenticated, show the admin content with a simple navbar for logout
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <main className="p-4 md:p-8">{children}</main>
    </div>
  );
}
