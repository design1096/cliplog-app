"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import MainNav from "@/components/main-nav";
import { marketingConfig } from "@/config/marketing";
import SiteFooter from "@/components/site-footer";
import { usePathname } from "next/navigation";

export default function MarketingLayout({ 
  children,
} : { 
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // 現在のパスを取得

  return (
    <div>
      {/* ヘッダー */}
      <header className="w-full bg-background">
        <div className="container mx-auto h-20 py-6 flex items-center justify-between px-4">
          {/* パスに応じてナビゲーションを変更 */}
          {pathname === "/" ? (
            <MainNav items={marketingConfig.mainNav} />
          ) : pathname.startsWith("/blog") ? (
            <MainNav items={marketingConfig.blogNav} />
          ) : (
            <MainNav items={marketingConfig.mainNav} />
          )}
          <nav>
            <Link 
              href={"/login"}
              className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "px-4")}
            >
              ログイン
            </Link>
          </nav>
        </div>
      </header>
      {/* メイン */}
      <main>
        {children}
      </main>
      {/* フッター */}
      <SiteFooter />
    </div>
  );
};
