"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Package, Wrench, Target, Image, TrendingUp, Info, Phone } from 'lucide-react';

interface Stats {
  products: number;
  services: number;
  applications: number;
  gallery: number;
  about: number;
  contact: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    products: 0,
    services: 0,
    applications: 0,
    gallery: 0,
    about: 0,
    contact: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Check if Supabase is properly configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || 
          supabaseUrl === 'your-supabase-url' || 
          supabaseKey === 'your-supabase-anon-key' ||
          supabaseUrl === 'https://placeholder.supabase.co' ||
          supabaseKey === 'placeholder-key') {
        // Use mock data for development
        console.warn('Supabase not configured. Using mock data.');
        setStats({
          products: 15,
          services: 8,
          applications: 12,
          gallery: 25,
          about: 1,
          contact: 1,
        });
        setLoading(false);
        return;
      }

      const [
        { count: productsCount },
        { count: servicesCount },
        { count: applicationsCount },
        { count: galleryCount },
        { count: aboutCount },
        { count: contactCount },
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('services').select('*', { count: 'exact', head: true }),
        supabase.from('applications').select('*', { count: 'exact', head: true }),
        supabase.from('gallery_images').select('*', { count: 'exact', head: true }),
        supabase.from('about_page').select('*', { count: 'exact', head: true }),
        supabase.from('contact_page').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        products: productsCount || 0,
        services: servicesCount || 0,
        applications: applicationsCount || 0,
        gallery: galleryCount || 0,
        about: aboutCount || 0,
        contact: contactCount || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Fallback to mock data on error
      setStats({
        products: 15,
        services: 8,
        applications: 12,
        gallery: 25,
        about: 1,
        contact: 1,
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: 'Products',
      value: stats.products,
      icon: Package,
      color: 'bg-blue-500',
      href: '/admin/products',
    },
    {
      name: 'Services',
      value: stats.services,
      icon: Wrench,
      color: 'bg-green-500',
      href: '/admin/services',
    },
    {
      name: 'Applications',
      value: stats.applications,
      icon: Target,
      color: 'bg-purple-500',
      href: '/admin/applications',
    },
    {
      name: 'Gallery',
      value: stats.gallery,
      icon: Image,
      color: 'bg-pink-500',
      href: '/admin/gallery',
    },
    {
      name: 'About Page',
      value: stats.about,
      icon: Info,
      color: 'bg-indigo-500',
      href: '/admin/about',
    },
    {
      name: 'Contact Page',
      value: stats.contact,
      icon: Phone,
      color: 'bg-orange-500',
      href: '/admin/contact',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to DiveMix website admin panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {statCards.map((card) => (
          <div
            key={card.name}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`${card.color} rounded-md p-3`}>
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {card.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {card.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <a
                  href={card.href}
                  className="font-medium text-cyan-700 hover:text-cyan-900 transition-colors"
                >
                  View All
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Statistics</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Content</span>
              <span className="text-lg font-semibold text-gray-900">
                {stats.products + stats.services + stats.applications + stats.gallery + stats.about + stats.contact}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Products</span>
              <span className="text-lg font-semibold text-green-600">{stats.products}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Update</span>
              <span className="text-sm text-gray-500">Today</span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a
              href="/admin/products/new"
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              Add New Product
            </a>
            <a
              href="/admin/services/new"
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              Add New Service
            </a>
            <a
              href="/admin/gallery/new"
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              Add Image to Gallery
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}