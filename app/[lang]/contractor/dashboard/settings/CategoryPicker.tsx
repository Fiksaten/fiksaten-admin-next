"use client";
import React, { useState } from "react";
import { Category } from "@/app/lib/types";
import { buildApiUrl } from "@/app/lib/utils";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const CategoryPicker = ({
  categories,
  selectedCategoryIds,
  accessToken,
}: {
  categories: Category[];
  selectedCategoryIds: string[];
  accessToken: string;
}) => {
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(selectedCategoryIds);

  const handleValueAdd = (category: string) => {
    if (!selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleRemoveCategory = (category: string) => {
    setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
  };

  const isCategorySelected = (category: string) =>
    selectedCategories.includes(category);

  const handlePillPress = (category: string) => {
    if (isCategorySelected(category)) {
      handleRemoveCategory(category);
    } else {
      handleValueAdd(category);
    }
  };

  const handleSave = async () => {
    try {
      const url = buildApiUrl("/contractors/me/categories");
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ categories: selectedCategories }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        console.log("Kategoriat tallennettu onnistuneesti.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-black">Valitse kategoriat</h1>
      <div>
        {!categories.length && (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          </div>
        )}
        <h2 className="text-xl font-bold text-black">
          Valitse haluamasi kategoriat
        </h2>
        <p className="pb-4 text-black">Löydä töitä sinun osaamisalueeltasi.</p>
        <div className="flex flex-wrap mt-4">
          {categories?.map((category, index) => (
            <button
              key={index}
              className={`rounded-full px-4 py-2 m-1 flex items-center ${
                isCategorySelected(category.id)
                  ? "bg-yellow-400"
                  : "bg-gray-300"
              }`}
              onClick={() => handlePillPress(category.id)}
            >
              <span
                className={`mr-2 text-sm font-bold ${
                  isCategorySelected(category.id) ? "text-black" : "text-white"
                }`}
              >
                {category.categoryName}
              </span>
              {isCategorySelected(category.id) ? <Check /> : <X />}
            </button>
          ))}
        </div>
        <Button onClick={handleSave}>Tallenna</Button>
      </div>
    </div>
  );
};

export default CategoryPicker;
