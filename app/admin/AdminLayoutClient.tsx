"use client";

import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { supabase } from "../lib/supabase";
import { User } from "@supabase/supabase-js";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import LoginForm from "./components/LoginForm";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/app/components/ui/sidebar";
import { Separator } from "@/app/components/ui/separator";
import DynamicBreadcrumb from "./components/DynamicBreadcrumb";
import { LanguagesProvider } from "@/app/lib/i18n/LanguagesProvider";
import { SetHtmlDocument } from "@/app/components/SetHtmlDocument";

function AdminShell({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <LanguagesProvider>
      <SidebarProvider defaultOpen={true}>
        <AdminSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <DynamicBreadcrumb />
            </div>
            <div className="ml-auto px-3">
              <AdminHeader user={user} />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <main className="flex-1 space-y-4">{children}</main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </LanguagesProvider>
  );
}

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SetHtmlDocument lang="en" dir="ltr" className="" />
      <AdminShell>{children}</AdminShell>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            style: { background: "#10b981" },
          },
          error: {
            duration: 5000,
            style: { background: "#ef4444" },
          },
        }}
      />
    </>
  );
}
