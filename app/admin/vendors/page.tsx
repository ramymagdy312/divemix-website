"use client";

import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import {
  Edit,
  ExternalLink,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabase";

interface Vendor {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string;
  description?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const { data, error } = await supabase
        .from("vendors")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error fetching vendors:", error);
        toast.error("Failed to load vendors");
        return;
      }

      setVendors(data || []);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load vendors");
    } finally {
      setLoading(false);
    }
  };

  const toggleVendorStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("vendors")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) {
        console.error("Error updating vendor status:", error);
        toast.error("Failed to update vendor status");
        return;
      }

      setVendors((prev) =>
        prev.map((vendor) =>
          vendor.id === id ? { ...vendor, is_active: !currentStatus } : vendor
        )
      );

      toast.success(
        `Vendor ${!currentStatus ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update vendor status");
    }
  };

  const deleteVendor = async (id: string) => {
    setDeleting(id);
    try {
      const { error } = await supabase.from("vendors").delete().eq("id", id);

      if (error) {
        console.error("Error deleting vendor:", error);
        toast.error("Failed to delete vendor");
        return;
      }

      setVendors((prev) => prev.filter((vendor) => vendor.id !== id));
      toast.success("Vendor deleted successfully");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to delete vendor");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Users className="h-8 w-8 mr-3 text-primary" />
            Vendors Management
          </h1>
          <p className="text-muted-foreground">
            Manage your trusted partners and vendors displayed on the homepage
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/vendors/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Vendor
          </Link>
        </Button>
      </div>

      {/* Vendors Table or Empty State */}
      {vendors.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No vendors yet
          </h3>
          <p className="text-gray-500 mb-4">
            Get started by adding your first vendor.
          </p>
          <Button asChild>
            <Link href="/admin/vendors/new">
              <Plus className="h-4 w-4 mr-2" />
              Add First Vendor
            </Link>
          </Button>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>
                  {[
                    "Vendor",
                    "Description",
                    "Website",
                    "Order",
                    "Status",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {vendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-muted/40">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="relative h-12 w-12 mr-4">
                          <Image
                            src={vendor.logo_url}
                            alt={`${vendor.name} logo`}
                            fill
                            className="object-contain rounded"
                          />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-foreground">
                            {vendor.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Added{" "}
                            {new Date(vendor.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-foreground max-w-xs truncate">
                        {vendor.description || "No description"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {vendor.website_url ? (
                        <a
                          href={vendor.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-600 hover:text-cyan-700 flex items-center text-sm"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Visit
                        </a>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          No website
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {vendor.display_order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        className="cursor-pointer"
                        onClick={() =>
                          toggleVendorStatus(vendor.id, vendor.is_active)
                        }
                      >
                        {vendor.is_active ? (
                          <>
                            <Eye className="h-3 w-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/admin/vendors/${vendor.id}/edit`}
                          className="text-cyan-600 hover:text-cyan-700"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => deleteVendor(vendor.id)}
                          disabled={deleting === vendor.id}
                          className="text-red-600 hover:text-red-700 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: <Users className="h-8 w-8 text-cyan-600" />,
            label: "Total Vendors",
            value: vendors.length,
          },
          {
            icon: <Eye className="h-8 w-8 text-green-600" />,
            label: "Active Vendors",
            value: vendors.filter((v) => v.is_active).length,
          },
          {
            icon: <EyeOff className="h-8 w-8 text-red-600" />,
            label: "Inactive Vendors",
            value: vendors.filter((v) => !v.is_active).length,
          },
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6 flex items-center">
              <div className="flex-shrink-0">{stat.icon}</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-2xl font-semibold text-foreground">
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
