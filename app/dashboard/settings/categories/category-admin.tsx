'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { CategoryForm } from './category-form'
import { CategoryList } from './category-list'
import { useRouter } from 'next/router'

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
  };

export function CategoryAdminComponent({categories, onSubmit}:CategoryProps) {
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
        // In a real application, you would send a PUT request to your API here
        setEditingCategory(null)
    }

    const handleDeleteCategory = (id: string) => {
        // In a real application, you would send a DELETE request to your API here
        
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
                    onSubmit={handleUpdateCategory} 
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