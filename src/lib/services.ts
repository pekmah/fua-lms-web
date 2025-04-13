import { BASE_URL } from "@/constants";
import type { IOrder } from "@/types/laundry";
import axios from "axios";

export const trackOrder = async (orderId: string): Promise<IOrder> => {
  const response = await axios.get(`${BASE_URL}/public/orders/${orderId}`);

  return response.data;
};
