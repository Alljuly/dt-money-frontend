import { formatCurrency } from "@/utils";
import Image from "next/image";

export interface ICardProps {
 title: string;
 value: number;
 type: "INCOME" | "OUTCOME" | "total";
}
export function Card({ title, type, value }:ICardProps){
  const cardBgColor = ["INCOME", "OUTCOME"].includes(type) 
    ? "bg-white" 
    : value >= 0
      ? "bg-INCOME"
      : "bg-OUTCOME";
   const cardIcon = type === "INCOME"
     ? "/income.png"
     : type === "OUTCOME"
       ? "/outcome.png"
       : "/total.png";
    const cardTextColor = type === "total" 
        ? "text-white" 
        : "text-title";
  return (
    <div className={`w-[352px] h-[136px] ${cardBgColor} rounded-md`}>
       <div className="flex items-center justify-between px-8 py-6">
        <span className={`text-[16px] ${cardTextColor}`}>{title}</span> 
        <Image src={cardIcon} width={32} height={32} alt="Card Icon" />
       </div>
       <span className={`px-8 pt-4 text-4xl ${cardTextColor}`}>{formatCurrency(value)}</span>
    </div>
  )
}