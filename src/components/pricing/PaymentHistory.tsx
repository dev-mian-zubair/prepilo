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
    date: "2024-03-10",
    description: "Monthly subscription",
    amount: "$29.99",
    status: "Completed"
  },
  {
    id: "3",
    date: "2024-03-05",
    description: "500 minutes purchase",
    amount: "$39.99",
    status: "Completed"
  },
  {
    id: "4",
    date: "2024-02-28",
    description: "1000 minutes purchase",
    amount: "$69.99",
    status: "Completed"
  },
  {
    id: "5",
    date: "2024-02-15",
    description: "Monthly subscription",
    amount: "$29.99",
    status: "Completed"
  },
  {
    id: "6",
    date: "2024-02-01",
    description: "200 minutes purchase",
    amount: "$19.99",
    status: "Completed"
  },
  {
    id: "7",
    date: "2024-01-25",
    description: "Monthly subscription",
    amount: "$29.99",
    status: "Completed"
  },
  {
    id: "8",
    date: "2024-01-15",
    description: "Custom minutes purchase",
    amount: "$49.99",
    status: "Completed"
  },
  {
    id: "9",
    date: "2024-01-01",
    description: "Monthly subscription",
    amount: "$29.99",
    status: "Completed"
  },
  {
    id: "10",
    date: "2023-12-20",
    description: "100 minutes purchase",
    amount: "$9.99",
    status: "Completed"
  },
  {
    id: "11",
    date: "2023-12-15",
    description: "Monthly subscription",
    amount: "$29.99",
    status: "Completed"
  },
  {
    id: "12",
    date: "2023-12-10",
    description: "500 minutes purchase",
    amount: "$39.99",
    status: "Completed"
  },
  {
    id: "13",
    date: "2023-12-01",
    description: "Monthly subscription",
    amount: "$29.99",
    status: "Completed"
  },
  {
    id: "14",
    date: "2023-11-25",
    description: "1000 minutes purchase",
    amount: "$69.99",
    status: "Completed"
  },
  {
    id: "15",
    date: "2023-11-15",
    description: "Monthly subscription",
    amount: "$29.99",
    status: "Completed"
  }
];

export default function PaymentHistory() {
  return (
    <div className="border border-divider rounded-medium">
      <Table 
        aria-label="Payment history"
        removeWrapper
        classNames={{
          base: "bg-transparent",
          wrapper: "bg-transparent",
          thead: "bg-transparent",
          tbody: "bg-transparent",
          tr: "bg-transparent",
          th: "bg-transparent",
          td: "bg-transparent"
        }}
      >
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
    </div>
  );
} 