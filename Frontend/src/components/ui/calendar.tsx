"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "./utils";
import { buttonVariants } from "./button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "flex flex-col gap-4",
        caption: "flex justify-between pt-1 relative items-center mb-4 px-2",
        caption_label: "text-lg font-semibold text-gray-900",
        nav: "flex items-center gap-2",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-9 w-9 bg-white p-0 hover:bg-blue-50 border-gray-300 hover:border-blue-400 transition-all"
        ),
        nav_button_previous: "",
        nav_button_next: "",
        table: "w-full border-collapse",
        head_row: "flex mb-2",
        head_cell:
          "text-gray-600 rounded-md w-12 font-semibold text-base uppercase",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-base focus-within:relative focus-within:z-20",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : ""
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-12 w-12 p-0 font-medium text-lg aria-selected:opacity-100 hover:bg-blue-100 transition-colors"
        ),
        day_range_start:
          "day-range-start aria-selected:bg-blue-600 aria-selected:text-white",
        day_range_end:
          "day-range-end aria-selected:bg-blue-600 aria-selected:text-white",
        day_selected:
          "bg-blue-600 text-white hover:bg-blue-700 hover:text-white focus:bg-blue-600 focus:text-white font-bold",
        day_today:
          "bg-blue-100 text-blue-900 font-bold border-2 border-blue-400",
        day_outside:
          "day-outside text-gray-400 opacity-40 aria-selected:text-gray-400",
        day_disabled:
          "text-gray-300 opacity-50 line-through cursor-not-allowed",
        day_range_middle:
          "aria-selected:bg-blue-200 aria-selected:text-blue-900",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-5 w-5", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-5 w-5", className)} {...props} />
        ),
      }}
      {...props}
    />
  );
}

export { Calendar };
