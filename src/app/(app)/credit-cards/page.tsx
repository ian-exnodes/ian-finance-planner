import { Pencil, Plus } from "lucide-react";

import {
  getCreditDueForMonth,
  getCreditTotalsByStatementMonth,
} from "@/lib/calculations";
import { formatMonthVi, formatVND } from "@/lib/formatters";
import {
  getCreditCards,
  getCreditTransactions,
} from "@/features/credit-cards/repository";
import { CardDialog } from "@/features/credit-cards/card-dialog";
import { DeleteCardButton } from "@/features/credit-cards/delete-card-button";
import { TransactionDialog } from "@/features/credit-cards/transaction-dialog";
import { TransactionsTable } from "@/features/credit-cards/transactions-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function CreditCardsPage() {
  const [cards, transactions] = await Promise.all([
    getCreditCards(),
    getCreditTransactions(),
  ]);

  const totalsByMonth = getCreditTotalsByStatementMonth(transactions);
  const statementMonths = Object.keys(totalsByMonth).sort().reverse();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Thẻ tín dụng</h1>
          <p className="text-sm text-muted-foreground">
            Thẻ, giao dịch và số tiền phải trả theo kỳ sao kê.
          </p>
        </div>
        <div className="flex gap-2">
          {cards.length > 0 && (
            <TransactionDialog
              cards={cards}
              trigger={
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm giao dịch
                </Button>
              }
            />
          )}
          <CardDialog
            trigger={
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Thêm thẻ
              </Button>
            }
          />
        </div>
      </div>

      {cards.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
            <p className="font-medium">Chưa có thẻ tín dụng.</p>
            <p className="text-sm text-muted-foreground">
              Hãy thêm thẻ để theo dõi giao dịch và số tiền phải trả mỗi kỳ
              sao kê.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
            const unpaid = transactions
              .filter((t) => t.card_id === card.id && !t.paid)
              .reduce((sum, t) => sum + t.amount, 0);
            return (
              <Card key={card.id}>
                <CardHeader className="flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle className="text-base">{card.name}</CardTitle>
                    <CardDescription>{card.provider}</CardDescription>
                  </div>
                  <div className="flex">
                    <CardDialog
                      card={card}
                      trigger={
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Chỉnh sửa thẻ tín dụng"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <DeleteCardButton id={card.id} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  <p className="flex justify-between">
                    <span className="text-muted-foreground">Chưa trả</span>
                    <span className="font-medium">{formatVND(unpaid)}</span>
                  </p>
                  {card.credit_limit != null && (
                    <p className="flex justify-between">
                      <span className="text-muted-foreground">Hạn mức</span>
                      <span>{formatVND(card.credit_limit)}</span>
                    </p>
                  )}
                  <p className="flex justify-between">
                    <span className="text-muted-foreground">Ngày sao kê</span>
                    <span>
                      {card.statement_day ? `Ngày ${card.statement_day}` : "—"}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-muted-foreground">Ngày đến hạn</span>
                    <span>{card.due_day ? `Ngày ${card.due_day}` : "—"}</span>
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {statementMonths.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tổng theo kỳ sao kê</CardTitle>
            <CardDescription>
              Tổng giao dịch và số tiền chưa trả của từng kỳ.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kỳ sao kê</TableHead>
                    <TableHead className="text-right">Tổng giao dịch</TableHead>
                    <TableHead className="text-right">Chưa trả</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {statementMonths.map((month) => (
                    <TableRow key={month}>
                      <TableCell className="font-medium">
                        {formatMonthVi(month)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatVND(totalsByMonth[month])}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatVND(getCreditDueForMonth(transactions, month))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {cards.length > 0 &&
        (transactions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
              <p className="font-medium">Chưa có giao dịch.</p>
              <p className="text-sm text-muted-foreground">
                Hãy thêm giao dịch thẻ để theo dõi số tiền phải trả theo kỳ
                sao kê.
              </p>
            </CardContent>
          </Card>
        ) : (
          <TransactionsTable transactions={transactions} cards={cards} />
        ))}
    </div>
  );
}
