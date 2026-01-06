"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Spinner,
} from "@heroui/react";
import { useAsyncList } from "@react-stately/data";
import Link from "next/link";

import { GetUserDashboard } from "@/services/authActions";
import { GetShippingServices } from "@/services/shopActions";
import { MdShoppingCartCheckout } from "react-icons/md";

type PreInvoiceItem = {
  id: number;
  order_number?: string;
  amount: string;
  status: string;
  city: string;
  date: string;
  shipping_service: string;
};

type ShippingService = {
  id: number;
  name: string;
};

const statusLabels: Record<string, { fa: string; color: string }> = {
  pending: { fa: "در انتظار تایید", color: "bg-yellow-100 text-yellow-800" },
  approved: { fa: "تایید شده", color: "bg-green-100 text-green-800" },
  rejected: { fa: "رد شده", color: "bg-red-100 text-red-800" },
  processed: { fa: "پردازش شده", color: "bg-blue-100 text-blue-800" },
};

export default function PreInvoices() {
  const list = useAsyncList<PreInvoiceItem>({
    async load() {
      const shippingRes = await GetShippingServices();
      const dashboard = await GetUserDashboard();

      const shippingServices: ShippingService[] = Array.isArray(
        shippingRes?.data
      )
        ? shippingRes.data
        : [];

      const preInvoices = Array.isArray(dashboard?.pre_invoices)
        ? dashboard.pre_invoices
        : [];

      return {
        items: preInvoices.map((invoice: any) => {
          const shipping = shippingServices.find(
            (s) => s.id === invoice?.shipping_service
          );

          const amount =
            invoice?.total_amount ?? invoice?.discounted_amount ?? 0;

          return {
            id: invoice.id,
            order_number: invoice?.order_number,
            amount: amount.toLocaleString("fa-IR"),
            status: invoice?.status ?? "unknown",
            city: "-",
            shipping_service: shipping?.name ?? "نامشخص",
            date: invoice?.created_at
              ? new Date(invoice.created_at).toLocaleDateString("fa-IR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                  hourCycle: "h23",
                })
              : "-",
          };
        }),
      };
    },

    async sort({ items, sortDescriptor }) {
      const { column, direction } = sortDescriptor;

      return {
        items: [...items].sort((a, b) => {
          const first = a[column as keyof PreInvoiceItem] ?? "";
          const second = b[column as keyof PreInvoiceItem] ?? "";

          const firstVal = isNaN(Number(first)) ? first : Number(first);
          const secondVal = isNaN(Number(second)) ? second : Number(second);

          let cmp = firstVal < secondVal ? -1 : firstVal > secondVal ? 1 : 0;
          return direction === "descending" ? -cmp : cmp;
        }),
      };
    },
  });

  return (
    <Table
      aria-label="Pre invoices table"
      classNames={{ table: "min-h-[400px]" }}
      sortDescriptor={list.sortDescriptor}
      onSortChange={list.sort}
      isVirtualized
      isHeaderSticky
    >
      <TableHeader>
        <TableColumn key="order_number" allowsSorting>
          شماره پیش فاکتور
        </TableColumn>
        <TableColumn key="amount" allowsSorting>
          مبلغ کل
        </TableColumn>
        <TableColumn key="status" allowsSorting>
          وضعیت
        </TableColumn>
        <TableColumn key="city" allowsSorting>
          شهر گیرنده
        </TableColumn>
        <TableColumn key="shipping_service">روش ارسال</TableColumn>
        <TableColumn key="date" allowsSorting>
          تاریخ
        </TableColumn>
        <TableColumn key="actions">جزئیات</TableColumn>
      </TableHeader>

      <TableBody
        items={list.items}
        isLoading={list.isLoading}
        loadingContent={<Spinner variant="simple" label="در حال بارگذاری..." />}
        emptyContent={
          <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500 min-h-[400px]">
            <MdShoppingCartCheckout className="text-6xl mb-4 text-primary/70" />
            <p className="text-lg font-semibold mb-1">
              هنوز پیش‌فاکتوری ثبت نشده
            </p>
            <p className="text-sm">
              اولین پیش‌فاکتورت رو ثبت کن تا اینجا نمایش داده بشه 🌱
            </p>
          </div>
        }
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => {
              if (columnKey === "status") {
                const label = statusLabels[item.status ?? "unknown"] ?? {
                  fa: item.status ?? "نامشخص",
                  color: "bg-gray-100 text-gray-800",
                };

                return (
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-sm rounded-full font-pelak whitespace-nowrap ${label.color}`}
                    >
                      {label.fa}
                    </span>
                  </TableCell>
                );
              }

              if (columnKey === "actions") {
                return (
                  <TableCell className="whitespace-nowrap">
                    <Link
                      href={`/profile/pre-invoices/${item.id}`}
                      className="underline underline-offset-4 mr-2"
                    >
                      جزئیات
                    </Link>

                    {item.status === "approved" && (
                      <Link
                        href={`/payment/pre-invoice/${item.id}`}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                      >
                        پرداخت
                      </Link>
                    )}
                  </TableCell>
                );
              }

              return (
                <TableCell className="whitespace-nowrap">
                  {getKeyValue(item, columnKey)}
                </TableCell>
              );
            }}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
