import { GetDiscountedOrders } from "@/services/homeActions";
import { GetUserDashboard } from "@/services/authActions";
import { formatToPersianTimeAgo } from "@/utils/formatToPersianTimeAgo";
import { MdShoppingCartCheckout } from "react-icons/md";
import Orders from "./Orders";
import { marketing_orders } from "@/services/marketingActions";
type OrderType = "regular" | "discounted" | "marketer";

interface RawOrder {
  id: number | string;
  order_number?: string;
  total_amount?: number;
  discounted_amount?: number;
  status?: string;
  order_date?: string;
}

export interface MappedOrder {
  id: string;
  order_number?: string;
  amount: number;
  amountFormatted: string;
  status?: string;
  date?: string;
  dateFormatted: string;
  detailsLink: string;
}

const mapOrders = (data: RawOrder[], type: OrderType): MappedOrder[] =>
  data.map((order) => {
    const amount = order.total_amount ?? order.discounted_amount ?? 0;

    return {
      id: `${order.id}-${type}`,
      order_number: order.order_number,
      amount,
      amountFormatted: amount.toLocaleString("fa-IR"),
      status: order.status,
      date: order.order_date,
      dateFormatted: order.order_date
        ? formatToPersianTimeAgo(order.order_date)
        : "-",
      detailsLink:
        type === "discounted"
          ? `/profile/dis-orders/${order.order_number}`
          : type === "marketer"
            ? `/profile/mark-orders/${order.id}`
            : `/profile/orders/${order.order_number}`,
    };
  });

export default async function Page() {
  const [discountedOrders, marketerOrders, dashboard] = await Promise.all([
    GetDiscountedOrders(),
    marketing_orders(),
    GetUserDashboard(),
  ]);

  const orders = Array.isArray(dashboard?.orders) ? dashboard.orders : [];

  const discounted = Array.isArray(discountedOrders) ? discountedOrders : [];

  const marketer = Array.isArray(marketerOrders?.data)
    ? marketerOrders.data
    : [];

  const items: MappedOrder[] = [
    ...mapOrders(orders, "regular"),
    ...mapOrders(discounted, "discounted"),
    ...mapOrders(marketer, "marketer"),
  ];

  return (
    <div>
      <h1 className="flex items-center gap-1 font-semibold text-xl mb-5">
        <MdShoppingCartCheckout className="size-8 text-primary" />
        <span className="pt-1">سفارشات</span>
      </h1>
      <Orders items={items} />
    </div>  
  );
}
