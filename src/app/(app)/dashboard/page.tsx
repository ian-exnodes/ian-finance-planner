import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Tổng quan tài chính</h1>
      <Card>
        <CardHeader>
          <CardTitle>Chưa có dữ liệu</CardTitle>
          <CardDescription>
            Hãy thêm thu nhập hằng tháng và chi phí cố định để hệ thống tính
            toán dòng tiền chính xác hơn.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Bảng điều khiển chi tiết (biểu đồ trả nợ, tiền còn lại, tỷ lệ trả nợ)
          sẽ hiển thị tại đây khi bạn bắt đầu nhập dữ liệu.
        </CardContent>
      </Card>
    </div>
  );
}
