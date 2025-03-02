import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import UserAuthForm from "@/components/user-auth-form";
import { ChevronLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: "Login",
  description: "CLIPLOGのアカウントログインページです。",
};

export default function LoginPage() {
  return (
    <div className="container mx-auto h-screen w-screen flex flex-col items-center justify-center">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute top-4 left-4 sm:top-8 sm:left-8"
        )}
      >
        <ChevronLeft />
        戻る
      </Link>
      <div className="mx-auto w-full flex flex-col justify-center space-y-6 sm:w-[370px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          {/* <p className="text-sm text-muted-foreground">
            メールアドレスを入力してログインできます。
          </p> */}
          <p className="text-sm text-muted-foreground">
            Google または Githubのアカウントでログインできます。
          </p> 
        </div>

        <UserAuthForm />

        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/register"
            className="hover:text-brand underline underline-offset-4"
          >
            アカウントを持っていませんか？
          </Link>
        </p>
      </div>
    </div>
  );
}