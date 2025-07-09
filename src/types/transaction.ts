export interface ITransaction {
    id?: string;
    title: string;
    price: number;
    category: string;
    data: Date;
    type: "INCOME" | "OUTCOME";
}

export interface ITotal {
    totalIncome: number 
    totalOutcome: number
    total: number
  }