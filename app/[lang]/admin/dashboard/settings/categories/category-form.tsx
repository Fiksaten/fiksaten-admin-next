import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Category = {
  description: string;
  categoryName: string;
  categoryImageUrl: string;
  id: string;
  created_at?: string | undefined;
  updated_at?: string | undefined;
};

export type CreateCategory = Omit<Category, "id" | "created_at" | "updated_at">

type CategoryFormProps = {
  category?: Category;
  onSubmit: (
    category: Omit<Category, "id" | "created_at" | "updated_at">
  ) => void;
  onCancel: () => void;
};

export function CategoryForm({
  category,
  onSubmit,
  onCancel,
}: CategoryFormProps) {
  const [formData, setFormData] = useState({
    categoryName: "",
    description: "",
    categoryImageUrl: "",
  });

  useEffect(() => {
    if (category) {
      setFormData({
        categoryName: category.categoryName,
        description: category.description,
        categoryImageUrl: category.categoryImageUrl,
      });
    }
  }, [category]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-4">
      <Input
        name="categoryName"
        value={formData.categoryName}
        onChange={handleChange}
        placeholder="Category Name"
        required
        className="text-black"
      />
      <Textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        required
        className="text-black"
      />
      <Input
        name="categoryImageUrl"
        value={formData.categoryImageUrl}
        onChange={handleChange}
        placeholder="Image URL"
        required
        className="text-black"
      />
      <div className="flex space-x-2">
        <Button type="submit" className="text-black">
          <p className="text-black">{category ? "Update" : "Create"}</p>
        </Button>
        <Button
          type="button"
          className="text-black"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
