export type ProductAvailability = "in-stock" | "low-stock" | "out-of-stock";
export type DiscountType = "percentage" | "fixed";

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  image: string;
  description: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  categoryId: string;
  brandId: string;
  images: string[];
  unitPrice: number;
  referencePrice: number | null;
  stockQuantity: number;
  sku: string;
  packageSize: string;
  rating: number;
  reviewCount: number;
  requiresPrescription: boolean;
  availability: ProductAvailability;
  productAttributes: Record<string, string>;
  genericName?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  unitPriceSnapshot: number;
  selectedVariantId?: string;
  availability: ProductAvailability;
  requiresPrescription: boolean;
}

export interface Address {
  id: string;
  userId: string;
  recipientName: string;
  phone: string;
  division: string;
  district: string;
  area: string;
  streetAddress: string;
  postalCode: string;
  isDefault: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minimumOrderAmount: number;
  maximumDiscount: number;
  expiryDate: string;
  usageLimit: number;
  eligibilityRules: string[];
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  addressSnapshot: string;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: "cod" | "demo-wallet" | "card";
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus:
    | "Pending confirmation"
    | "Awaiting prescription review"
    | "Confirmed"
    | "Preparing"
    | "Dispatched"
    | "Out for delivery"
    | "Delivered"
    | "Cancelled"
    | "Return requested"
    | "Refunded";
  prescriptionStatus:
    | "not-submitted"
    | "uploaded"
    | "under-review"
    | "approved"
    | "rejected"
    | "additional-info-requested";
  createdAt: string;
}

export interface Doctor {
  id: string;
  slug: string;
  name: string;
  specialty: string;
  qualification: string;
  registration: string;
  fee: number;
  rating: number;
  image: string;
  about: string;
  availability: string[];
}

export interface LabTest {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  price: number;
  preparation: string;
  duration: string;
  image: string;
}

export interface AccountUser {
  name: string;
  email: string;
  phone: string;
}
