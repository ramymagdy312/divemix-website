import AdminLayoutClient from "./AdminLayoutClient";

/**
 * Server layout: keeps this segment free of a client-only root so global CSS
 * from `app/layout.tsx` and Tailwind apply to the admin shell.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
