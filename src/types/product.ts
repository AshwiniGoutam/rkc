export type Product = {
  image_url: string;
  mrp: string;
  name: string;
  title: string;
  description: string;
  reviews: number;
  price: number;
  discountedPrice: number;
  id: number;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
};
