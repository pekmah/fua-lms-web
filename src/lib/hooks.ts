import type { IOrder } from "@/types/laundry";
import { useCallback, useEffect, useState } from "react";
import { trackOrder } from "./services";
import { getErrorMessage } from "./utils";

export const useTrackOrder = (orderId: string) => {
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<IOrder | null>(null);

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    return trackOrder(orderId)
      .then((res) => {
        setOrder(res);
        setLoading(false);
        return res;
      })
      .catch((err) => {
        setLoading(false);
        window.alert(getErrorMessage(err, "Failed to track order."));
      });
  }, []);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return {
    loading,
    order,
  };
};
