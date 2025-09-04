"use client";

import { GetAllCitiesResponse, GetCategoriesResponse, GetCategoriesWithContractorsInCityResponse, GetCitiesWithContractorsForCategoryResponse } from "@/app/lib/openapi-client";
import { getCategoriesWithContractorsInCity, getCitiesWithContractorsForCategory } from "@/app/lib/services/cityCategoryService";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, MapPin, Search } from "lucide-react";
import { useEffect, useState } from "react";



interface CityCategoriesTableProps {
  initialCategories: GetCategoriesResponse;
  initialCities: GetAllCitiesResponse;
  accessToken: string;
}

export default function CityCategoriesTable({
  initialCategories,
  initialCities,
  accessToken,
}: CityCategoriesTableProps) {
  const [categories] = useState<GetCategoriesResponse>(initialCategories);
  const [cities] = useState<GetAllCitiesResponse>(initialCities);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [citiesWithContractors, setCitiesWithContractors] = useState<GetCitiesWithContractorsForCategoryResponse>([]);
  const [categoriesWithContractors, setCategoriesWithContractors] = useState<GetCategoriesWithContractorsInCityResponse>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const loadCitiesForCategory = async (categoryId: string) => {
    if (!categoryId) return;
    
    setLoading(true);
    try {
      const data = await getCitiesWithContractorsForCategory(accessToken, categoryId);
      setCitiesWithContractors(data);
    } catch (error) {
      console.error("Error loading cities for category:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategoriesForCity = async (cityId: string) => {
    if (!cityId) return;
    
    setLoading(true);
    try {
      const data = await getCategoriesWithContractorsInCity(accessToken, cityId);
      setCategoriesWithContractors(data);
    } catch (error) {
      console.error("Error loading categories for city:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      loadCitiesForCategory(selectedCategory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCity) {
      loadCategoriesForCity(selectedCity);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCity]);


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">City Categories Overview</h1>
          <p className="text-muted-foreground">
            View categories in cities and their associated contractors
          </p>
        </div>
      </div>

      <Tabs defaultValue="by-category" className="space-y-4">
        <TabsList>
          <TabsTrigger value="by-category">By Category</TabsTrigger>
          <TabsTrigger value="by-city">By City</TabsTrigger>
        </TabsList>

        <TabsContent value="by-category" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>View Cities by Category</CardTitle>
              <CardDescription>
                Select a category to see which cities have contractors in that category
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Label htmlFor="category-select">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search cities or contractors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>

              {loading && (
                <div className="flex items-center justify-center py-8">
                  <div className="text-muted-foreground">Loading...</div>
                </div>
              )}

              {!loading && selectedCategory && (
                <div className="space-y-4">
                  {citiesWithContractors.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No cities found with contractors in this category
                    </div>
                  ) : (
                    citiesWithContractors.map((item) => (
                      <Card key={item.id}>
                        <CardHeader>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <CardTitle className="text-lg">{item.cityName}</CardTitle>
                            <Badge variant="secondary">{item.contractorCount} contractors</Badge>
                          </div>
                        </CardHeader>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-city" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>View Categories by City</CardTitle>
              <CardDescription>
                Select a city to see which categories have contractors in that city
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Label htmlFor="city-select">City</Label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.id}>
                          {city.cityName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search categories or contractors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>

              {loading && (
                <div className="flex items-center justify-center py-8">
                  <div className="text-muted-foreground">Loading...</div>
                </div>
              )}

              {!loading && selectedCity && (
                <div className="space-y-4">
                  {categoriesWithContractors.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No categories found with contractors in this city
                    </div>
                  ) : (
                    categoriesWithContractors.map((item) => (
                      <Card key={item.id}>
                        <CardHeader>
                          <div className="flex items-center space-x-2">
                            <Building2 className="h-4 w-4" />
                            <CardTitle className="text-lg">{item.name}</CardTitle>
                            <Badge variant="secondary">{item.contractorCount} contractors</Badge>
                          </div>
                          {item.description && (
                            <CardDescription>{item.description}</CardDescription>
                          )}
                        </CardHeader>
                     
                      </Card>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

