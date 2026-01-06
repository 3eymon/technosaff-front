"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Chip,
} from "@heroui/react";
import { useAsyncList } from "@react-stately/data";
import Link from "next/link";
import { MdShoppingCartCheckout } from "react-icons/md";
import { MappedOrder } from "./page";

const statusMap: Record<
  string,
  { label: string; color: "warning" | "success" | "danger" | "secondary" }
> = {
  pending: { label: "در انتظار", color: "warning" },
  shipped: { label: "ارسال شده", color: "secondary" },
  cancelled: { label: "لغو شده", color: "danger" },
  delivered: { label: "تحویل داده شد", color: "success" },
};

export default function Orders({ items }: { items: MappedOrder[] }) {
  const list = useAsyncList<MappedOrder>({
    async load() {
      return { items: items ?? [] };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: [...items].sort((a, b) => {
          let first = a[sortDescriptor.column as keyof MappedOrder];
          let second = b[sortDescriptor.column as keyof MappedOrder];

          if (sortDescriptor.column === "amount") {
            first = Number(first);
            second = Number(second);
          }

          if (sortDescriptor.column === "date") {
            first = new Date(first as string).getTime();
            second = new Date(second as string).getTime();
          }

          let cmp = 0;
          if (first! < second!) cmp = -1;
          else if (first! > second!) cmp = 1;

          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }

          return cmp;
        }),
      };
    },
  });

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500 min-h-[400px]">
        <MdShoppingCartCheckout className="text-6xl mb-4 text-primary/70" />
        <p className="text-lg font-semibold mb-1">هنوز سفارشی نداری</p>
        <p className="text-sm">
          اولین سفارشت رو ثبت کن تا اینجا نمایش داده بشه 🌱
        </p>
      </div>
    );
  }

  return (
    <Table
      aria-label="Order list table"
      classNames={{ table: "min-h-[400px]" }}
      sortDescriptor={list.sortDescriptor}
      onSortChange={list.sort}
      isVirtualized
      isHeaderSticky
      
    >
      <TableHeader>
        <TableColumn key="order_number" allowsSorting>
          شماره سفارش
        </TableColumn>
        <TableColumn key="amount" allowsSorting>
          مبلغ کل
        </TableColumn>
        <TableColumn key="status" allowsSorting>
          وضعیت
        </TableColumn>
        <TableColumn key="date" allowsSorting>
          تاریخ
        </TableColumn>
        <TableColumn>جزئیات</TableColumn>
      </TableHeader>

      <TableBody
        items={list.items}
        loadingContent={<Spinner variant="simple" label="در حال بارگذاری..." />}
      >
        {(item) => (
          <TableRow key={`${item.id}`}>
            <TableCell>{item.order_number}</TableCell>
            <TableCell>{item.amountFormatted}</TableCell>
            <TableCell>
              <Chip
                color={statusMap[item.status ?? ""]?.color || "default"}
                variant="flat"
                size="sm"
              >
                {statusMap[item.status ?? ""]?.label || item.status || "نامشخص"}
              </Chip>
            </TableCell>
            <TableCell>{item.dateFormatted}</TableCell>
            <TableCell>
              <Link
                href={item.detailsLink}
                className="underline underline-offset-2"
              >
                جزییات سفارش
              </Link>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
