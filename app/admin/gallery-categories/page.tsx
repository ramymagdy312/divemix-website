"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

import { Edit, Save, X, Plus, Trash2, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import Breadcrumb from '../../components/admin/Breadcrumb';
import toast from 'react-hot-toast';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Switch } from '@/app/components/ui/switch';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/app/components/ui/alert-dialog';

export default function GalleryCategoriesAdmin() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    slug: '',
    display_order: 0,
    is_active: true
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error);
        setData([]);
      } else {
        setData(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleSave = async (category: any) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('gallery_categories')
        .update({
          name: category.name,
          description: category.description,
          slug: category.slug,
          display_order: category.display_order,
          is_active: category.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', category.id);

      if (error) {
        console.error('Error updating category:', error);
        toast.error('Error updating category');
      } else {
        setEditingId(null);
        fetchCategories();
        toast.success('Category updated successfully!');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error updating category');
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = async () => {
    setSaving(true);
    try {
      const slug = newCategory.slug || generateSlug(newCategory.name);

      const { error } = await supabase
        .from('gallery_categories')
        .insert({
          name: newCategory.name,
          description: newCategory.description,
          slug,
          display_order: newCategory.display_order,
          is_active: newCategory.is_active
        });

      if (error) {
        console.error('Error adding category:', error);
        toast.error('Error adding category');
      } else {
        setNewCategory({ name: '', description: '', slug: '', display_order: 0, is_active: true });
        setShowAddForm(false);
        fetchCategories();
        toast.success('Category added successfully!');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error adding category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('gallery_categories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting category:', error);
        toast.error('Error deleting category');
      } else {
        fetchCategories();
        toast.success('Category deleted successfully!');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error deleting category');
    }
  };

  const handleCategoryChange = (id: string, field: string, value: any) => {
    setData((data || []).map((cat: any) => 
      cat.id === id ? { ...cat, [field]: value } : cat
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb items={[
        { name: 'Gallery Categories' }
      ]} />
      
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <ImageIcon className="h-8 w-8 mr-3 text-primary" />
            Gallery Categories
          </h1>
          <p className="text-muted-foreground">Manage gallery image categories</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Category</CardTitle>
            <CardDescription>
              Create a new gallery category to organize your images
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category-name">Name</Label>
                <Input
                  id="category-name"
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setNewCategory({ 
                      ...newCategory, 
                      name,
                      slug: newCategory.slug || generateSlug(name)
                    });
                  }}
                  placeholder="Category name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category-slug">Slug</Label>
                <Input
                  id="category-slug"
                  type="text"
                  value={newCategory.slug}
                  onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                  placeholder="category-slug"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="display-order">Display Order</Label>
                <Input
                  id="display-order"
                  type="number"
                  value={newCategory.display_order}
                  onChange={(e) => setNewCategory({ ...newCategory, display_order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={newCategory.is_active}
                    onCheckedChange={(checked) => setNewCategory({ ...newCategory, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Label htmlFor="category-description">Description</Label>
              <Textarea
                id="category-description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                rows={3}
                placeholder="Category description"
              />
            </div>
            <div className="flex space-x-2 mt-6">
              <Button
                onClick={handleAdd}
                disabled={saving || !newCategory.name}
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Adding...' : 'Add Category'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddForm(false);
                  setNewCategory({ name: '', description: '', slug: '', display_order: 0, is_active: true });
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories List */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>
            Manage your gallery categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data || []).map((category: any) => (
                <TableRow key={category.id}>
                  <TableCell>
                    {editingId === category.id ? (
                      <Input
                        type="text"
                        value={category.name}
                        onChange={(e) => handleCategoryChange(category.id, 'name', e.target.value)}
                      />
                    ) : (
                      <div>
                        <div className="font-medium">{category.name}</div>
                        {category.description && (
                          <div className="text-sm text-muted-foreground">{category.description}</div>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === category.id ? (
                      <Input
                        type="text"
                        value={category.slug}
                        onChange={(e) => handleCategoryChange(category.id, 'slug', e.target.value)}
                      />
                    ) : (
                      <span className="text-sm">{category.slug}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === category.id ? (
                      <Input
                        type="number"
                        value={category.display_order}
                        onChange={(e) => handleCategoryChange(category.id, 'display_order', parseInt(e.target.value) || 0)}
                        className="w-20"
                      />
                    ) : (
                      <span className="text-sm">{category.display_order}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === category.id ? (
                      <Switch
                        checked={category.is_active}
                        onCheckedChange={(checked) => handleCategoryChange(category.id, 'is_active', checked)}
                      />
                    ) : (
                      <Badge variant={category.is_active ? "default" : "secondary"}>
                        {category.is_active ? (
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
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === category.id ? (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleSave(category)}
                          disabled={saving}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingId(null);
                            fetchCategories();
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingId(category.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {category.slug !== 'all' && (

                          <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the category "{category.name}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(category.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      )}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}