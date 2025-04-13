import { COLORS, ORDER_NUMBER_PREFIX } from "@/constants";
import { useTrackOrder } from "@/lib/hooks";
import { formatToKES } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import moment from "moment";
import { useMemo } from "react";
import { FaCheck } from "react-icons/fa";
import { z } from "zod";
import "../App.css";

const orderTrackParams = z.object({
  order: z
    .string()
    .regex(
      new RegExp(`^${ORDER_NUMBER_PREFIX}\\d{6}$`),
      "Invalid order numebr"
    ),
});

export const Route = createFileRoute("/")({
  component: App,
  validateSearch: (search) => orderTrackParams.parse(search),
});

function App() {
  const routeSearch = Route.useSearch();
  const { loading, order } = useTrackOrder(routeSearch.order);

  const totalPaymentMade = useMemo(() => {
    if (!order?.payments || !order?.payments?.length) return 0;

    return order.payments.reduce((acc, item) => acc + (item?.amount ?? 0), 0);
  }, [order]);

  const balance = (order?.paymentAmount ?? 0) - totalPaymentMade;

  if (loading)
    return (
      <div
        className={`flex flex-col items-center justify-center h-screen space-y-4 bg-white`}
      >
        <div
          className={`animate-spin rounded-full h-12 w-12 border-4 border-[#3D4EB0] border-t-transparent`}
        ></div>
        <p className={`text-lg text-[${COLORS.primary}] font-medium`}>
          fetching Order ...
        </p>
      </div>
    );

  return (
    <div className="App bg-slate-200 px-0 md:px-10 flex flex-col items-center min-h-screen text-left">
      <div className="max-w-xl bg-gray-100 flex-1 w-full px-3 flex flex-col gap-4">
        {/* header */}
        <div className="flex flex-row px-2 border-b border-slate-200">
          <div className="w-1 min h-12 my-auto rounded-full bg-[#3D4EB0]" />

          <div className="py-3 px-2 text-primary w-full text-left flex-1">
            <h2 className="text-[#3D4EB0] text-xl font-bold uppercase ">
              Don Dry Cleaners
            </h2>
            <h3 className="text-[#3D4EB0] font-medium">Track your order</h3>
          </div>
        </div>

        {/* order details card */}
        <div className="bg-white rounded-md p-2">
          {/* header */}
          <div className="p-2 border-b border-slate-100">
            <h5 className="text-left font-semibold text-base md:text-lg">
              ORDER #{routeSearch.order}
            </h5>
          </div>

          {/* Order Status */}
          <div className="font-normal text-base py-2 md:pr-4 flex flex-col gap-2 my-">
            <div className="flex justify-between">
              <span>{order?.customerName ?? ""}</span>
              <span>{order?.customerPhone ?? ""}</span>
            </div>
            <div className="flex justify-between">
              <span className="uppercase">
                {formatToKES(Number(order?.paymentAmount || 0), " ")}
              </span>
              <span className="text-slate-500 font-normal">
                {moment(order?.createdAt).format("DD MMM YYYY, hh:mm:ss a")}
              </span>
            </div>

            {/* order images */}
            <div className="text-left mt-1">
              <h5 className="font-semibold mb-2">Order Images</h5>
              <div className="flex gap-3 flex-wrap">
                {order?.images.map((img) => (
                  <img
                    className="aspect-square h-16 rounded-md border border-slate-300"
                    src={img.url}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-md p-2">
          {/* header */}
          <div className="p-2 border-b border-slate-100">
            <h5 className="text-left font-semibold text-base md:text-lg">
              Order Status
            </h5>
          </div>

          {/* Logs */}
          <div className="flex gap-3 py-2">
            <div className="w-6 flex justify-center py-2">
              <div className="w-0.5 min-h-10 h-full bg-[#3D4EB0]" />
            </div>

            <div className="flex flex-col gap-3">
              {order?.logs.map((log) => (
                <div className="text-left flex flex-col gap-0.5 relative">
                  <div className="bg-[#3D4EB0] h-5 w-5 absolute top-2 -left-[34px] rounded-full flex items-center justify-center">
                    <FaCheck className="text-white text-xs" />
                  </div>

                  <h6 className="font-medium capitalize">{log.stage}</h6>
                  <p className="font-normal text-slate-500 text-sm">
                    {log.description}
                    <br />
                    {moment(log.createdAt).format("DD MMM YYYY, hh:mm:ss a")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-md p-2">
          {/* header */}
          <div className="p-2 border-b border-slate-100">
            <h5 className="text-left font-semibold text-sm sm:text-base md:text-lg">
              Order Laundry Items
            </h5>
          </div>

          {/* Logs */}
          <div className="flex flex-col gap-3 py-2">
            <div className="flex flex-col gap-3 w-full px-3">
              {order?.laundryItems.map((item) => (
                <div className="flex justify-between flex-1">
                  <div className="text-left">
                    {/* <pre>{JSON.stringify(item, null, 2)}</pre> */}
                    {item.quantity}
                    {"  "} x{"  "}{" "}
                    {"laundryCategory" in item ? item.laundryCategory.name : ""}{" "}
                    <span>
                      (
                      {"laundryCategory" in item
                        ? item?.laundryCategory.unit
                        : ""}
                      )
                    </span>
                  </div>

                  <div>
                    <p className="">
                      {formatToKES(
                        item.laundryCategory.unitPrice * Number(item.quantity),
                        " "
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="">
              <div className="text-left px-3 flex justify-between font-medium border-t border-slate-200 p-1 py-2">
                <h6 className="">{order?.laundryItems?.length} Items</h6>
                <h6 className="uppercase">
                  {formatToKES(order?.totalAmount ?? 0, " ") ?? 0}
                </h6>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-md p-2">
          {/* header */}
          <div className="p-2 border-b border-slate-100">
            <h5 className="text-left font-semibold text-base md:text-lg">
              Payments Made{" "}
            </h5>
          </div>

          {/* Logs */}
          <div className="flex flex-col gap-3 py-2">
            <div className="flex flex-col gap-3 w-full px-3">
              {order?.payments.map((payment) => (
                <div className="flex justify-between flex-1">
                  <div className="text-left">
                    <div className="text-left">
                      <span>{payment.amount.toString()}</span>
                    </div>
                    <div>
                      <span className="text-sm text-slate-700">
                        {payment?.otherDetails}
                      </span>
                    </div>
                  </div>

                  <div className="text-sm font-normal text-slate-700">
                    <p className="">{moment(payment.createdAt).calendar()}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="">
              <div className="text-left px-3 flex justify-between font-medium border-t border-slate-200 p-1 py-2">
                <h6 className="">Total Laundry Amount</h6>
                <h6 className="">
                  {formatToKES(order?.totalAmount ?? 0, " ") ?? 0}
                </h6>
              </div>

              <div className="text-left px-3 flex justify-between font-medium p-1 py-2">
                <h6 className="">Amount to Pay</h6>
                <h6 className="">
                  {formatToKES(order?.paymentAmount ?? 0, " ") ?? 0}
                </h6>
              </div>

              <div className="text-left px-3 flex justify-between font-medium p-1 py-2">
                <h6 className="">Paid Amount</h6>
                <h6 className="">
                  {formatToKES(totalPaymentMade ?? 0, " ") ?? 0}
                </h6>
              </div>

              <div className="text-left px-3 flex justify-between font-medium border-t border-slate-200 p-1 py-2">
                <h6 className="">Balance</h6>
                <h6 className="uppercase">
                  {formatToKES(balance ?? 0, " ") ?? 0}
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
