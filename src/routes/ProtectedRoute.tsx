import { useAuth } from "@/hooks/useAuth";
import BoardProvider from "@/providers/BoardProvider";
import ColumnProvider from "@/providers/ColumnProvider";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const { user } = useAuth();

  return user ? (
    <BoardProvider>
      <ColumnProvider>
        <Outlet />
      </ColumnProvider>
    </BoardProvider>
  ) : (
    <Navigate to={"/login"} />
  );
}
