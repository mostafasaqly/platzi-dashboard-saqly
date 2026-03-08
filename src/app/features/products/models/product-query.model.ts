export interface ProductQuery {
  title?: string;
  categoryId?: number | null;
  offset: number;
  limit: number;
}
