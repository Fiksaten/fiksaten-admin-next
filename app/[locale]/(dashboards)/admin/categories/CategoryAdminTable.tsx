"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  Plus,
  Minus,
  Upload,
  Image as ImageIcon,
  Edit,
  Trash2,
} from "lucide-react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/app/lib/services/categoryService";
import { uploadImage } from "@/app/lib/services/imageService";
import {
  Categories,
  Category,
  CreateCategoryBody,
} from "@/app/lib/types/categoryTypes";
import Image from "next/image";

type PickerType = "DROPDOWN" | "TEXTFIELD" | "TEXTAREA" | "SWITCH";

interface ExtraQuestion {
  id?: string;
  questionText: string;
  pickerType: PickerType;
  options: string[] | null;
  affectsPrice?: boolean;
  priceFactors?: { optionId: string; priceFactor: string }[];
}

interface CategoryFormData {
  name: string;
  description: string;
  imageKey: string;
  express: boolean;
  expressPrice: string;
  platformFee: string;
  hasNeededToolsAffectsPrice: boolean;
  hasNeededToolsPriceFactor: string;
  extraQuestions: ExtraQuestion[];
}

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
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [form, setForm] = useState<CategoryFormData>({
    name: "",
    description: "",
    imageKey: "",
    express: false,
    expressPrice: "",
    platformFee: "",
    hasNeededToolsAffectsPrice: false,
    hasNeededToolsPriceFactor: "",
    extraQuestions: [],
  });

  const openCreate = () => {
    setEditCategory(null);
    setForm({
      name: "",
      description: "",
      imageKey: "",
      express: false,
      expressPrice: "",
      platformFee: "",
      hasNeededToolsAffectsPrice: false,
      hasNeededToolsPriceFactor: "",
      extraQuestions: [],
    });
    setOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditCategory(cat);
    setForm({
      name: cat.name,
      description: cat.description || "",
      imageKey: "",
      express: cat.express,
      expressPrice: cat.expressPrice || "",
      platformFee: cat.platformFee ? String(cat.platformFee) : "",
      hasNeededToolsAffectsPrice: cat.hasNeededToolsAffectsPrice ?? false,
      hasNeededToolsPriceFactor: cat.hasNeededToolsPriceFactor
        ? String(cat.hasNeededToolsPriceFactor)
        : "",
      extraQuestions:
        cat.expressCategoryQuestions?.map((q) => ({
          id: q.id,
          questionText: q.questionText,
          pickerType: q.pickerType,
          options:
            q.options?.filter((opt): opt is string => opt !== null) || null,
          affectsPrice: q.affectsPrice ?? false,
          priceFactors: q.priceFactors
            ? q.priceFactors.map((pf) => ({
                optionId: pf.optionId,
                priceFactor: pf.priceFactor ? String(pf.priceFactor) : "",
              }))
            : [],
        })) || [],
    });
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    setEditCategory(null);
    setForm({
      name: "",
      description: "",
      imageKey: "",
      express: false,
      expressPrice: "",
      platformFee: "",
      hasNeededToolsAffectsPrice: false,
      hasNeededToolsPriceFactor: "",
      extraQuestions: [],
    });
  };

  const handleInputChange = (
    field: keyof CategoryFormData,
    value: string | boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setImageUploading(true);
    try {
      const { imageKey, imageUrl } = await uploadImage(accessToken, file);
      setImageUrl(imageUrl);
      setForm((prev) => ({
        ...prev,
        imageKey,
      }));
      toast({ title: "Image uploaded successfully" });
    } catch (error) {
      console.error("Image upload error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setImageUploading(false);
    }
  };

  const addExtraQuestion = () => {
    const newQuestion: ExtraQuestion = {
      questionText: "",
      pickerType: "TEXTFIELD",
      options: null,
    };
    setForm((prev) => ({
      ...prev,
      extraQuestions: [...prev.extraQuestions, newQuestion],
    }));
  };

  const removeExtraQuestion = (index: number) => {
    setForm((prev) => ({
      ...prev,
      extraQuestions: prev.extraQuestions.filter((_, i) => i !== index),
    }));
  };

  const updateExtraQuestionField = (
    questionIndex: number,
    field: keyof ExtraQuestion,
    value: ExtraQuestion[keyof ExtraQuestion]
  ) => {
    setForm((prev) => ({
      ...prev,
      extraQuestions: prev.extraQuestions.map((q, i) =>
        i === questionIndex ? { ...q, [field]: value } : q
      ),
    }));
  };

  const updatePriceFactor = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    setForm((prev) => {
      const question = prev.extraQuestions[questionIndex];
      if (!question.options) return prev;
      const optionId = question.options[optionIndex] || String(optionIndex);
      let priceFactors = question.priceFactors || [];
      // Find or add the priceFactor for this option
      const pfIndex = priceFactors.findIndex((pf) => pf.optionId === optionId);
      if (pfIndex >= 0) {
        priceFactors[pfIndex] = { optionId, priceFactor: value };
      } else {
        priceFactors = [...priceFactors, { optionId, priceFactor: value }];
      }
      return {
        ...prev,
        extraQuestions: prev.extraQuestions.map((q, i) =>
          i === questionIndex ? { ...q, priceFactors } : q
        ),
      };
    });
  };

  const addOption = (questionIndex: number) => {
    const question = form.extraQuestions[questionIndex];
    const options = question.options || [];
    updateExtraQuestionField(questionIndex, "options", [...options, ""]);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const question = form.extraQuestions[questionIndex];
    if (question.options) {
      const newOptions = question.options.filter((_, i) => i !== optionIndex);
      updateExtraQuestionField(
        questionIndex,
        "options",
        newOptions.length > 0 ? newOptions : null
      );
    }
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const question = form.extraQuestions[questionIndex];
    if (question.options) {
      const newOptions = [...question.options];
      newOptions[optionIndex] = value;
      updateExtraQuestionField(questionIndex, "options", newOptions);
    }
  };

  const validateForm = (): string | null => {
    if (!form.name.trim()) return "Category name is required";
    if (!form.imageKey && !editCategory) return "Category image is required";

    if (form.express) {
      if (!form.expressPrice || parseFloat(form.expressPrice) <= 0) {
        return "Express price is required and must be greater than 0";
      }
      if (
        !form.platformFee ||
        isNaN(Number(form.platformFee)) ||
        Number(form.platformFee) < 0 ||
        Number(form.platformFee) > 100
      ) {
        return "Fiksaten's cut is required and must be between 0.00 and 100.00 percent";
      }
      if (form.hasNeededToolsAffectsPrice) {
        if (
          !form.hasNeededToolsPriceFactor ||
          isNaN(Number(form.hasNeededToolsPriceFactor)) ||
          Number(form.hasNeededToolsPriceFactor) < 0 ||
          Number(form.hasNeededToolsPriceFactor) > 10
        ) {
          return "Has Needed Tools price factor must be between 0.00 and 10.00";
        }
      }
      if (form.extraQuestions.length === 0) {
        return "Express categories must have at least one extra question";
      }
    }

    // Validate extra questions
    for (let i = 0; i < form.extraQuestions.length; i++) {
      const question = form.extraQuestions[i];
      if (!question.questionText.trim()) {
        return `Question ${i + 1} text is required`;
      }
      if (
        question.pickerType === "DROPDOWN" &&
        (!question.options || question.options.length === 0)
      ) {
        return `Question ${
          i + 1
        } requires at least one option for dropdown type`;
      }
      if (question.affectsPrice) {
        if (!question.options) {
          return `Question ${i + 1} must have options to set price factors`;
        }
        for (let j = 0; j < question.options.length; j++) {
          const pf = question.priceFactors?.find(
            (pf) => pf.optionId === question.options![j]
          );
          if (
            !pf ||
            pf.priceFactor === "" ||
            isNaN(Number(pf.priceFactor)) ||
            Number(pf.priceFactor) < 0 ||
            Number(pf.priceFactor) > 10
          ) {
            return `Price factor for option ${j + 1} in question ${
              i + 1
            } must be between 0.00 and 10.00`;
          }
        }
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      toast({
        title: "Validation Error",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const categoryData: CreateCategoryBody = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        imageKey: form.imageKey,
        express: form.express,
        expressPrice: form.express ? form.expressPrice : null,
        platformFee: form.express ? form.platformFee : null,
        hasNeededToolsAffectsPrice: form.express
          ? form.hasNeededToolsAffectsPrice
          : false,
        hasNeededToolsPriceFactor: form.express
          ? form.hasNeededToolsPriceFactor
          : null,
        extraQuestions:
          form.extraQuestions.length > 0
            ? form.extraQuestions.map((q) => ({
                questionText: q.questionText.trim(),
                pickerType: q.pickerType,
                options:
                  q.options && q.options.length > 0
                    ? q.options
                        .filter((opt) => opt.trim())
                        .map((opt) => opt.trim())
                    : null,
                affectsPrice: q.affectsPrice ?? false,
                priceFactors: q.affectsPrice
                  ? (q.options || []).map((opt) => {
                      const pf = q.priceFactors?.find(
                        (pf) => pf.optionId === opt
                      );
                      return {
                        optionId: opt,
                        priceFactor: pf ? Number(pf.priceFactor) : 0,
                      };
                    })
                  : [],
              }))
            : undefined,
      };

      if (editCategory) {
        await updateCategory(accessToken, editCategory.id, categoryData);
        // Refresh the categories list to get the updated data
        const refreshedCategories = await getCategories(accessToken);
        setCategories(refreshedCategories);
        toast({ title: "Category updated successfully" });
      } else {
        await createCategory(accessToken, categoryData);
        // Refresh the categories list to get the updated data
        const refreshedCategories = await getCategories(accessToken);
        setCategories(refreshedCategories);
        toast({ title: "Category created successfully" });
      }
      closeDialog();
    } catch (err: unknown) {
      const error = err as Error;
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this category? This action cannot be undone."
      )
    )
      return;
    setLoading(true);
    try {
      await deleteCategory(accessToken, id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast({ title: "Category deleted successfully" });
    } catch (err: unknown) {
      const error = err as Error;
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Categories Management</h2>
          <p className="text-muted-foreground">
            Manage service categories and their settings
          </p>
        </div>
        <Button onClick={openCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Category
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Express Price</TableHead>
                <TableHead>Extra Questions</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                      {cat.imageUrl ? (
                        <Image
                          src={cat.imageUrl}
                          alt={cat.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {cat.description || "No description"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={cat.express ? "default" : "secondary"}>
                      {cat.express ? "Express" : "Regular"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {cat.express && cat.expressPrice
                      ? `€${cat.expressPrice}`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {cat.expressCategoryQuestions?.length || 0} questions
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEdit(cat)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(cat.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editCategory ? "Edit Category" : "Create New Category"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Category Name *</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Enter category name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={form.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Enter category description"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <Label>Category Image *</Label>
                  <div className="mt-2 space-y-4">
                    <div className="flex items-center gap-4">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file);
                        }}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={imageUploading}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        {imageUploading ? "Uploading..." : "Upload Image"}
                      </Button>
                      {form.imageKey && (
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={imageUrl}
                            alt="Category preview"
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                    {!form.imageKey && (
                      <p className="text-sm text-muted-foreground">
                        Image is required for all categories
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Express Category Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="express"
                    checked={form.express}
                    onCheckedChange={(checked) =>
                      handleInputChange("express", checked)
                    }
                  />
                  <Label htmlFor="express">Enable Express Service</Label>
                </div>

                {form.express && (
                  <div className="space-y-4 p-4 bg-muted rounded-lg">
                    <div>
                      <Label htmlFor="expressPrice">Express Price (€) *</Label>
                      <Input
                        id="expressPrice"
                        type="number"
                        step="0.01"
                        min="0"
                        value={form.expressPrice}
                        onChange={(e) =>
                          handleInputChange("expressPrice", e.target.value)
                        }
                        placeholder="Enter express service price"
                        required={form.express}
                      />
                    </div>
                    <div>
                      <Label htmlFor="platformFee">
                        Fiksaten&apos;s cut (%) *
                      </Label>
                      <Input
                        id="platformFee"
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={form.platformFee}
                        onChange={(e) =>
                          handleInputChange("platformFee", e.target.value)
                        }
                        placeholder="Enter platform fee percentage"
                        required={form.express}
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Switch
                        id="hasNeededToolsAffectsPrice"
                        checked={form.hasNeededToolsAffectsPrice}
                        onCheckedChange={(checked) =>
                          handleInputChange(
                            "hasNeededToolsAffectsPrice",
                            checked
                          )
                        }
                      />
                      <Label htmlFor="hasNeededToolsAffectsPrice">
                        &quot;Has Needed Tools&quot; affects price?
                      </Label>
                    </div>
                    {form.hasNeededToolsAffectsPrice && (
                      <div className="mt-2">
                        <Label htmlFor="hasNeededToolsPriceFactor">
                          &quot;Has Needed Tools&quot; price factor (0.00 -
                          10.00)
                        </Label>
                        <Input
                          id="hasNeededToolsPriceFactor"
                          type="number"
                          step="0.01"
                          min="0"
                          max="10"
                          value={form.hasNeededToolsPriceFactor}
                          onChange={(e) =>
                            handleInputChange(
                              "hasNeededToolsPriceFactor",
                              e.target.value
                            )
                          }
                          placeholder="Enter price factor"
                          required={form.hasNeededToolsAffectsPrice}
                          className="w-32"
                        />
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Express categories require at least one extra question
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Extra Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  Extra Questions
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addExtraQuestion}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Question
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {form.extraQuestions.length === 0 && form.express && (
                  <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
                    Express categories must have at least one extra question
                  </p>
                )}

                {form.extraQuestions.map((question, questionIndex) => (
                  <div
                    key={questionIndex}
                    className="border rounded-lg p-4 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">
                        Question {questionIndex + 1}
                      </h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeExtraQuestion(questionIndex)}
                        className="h-8 w-8 p-0 text-destructive"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Question Text *</Label>
                        <Input
                          value={question.questionText}
                          onChange={(e) =>
                            updateExtraQuestionField(
                              questionIndex,
                              "questionText",
                              e.target.value
                            )
                          }
                          placeholder="Enter question text"
                          required
                        />
                      </div>
                      <div>
                        <Label>Input Type *</Label>
                        <Select
                          value={question.pickerType}
                          onValueChange={(value: PickerType) => {
                            updateExtraQuestionField(
                              questionIndex,
                              "pickerType",
                              value
                            );
                            // Reset options if changing away from dropdown
                            if (value !== "DROPDOWN") {
                              updateExtraQuestionField(
                                questionIndex,
                                "options",
                                null
                              );
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TEXTFIELD">
                              Text Input
                            </SelectItem>
                            <SelectItem value="TEXTAREA">Text Area</SelectItem>
                            <SelectItem value="DROPDOWN">Dropdown</SelectItem>
                            <SelectItem value="SWITCH">
                              Yes/No Switch
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <Switch
                        id={`affectsPrice-${questionIndex}`}
                        checked={!!question.affectsPrice}
                        onCheckedChange={(checked) =>
                          updateExtraQuestionField(
                            questionIndex,
                            "affectsPrice",
                            checked
                          )
                        }
                      />
                      <Label htmlFor={`affectsPrice-${questionIndex}`}>
                        Affects Price?
                      </Label>
                    </div>
                    {question.affectsPrice && question.options && (
                      <div className="mt-2 space-y-2">
                        <Label>Price Factors (0.00 - 10.00)</Label>
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="flex items-center gap-2"
                          >
                            <span className="text-sm w-32 truncate">
                              {option}
                            </span>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              max="10"
                              value={
                                question.priceFactors?.find(
                                  (pf) => pf.optionId === option
                                )?.priceFactor || ""
                              }
                              onChange={(e) =>
                                updatePriceFactor(
                                  questionIndex,
                                  optionIndex,
                                  e.target.value
                                )
                              }
                              placeholder="Factor"
                              className="w-24"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {question.pickerType === "DROPDOWN" && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label>Options *</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addOption(questionIndex)}
                          >
                            Add Option
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {question.options?.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className="flex items-center gap-2"
                            >
                              <Input
                                value={option}
                                onChange={(e) =>
                                  updateOption(
                                    questionIndex,
                                    optionIndex,
                                    e.target.value
                                  )
                                }
                                placeholder={`Option ${optionIndex + 1}`}
                                className="flex-1"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  removeOption(questionIndex, optionIndex)
                                }
                                className="h-10 w-10 p-0 text-destructive"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          {(!question.options ||
                            question.options.length === 0) && (
                            <p className="text-sm text-muted-foreground">
                              Add at least one option for dropdown questions
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || imageUploading}>
                {loading
                  ? "Saving..."
                  : editCategory
                  ? "Update Category"
                  : "Create Category"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
