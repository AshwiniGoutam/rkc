export type Product = {
  _id: string;   // <-- was number, should be string
  name: string;
  description: string;
  mrp: number;
  price: number;
  inStock: boolean | string;
  image_url: string;
  createdAt: string;
};

export type CartItem = {
  _id: string;   // <-- also should be string
  name: string;
  price: number;
  mrp?: number;
  image_url: string;
  quantity: number;
};
