import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="max-w-xl text-3xl font-bold text-foreground">
        Quản lý chi tiêu và trả góp cá nhân
      </h1>
      <p className="max-w-md text-muted-foreground">
        Theo dõi thu nhập, thẻ tín dụng, ví trả sau và các khoản cần thanh
        toán hằng tháng.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/login">Đăng nhập</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/signup">Tạo tài khoản</Link>
        </Button>
      </div>
    </main>
  );
}
