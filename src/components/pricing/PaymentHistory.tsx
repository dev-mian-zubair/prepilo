import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/react";
import { cn } from "@/lib/utils";

const transactions = [
  {
    id: "1",
    date: "2024-03-15",
    description: "100 minutes purchase",
    amount: "$9.99",
    status: "Completed"
  },
  {
    id: "2",
    date: "2024-02-01",
    description: "Monthly subscription",
    amount: "$29.99",
    status: "Completed"
  },
  {
    id: "3",
    date: "2024-01-15",
    description: "500 minutes purchase",
    amount: "$39.99",
    status: "Completed"
  }
];

export default function PaymentHistory() {
  return (
    <Table aria-label="Payment history">
      <TableHeader>
        <TableColumn>Date</TableColumn>
        <TableColumn>Description</TableColumn>
        <TableColumn>Amount</TableColumn>
        <TableColumn>Status</TableColumn>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>{transaction.date}</TableCell>
            <TableCell>{transaction.description}</TableCell>
            <TableCell>{transaction.amount}</TableCell>
            <TableCell>
              <span className={cn(
                "px-2 py-1 rounded-full text-xs",
                transaction.status === "Completed" 
                  ? "bg-success-100 text-success" 
                  : "bg-warning-100 text-warning"
              )}>
                {transaction.status}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 