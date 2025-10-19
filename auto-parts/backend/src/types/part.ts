import { Prisma } from "@prisma/client";

export type Part = {
  id: number;
  name: string;
  brand: string | null;
  price: Prisma.Decimal;
  stock: number;
  category: string | null;
  imageUrl: string | null;
  createdAt: Date;
};
