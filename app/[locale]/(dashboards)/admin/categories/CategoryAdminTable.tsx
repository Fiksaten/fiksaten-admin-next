"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/app/lib/services/categoryService";
import {
  Categories,
  Category,
  CreateCategoryBody,
} from "@/app/lib/types/categoryTypes";

interface Props {
  initialCategories: Categories;
  accessToken: string;
}

export default function CategoryAdminTable({
  initialCategories,
  accessToken,
}: Props) {
  const [categories, setCategories] = useState(initialCategories);
  const [open, setOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [form, setForm] = useState<{ name: string }>({ name: "" });
  const [loading, setLoading] = useState(false);

  const openCreate = () => {
    setEditCategory(null);
    setForm({ name: "" });
    setOpen(true);
  };
  const openEdit = (cat: Category) => {
    setEditCategory(cat);
    setForm({ name: cat.name });
    setOpen(true);
  };
  const closeDialog = () => {
    setOpen(false);
    setEditCategory(null);
    setForm({ name: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editCategory) {
        const updated = await updateCategory(accessToken, editCategory.id, {
          name: form.name,
          imageUrl: "",
          description: "",
          express: editCategory.express ?? false,
          expressPrice: editCategory.expressPrice ?? null,
        });
        setCategories((prev) =>
          prev.map((c) => (c.id === editCategory.id ? { ...c, ...updated } : c))
        );
        toast({ title: "Category updated" });
      } else {
        const newCat = await createCategory(accessToken, {
          name: form.name,
          imageUrl: "",
          description: "",
          express: false,
          expressPrice: null,
        });
        setCategories((prev) => [...prev, newCat]);
        toast({ title: "Category created" });
      }
      closeDialog();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    setLoading(true);
    try {
      await deleteCategory(accessToken, id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast({ title: "Category deleted" });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Categories</h2>
        <Button onClick={openCreate}>New Category</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((cat) => (
            <TableRow key={cat.id}>
              <TableCell>{cat.name}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  className="mr-2"
                  onClick={() => openEdit(cat)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(cat.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            {editCategory ? "Edit Category" : "New Category"}
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {editCategory ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
