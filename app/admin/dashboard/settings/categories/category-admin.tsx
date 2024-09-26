'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { CategoryForm } from './category-form'
import { CategoryList } from './category-list'

type Category = {
    description: string;
    categoryName: string;
    categoryImageUrl: string;
    id: string;
    created_at?: string | undefined;
    updated_at?: string | undefined;
}

type CategoryProps = {
    onSubmit: (
      newCategory: Omit<Category, 'id'>
    ) => Promise<{ message: string }>;
    categories: Category[]
    onUpdate: (
      updatedCategory: Category
    ) => Promise<{ message: string }>;
    onDelete: (
      id: string
    ) => Promise<{ message: string }>;
  };

export function CategoryAdminComponent({categories, onSubmit, onUpdate, onDelete}:CategoryProps) {
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [message, setMessage] = useState("")
    

    const handleCreateCategory = async (newCategory: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => {
        const category: Omit<Category, 'id'> = {
            ...newCategory,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
        try {
            await onSubmit(category);
            setMessage("Ok")
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            setMessage(error.message);
          }
        setIsFormOpen(false)
    }

    const handleUpdateCategory = (updatedCategory: Category) => {
        try {
            onUpdate(updatedCategory);
            setMessage("Ok")
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            setMessage(error.message);
          }
        setEditingCategory(null)
    }

    const handleDeleteCategory = (id: string) => {
        try {
            onDelete(id);
            setMessage("Ok")
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            setMessage(error.message);
          }
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl text-black font-bold mb-4">Category Management</h1>
            <Button onClick={() => setIsFormOpen(true)} className="mb-4">Create New Category</Button>
            
            {isFormOpen && (
                <CategoryForm 
                    onSubmit={handleCreateCategory} 
                    onCancel={() => setIsFormOpen(false)} 
                />
            )}

            {editingCategory && (
                <CategoryForm 
                    category={editingCategory} 
                    onSubmit={(updatedCategory) => handleUpdateCategory({ ...editingCategory, ...updatedCategory })} 
                    onCancel={() => setEditingCategory(null)} 
                />
            )}

            <CategoryList 
                categories={categories} 
                onEdit={setEditingCategory} 
                onDelete={handleDeleteCategory} 
            />
        </div>
    )
}