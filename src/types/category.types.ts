// src/types/category.types.ts

export interface Category {
  _id: string;
  name: string;
  slug: string;
  parentCategory: string | null;
  image: string;
  isActive: boolean;
  displayOrder: number;
}

export interface CategoryWithSubs extends Category {
  subcategories: Category[];
}
