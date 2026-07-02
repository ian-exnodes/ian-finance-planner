"use client";

import { LogOut } from "lucide-react";

import { signOut } from "@/features/auth/actions";
import { MobileNav } from "@/components/shared/mobile-nav";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Topbar({ email }: { email: string }) {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b bg-background px-4 md:px-6">
      <MobileNav />
      <div className="flex-1" />
      <ThemeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label="Tài khoản"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="max-w-56 truncate font-normal text-muted-foreground">
            {email}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
