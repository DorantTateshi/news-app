export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
        };
        Insert: {
          id?: string;
          name: string;
        };
        Update: {
          id?: string;
          name?: string;
        };
      };
      subcategories: {
        Row: {
          id: string;
          name: string;
          category_id: string;
        };
        Insert: {
          id?: string;
          name: string;
          category_id: string;
        };
        Update: {
          id?: string;
          name?: string;
          category_id?: string;
        };
      };
      news: {
        Row: {
          id: string;
          title: string;
          content: string;
          image?: string;
          created_at?: string;
          created_by?: string;
          category_id?: string;
          subcategory_id?: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          image?: string;
          created_at?: string;
          created_by?: string;
          category_id?: string;
          subcategory_id?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          image?: string;
          created_at?: string;
          created_by?: string;
          category_id?: string;
          subcategory_id?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          first_name?: string;
          last_name?: string;
          role?: string;
        };
        Insert: {
          id: string;
          first_name?: string;
          last_name?: string;
          role?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          role?: string;
        };
      };
    };
  };
}
