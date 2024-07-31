"use client";
import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "yfixed ytop-0 yz-[100] yflex ymax-h-screen yw-full yflex-col-reverse yp-4 sm:ybottom-0 sm:yright-0 sm:ytop-auto sm:yflex-col md:ymax-w-[420px]",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "ygroup ypointer-events-auto yrelative yflex yw-full yitems-center yjustify-between yspace-x-4 yoverflow-hidden yrounded-md yp-6 ypr-8 yshadow-lg ytransition-all data-[swipe=cancel]:ytranslate-x-0 data-[swipe=end]:ytranslate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:ytranslate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:ytransition-none data-[state=open]:yanimate-in data-[state=closed]:yanimate-out data-[swipe=end]:yanimate-out data-[state=closed]:yfade-out-80 data-[state=closed]:yslide-out-to-right-full data-[state=open]:yslide-in-from-top-full data-[state=open]:sm:yslide-in-from-bottom-full dark:yborder-slate-800",
  {
    variants: {
      variant: {
        default:
          " ybg-green-600 ytext-white dark:ybg-slate-950 dark:ytext-slate-50",
        destructive:
          "ydestructive ygroup  ybg-red-500 ytext-slate-50 dark:yborder-red-900 dark:ybg-red-900 dark:ytext-slate-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "yinline-flex yh-8 yshrink-0 yitems-center yjustify-center yrounded-md yborder yborder-slate-200 ybg-transparent ypx-3 ytext-sm yfont-medium yring-offset-white ytransition-colors hover:ybg-slate-100 focus:youtline-none focus:yring-2 focus:yring-slate-950 focus:yring-offset-2 disabled:ypointer-events-none disabled:yopacity-50 group-[.destructive]:yborder-slate-100/40 group-[.destructive]:hover:yborder-red-500/30 group-[.destructive]:hover:ybg-red-500 group-[.destructive]:hover:ytext-slate-50 group-[.destructive]:focus:yring-red-500 dark:yborder-slate-800 dark:yring-offset-slate-950 dark:hover:ybg-slate-800 dark:focus:yring-slate-300 dark:group-[.destructive]:yborder-slate-800/40 dark:group-[.destructive]:hover:yborder-red-900/30 dark:group-[.destructive]:hover:ybg-red-900 dark:group-[.destructive]:hover:ytext-slate-50 dark:group-[.destructive]:focus:yring-red-900",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "yabsolute yright-2 ytop-2 yrounded-md yp-1 ytext-slate-950/50 yopacity-0 ytransition-opacity hover:ytext-red-950 focus:yopacity-100 focus:youtline-none focus:yring-2 group-hover:yopacity-100 group-[.destructive]:ytext-red-300 group-[.destructive]:hover:ytext-red-50 group-[.destructive]:focus:yring-red-400 group-[.destructive]:focus:yring-offset-red-600 dark:ytext-slate-50/50 dark:hover:ytext-slate-50",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="yh-4 yw-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("ytext-sm yfont-semibold", className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("ytext-sm yopacity-90", className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
