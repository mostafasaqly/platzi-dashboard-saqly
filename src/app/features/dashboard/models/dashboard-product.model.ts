export interface DashboardProduct {
  id: number;
  title: string;
  price: number;
  images: string[];
  creationAt: string;
  category: {
    id: number;
    name: string;
    image: string;
  };
}
