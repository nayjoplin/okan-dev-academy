import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole, AppRole } from "@/hooks/useUserRole";
import { Loader2 } from "lucide-react";

interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles: AppRole[];
  redirectTo?: string;
}

export function RoleRoute({
  children,
  allowedRoles,
  redirectTo = "/login",
}: RoleRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const { roles, isLoading: rolesLoading } = useUserRole();

  if (authLoading || rolesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  const hasAllowedRole = roles?.some((role) => allowedRoles.includes(role));

  if (!hasAllowedRole) {
    // Redirect based on their actual role
    if (roles?.includes("admin")) {
      return <Navigate to="/admin" replace />;
    }
    if (roles?.includes("mentor")) {
      return <Navigate to="/mentor" replace />;
    }
    if (roles?.includes("student")) {
      return <Navigate to="/app" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
