export type PaymentFormData = {
  name: string;
};

export type PaymentType = {
  id: number;
  createdAt: string;
} & PaymentFormData;

export type OrderPaymentFormData = {
  amount: string;
  mode: string;
  other_details?: string | null;
};
export type OrderPaymentType = {
  id: number;
  createdAt: string;
} & OrderPaymentFormData;
