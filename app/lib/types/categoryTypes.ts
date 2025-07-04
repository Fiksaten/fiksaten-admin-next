import { AddCategoryData, GetCategoriesResponse } from "../openapi-client";

type Categories = GetCategoriesResponse;
type Category = Categories[number];
type CreateCategoryBody = AddCategoryData["body"];

export type { Categories, Category, CreateCategoryBody };
