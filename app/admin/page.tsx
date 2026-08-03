import AdminRoute from "@/app/components/AdminRoute";
import AdminPage from "@/app/components/AdminPage";

export default function Page() {
  return (
    <AdminRoute>
      <AdminPage />
    </AdminRoute>
  );
}