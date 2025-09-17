export interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  role?: "admin" | "moderator" | "user";
}

export interface Category {
  id: string;
  name: string;
}

export interface Subcategory {
  id: string;
  name: string;
  category_id: string;
}

export interface News {
  id: string;
  title: string;
  content: string;
  image?: string;
  created_at?: string;
  created_by?: string;
  category_id?: string;
  subcategory_id?: string;
  categories?: {
    name: string;
  };
}

export interface CategoryForm {
  name: string;
}

export interface SubcategoryForm {
  name: string;
  category_id: string;
}

export interface NewsForm {
  title: string;
  content: string;
  image?: string;
  category_id?: string;
  subcategory_id?: string;
}

export interface ProfileForm {
  first_name?: string;
  last_name?: string;
  role?: "admin" | "moderator" | "user";
}

// User management types
export interface UserWithProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: "admin" | "moderator" | "user";
  created_at?: string;
}

export interface UserUpdateData {
  first_name?: string;
  last_name?: string;
  role?: "admin" | "moderator" | "user";
}

export interface UserForm {
  email: string;
  password?: string; 
  first_name: string;
  last_name: string;
  role: "admin" | "moderator" | "user";
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: Date;
  lastLogin?: Date;
}

export interface Statistics {
  totalUsers: number;
  totalCategories: number;
  totalSubcategories: number;
  totalNews: number;
  publishedNews: number;
  draftNews: number;
  recentUsers: User[];
  recentNews: News[];
}
