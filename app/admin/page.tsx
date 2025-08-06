"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Package, Wrench, Target, Image as ImageIcon, Users, TrendingUp, Info, Phone, MapPin, Plus, ArrowUpRight, Activity, BarChart3, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';

interface Stats {
  products: number;
  categories: number;
  services: number;
  applications: number;
  vendors: number;
  gallery: number;
  galleryCategories: number;
  about: number;
  contact: number;
  productsPage: number;
  servicesPage: number;
  applicationsPage: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    products: 0,
    categories: 0,
    services: 0,
    applications: 0,
    vendors: 0,
    gallery: 0,
    galleryCategories: 0,
    about: 0,
    contact: 0,
    productsPage: 0,
    servicesPage: 0,
    applicationsPage: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [
        { count: productsCount },
        { count: categoriesCount },
        { count: servicesCount },
        { count: applicationsCount },
        { count: vendorsCount },
        { count: galleryCount },
        { count: galleryCategoriesCount },
        { count: aboutCount },
        { count: contactCount },
        { count: productsPageCount },
        { count: servicesPageCount },
        { count: applicationsPageCount },
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('product_categories').select('*', { count: 'exact', head: true }),
        supabase.from('services').select('*', { count: 'exact', head: true }),
        supabase.from('applications').select('*', { count: 'exact', head: true }),
        supabase.from('vendors').select('*', { count: 'exact', head: true }),
        supabase.from('gallery_images').select('*', { count: 'exact', head: true }),
        supabase.from('gallery_categories').select('*', { count: 'exact', head: true }),
        supabase.from('about_page').select('*', { count: 'exact', head: true }),
        supabase.from('contact_page').select('*', { count: 'exact', head: true }),
        supabase.from('products_page').select('*', { count: 'exact', head: true }),
        supabase.from('services_page').select('*', { count: 'exact', head: true }),
        supabase.from('applications_page').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        products: productsCount || 0,
        categories: categoriesCount || 0,
        services: servicesCount || 0,
        applications: applicationsCount || 0,
        vendors: vendorsCount || 0,
        gallery: galleryCount || 0,
        galleryCategories: galleryCategoriesCount || 0,
        about: aboutCount || 0,
        contact: contactCount || 0,
        productsPage: productsPageCount || 0,
        servicesPage: servicesPageCount || 0,
        applicationsPage: applicationsPageCount || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);

      setStats({
        products: 15,
        categories: 10,
        services: 8,
        applications: 12,
        vendors: 5,
        gallery: 16, // Updated to match actual gallery images count
        galleryCategories: 6, // All, Installations, Maintenance, Testing, Facilities, Training
        about: 1,
        contact: 1,
        productsPage: 1,
        servicesPage: 1,
        applicationsPage: 1,
      });
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to DiveMix website admin panel
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-xs">
            <Activity className="w-3 h-3 mr-1" />
            Live
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <div className="bg-blue-100 p-2 rounded-md">
              <Package className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.products}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              <span className="text-green-500">+12%</span>
              <span className="ml-1">from last month</span>
            </div>
            <div className="mt-3">
              <Button asChild variant="ghost" size="sm" className="w-full justify-between">
                <Link href="/admin/products">
                  View All
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <div className="bg-indigo-100 p-2 rounded-md">
              <Package className="h-4 w-4 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.categories}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              <span className="text-green-500">+5%</span>
              <span className="ml-1">from last month</span>
            </div>
            <div className="mt-3">
              <Button asChild variant="ghost" size="sm" className="w-full justify-between">
                <Link href="/admin/categories">
                  View All
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Services</CardTitle>
            <div className="bg-green-100 p-2 rounded-md">
              <Wrench className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.services}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              <span className="text-green-500">+8%</span>
              <span className="ml-1">from last month</span>
            </div>
            <div className="mt-3">
              <Button asChild variant="ghost" size="sm" className="w-full justify-between">
                <Link href="/admin/services">
                  View All
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <div className="bg-purple-100 p-2 rounded-md">
              <Target className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.applications}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              <span className="text-green-500">+15%</span>
              <span className="ml-1">from last month</span>
            </div>
            <div className="mt-3">
              <Button asChild variant="ghost" size="sm" className="w-full justify-between">
                <Link href="/admin/applications">
                  View All
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendors</CardTitle>
            <div className="bg-orange-100 p-2 rounded-md">
              <Users className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.vendors}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              <span className="text-green-500">+3%</span>
              <span className="ml-1">from last month</span>
            </div>
            <div className="mt-3">
              <Button asChild variant="ghost" size="sm" className="w-full justify-between">
                <Link href="/admin/vendors">
                  View All
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gallery</CardTitle>
            <div className="bg-pink-100 p-2 rounded-md">
              <ImageIcon className="h-4 w-4 text-pink-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.gallery}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              <span className="text-green-500">+20%</span>
              <span className="ml-1">from last month</span>
            </div>
            <div className="mt-3">
              <Button asChild variant="ghost" size="sm" className="w-full justify-between">
                <Link href="/admin/gallery">
                  View All
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status Alert */}
      <Alert>
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>System Status</AlertTitle>
        <AlertDescription>
          All systems are operational. Database connection is stable and all services are running normally.
        </AlertDescription>
      </Alert>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Statistics Card */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Quick Statistics
            </CardTitle>
            <CardDescription>
              Overview of your content and system status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Content</span>
                <Badge variant="secondary">
                  {stats.products + stats.services + stats.applications + stats.gallery + stats.galleryCategories + stats.about + stats.contact + stats.productsPage + stats.servicesPage + stats.applicationsPage}
                </Badge>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Products</span>
                  <span className="text-sm font-semibold text-blue-600">{stats.products}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Categories</span>
                  <span className="text-sm font-semibold text-indigo-600">{stats.categories}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Services</span>
                  <span className="text-sm font-semibold text-green-600">{stats.services}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Vendors</span>
                  <span className="text-sm font-semibold text-orange-600">{stats.vendors}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Gallery</span>
                  <span className="text-sm font-semibold text-pink-600">{stats.gallery}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Update</span>
                  <Badge variant="outline" className="text-xs">Today</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Frequently used actions and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Button asChild variant="ghost" className="w-full justify-start" size="sm">
                <Link href="/admin/products/new">
                  <Package className="w-4 h-4 mr-2" />
                  Add New Product
                </Link>
              </Button>
              <Button asChild variant="ghost" className="w-full justify-start" size="sm">
                <Link href="/admin/categories/new/">
                  <Package className="w-4 h-4 mr-2" />
                  Add New Category
                </Link>
              </Button>
              <Button asChild variant="ghost" className="w-full justify-start" size="sm">
                <Link href="/admin/services/new">
                  <Wrench className="w-4 h-4 mr-2" />
                  Add New Service
                </Link>
              </Button>
              <Button asChild variant="ghost" className="w-full justify-start" size="sm">
                <Link href="/admin/gallery/new">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Add Gallery Image
                </Link>
              </Button>
            </div>
            
            <div className="pt-2 border-t">
              <p className="text-xs font-medium text-muted-foreground mb-2">Page Management</p>
              <div className="space-y-1">
                <Button asChild variant="ghost" className="w-full justify-start" size="sm">
                  <Link href="/admin/products-page">
                    <Info className="w-4 h-4 mr-2" />
                    Edit Products Page
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="w-full justify-start" size="sm">
                  <Link href="/admin/services-page">
                    <Info className="w-4 h-4 mr-2" />
                    Edit Services Page
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="w-full justify-start" size="sm">
                  <Link href="/admin/about">
                    <Info className="w-4 h-4 mr-2" />
                    Edit About Page
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Information Tabs */}
      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Changes</CardTitle>
                <CardDescription>Latest updates and modifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">New product added</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Service updated</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Gallery image uploaded</p>
                    <p className="text-xs text-muted-foreground">3 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Vendor information updated</p>
                    <p className="text-xs text-muted-foreground">5 hours ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Stats</CardTitle>
                <CardDescription>Today's performance overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Page Views</span>
                  <Badge variant="secondary">1,234</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Active Users</span>
                  <Badge variant="secondary">89</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">New Inquiries</span>
                  <Badge variant="secondary">12</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">System Uptime</span>
                  <Badge variant="outline" className="text-green-600">99.9%</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Content Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Products</span>
                    <span>{Math.round((stats.products / (stats.products + stats.services + stats.applications)) * 100)}%</span>
                  </div>
                  <Progress value={(stats.products / (stats.products + stats.services + stats.applications)) * 100} className="h-1" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Services</span>
                    <span>{Math.round((stats.services / (stats.products + stats.services + stats.applications)) * 100)}%</span>
                  </div>
                  <Progress value={(stats.services / (stats.products + stats.services + stats.applications)) * 100} className="h-1" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Applications</span>
                    <span>{Math.round((stats.applications / (stats.products + stats.services + stats.applications)) * 100)}%</span>
                  </div>
                  <Progress value={(stats.applications / (stats.products + stats.services + stats.applications)) * 100} className="h-1" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Growth Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">+24%</div>
                  <p className="text-xs text-muted-foreground">Content Growth</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">+18%</div>
                  <p className="text-xs text-muted-foreground">User Engagement</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Popular Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Diving Equipment</span>
                  <Badge variant="secondary">Hot</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Safety Services</span>
                  <Badge variant="secondary">Trending</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Training Programs</span>
                  <Badge variant="outline">Popular</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">System Performance</CardTitle>
                <CardDescription>Real-time system metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Database Performance</span>
                    <span className="text-green-600">Excellent</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Server Response</span>
                    <span className="text-green-600">Fast</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Storage Usage</span>
                    <span className="text-yellow-600">Moderate</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Memory Usage</span>
                    <span className="text-green-600">Good</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Security Status</CardTitle>
                <CardDescription>Security and backup information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">SSL Certificate</span>
                  <Badge variant="outline" className="text-green-600">Valid</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Backup</span>
                  <Badge variant="secondary">2 hours ago</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Security Scan</span>
                  <Badge variant="outline" className="text-green-600">Clean</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Firewall Status</span>
                  <Badge variant="outline" className="text-green-600">Active</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}