import Navbar from "@/components/navbar";
import AdminNavbar from "@/components/navbar/navbar";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}

      <AdminNavbar />

      {/* Main content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto md:ml-64">
        {children}
      </main>
    </div>
  );
}
