import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icon } from "./icon";
import { signIn } from "@/lib/auth";

export default async function UserAuthForm() {
  return (
    <div className="grid gap-6 p-8 sm:p-0">
      {/* メールアドレスログインフォーム */}
      {/* <form>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label htmlFor="email">メールアドレス</Label>
            <Input id="email" placeholder="name@example.com" type="email" />
          </div>
          <button className={cn(buttonVariants())}>
            メールアドレスでログイン
          </button>
        </div>
      </form> */}

      {/* または */}
      {/* <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="text-muted-foreground px-2 bg-background">
            または
          </span>
        </div>
      </div> */}

      <div className="flex flex-col gap-3">
        {/* Google認証 */}
        <form
          action={async () => {
            "use server"
            await signIn("google", { redirectTo: "/dashboard" })
          }}
        >
          <button 
            className={cn(
              buttonVariants(), 
              "w-full flex items-center justify-center"
            )}
          >
            <Icon.google />
            Google
          </button>
        </form>

        {/* Github認証 */}
        <form
          action={async () => {
            "use server"
            await signIn("github", { redirectTo: "/dashboard" })
          }}
        >
          <button 
            className={cn(
              buttonVariants(), 
              "w-full flex items-center justify-center"
            )}
          >
            <Icon.github />
            Github
          </button>
        </form>
      </div>
    </div>
  )
}