export type PublicMenuItem = {
  _id: string;
  itemName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: string;
  createdAt: string;
  vendorId: string;
  isPremiumVendor: boolean;
  vendor: { _id: string; name: string; businessName?: string; image?: string | null };
};

export type MenuListResponse = {
  items: PublicMenuItem[];
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
];

export function vendorLabel(vendor: PublicMenuItem["vendor"]) {
  return vendor.businessName || vendor.name;
}

export function formatPrice(value: number) {
  return `BDT ${value.toLocaleString()}`;
}