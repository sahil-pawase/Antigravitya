import React from "react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { AdminLeadsClient } from "@/components/admin/AdminLeadsClient";

export default async function AdminLeadsPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/login?redirect=/admin&error=admin_required");
  }

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <AdminLeadsClient initialLeads={leads} />;
}
