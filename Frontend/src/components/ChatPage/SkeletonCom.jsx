import React from "react";
import { Skeleton } from "../ui/skeleton";

const SkeletonCom = () => {
  return (
    <div className=" yflex yflex-col ygap-2">
      <Skeleton className="yh-[40px] yrounded-md ybg-gray-400" />
      <Skeleton className="yh-[40px] yrounded-md ybg-gray-400" />
      <Skeleton className="yh-[40px] yrounded-md ybg-gray-400" />
      <Skeleton className="yh-[40px] yrounded-md ybg-gray-400" />
      <Skeleton className="yh-[40px] yrounded-md ybg-gray-400" />
      <Skeleton className="yh-[40px] yrounded-md ybg-gray-400" />
      <Skeleton className="yh-[40px] yrounded-md ybg-gray-400" />
    </div>
  );
};

export default SkeletonCom;
