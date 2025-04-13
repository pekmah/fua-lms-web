export type OrderType = {
  id: number;
  name: string;
  stage: string;
  date: Date;
};

export type LaundryCategoryType = {
  id: number;
  name: string;
  unit: string;
  unitPrice: number;
  createdAt: string;
  updatedAt: string;
};

export type LaundryItemType = {
  id: number;
  laundryCategoryId: number;
  orderId: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  laundryCategory: LaundryCategoryType;
};

export type PaymentType = {
  id: number;
  orderId: number;
  amount: number;
  createdAt: string;
  updatedAt: string;
  otherDetails: string;
};

export type LogType = {
  id: number;
  orderId: number;
  stage: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type ImageType = {
  id: number;
  orderId: number;
  url: string;
  publicId: string;
  createdAt: string;
  updatedAt: string;
};

export type IOrder = {
  id: number;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  paymentAmount: number;
  status: string;
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
  laundryItems: LaundryItemType[];
  payments: PaymentType[];
  logs: LogType[];
  images: ImageType[];
};
