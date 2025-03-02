import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function IndexPage() {
  return (
    <>
      {/* タイトル */}
      <section className="pt-6 md:pt-10 lg:py-32 pb-8 mb:pb-12 flex justify-center items-center">
        <div className="container text-center flex flex-col items-center gap-4 max-w-[64rem]">
          <h1 className="font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            CLIPLOG
          </h1>
          <div className="text-muted-foreground sm:text-xl leading-normal max-w-[42rem]">
            <p>自由に投稿をポストできるブログアプリです。</p>
            <p>Twitchクリップの検索機能があり、クリップのシェアに便利です。</p>
          </div>
          <div className="space-x-4">
            <Link 
              href={"/login"} 
              className={cn(buttonVariants({ size: "lg" }))}
            >
              はじめる
            </Link>
            <Link 
              href={siteConfig.links.github} 
              className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
              target="_blank"
              rel="noreferrer"
            >
              Github
            </Link>
          </div>
        </div>
      </section>

      {/* 特徴 */}
      <section 
        id="features" 
        className="container mx-auto flex flex-col items-center justify-center text-center py-8 md:py-12 lg:py-24 bg-slate-50 space-y-6"
      >
        {/* 特徴 - 説明 */}
        <div className="text-center space-y-6 max-w-[58rem] mx-auto">
          <h2 className="font-extrabold text-3xl md:text-6xl">
            セービスの特徴
          </h2>
          <div className="text-muted-foreground sm:text-lg sm:leading-7">
            <p>このプロジェクトはモダンな技術スタックを使って作られたWebアプリケーションです。</p>
            <p>Next.js AppRouterやContentlayerを利用してマークダウン形式でブログ投稿ができます。</p>
          </div>
        </div>

        {/* 特徴 - カード */}
        <div className="mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-[64rem]">
          {/* Next.js */}
          <div className="bg-background border p-2 rounded-lg">
            <div className="flex flex-col justify-between p-6 h-[250px] sm:h-[300px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 128 128">
                <path d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64c11.2 0 21.7-2.9 30.8-7.9L48.4 55.3v36.6h-6.8V41.8h6.8l50.5 75.8C116.4 106.2 128 86.5 128 64c0-35.3-28.7-64-64-64zm22.1 84.6l-7.5-11.3V41.8h7.5v42.8z"/>
              </svg>
              <div className="space-y-2 text-left">
                <h3 className="font-bold">Next.js</h3>
                <p className="text-sm text-muted-foreground">
                  Next.js 13で導入されたルーティングシステム（App Router）を使用。
                  フォルダ構造がそのままURLになる、共通のレイアウトを簡単に適用できる、サーバーコンポーネントを使って簡単にデータ取得ができる、等の特徴があります。
                </p>
              </div>
            </div>
          </div>

          {/* Tailwind CSS */}
          <div className="bg-background border p-2 rounded-lg">
            <div className="flex flex-col justify-between p-6 h-[250px] sm:h-[300px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 512 512">
                <path fill="currentColor" d="M128 204.667C145.062 136.227 187.738 102 256 102c102.4 0 115.2 77 166.4 89.833c34.138 8.56 64-4.273 89.6-38.5C494.938 221.773 452.262 256 384 256c-102.4 0-115.2-77-166.4-89.833c-34.138-8.56-64 4.273-89.6 38.5zm-128 154C17.062 290.227 59.738 256 128 256c102.4 0 115.2 77 166.4 89.833c34.138 8.56 64-4.273 89.6-38.5C366.938 375.773 324.262 410 256 410c-102.4 0-115.2-77-166.4-89.833c-34.138-8.56-64 4.273-89.6 38.5z"/>
              </svg>
              <div className="space-y-2 text-left">
                <h3 className="font-bold">Tailwind CSS</h3>
                <p className="text-sm text-muted-foreground">
                  CSSフレームワークはTailwind CSSを使用。
                  また、Tailwind CSSベースのUIコンポーネントライブラリとしてshadcn/uiを導入しています。
                  必要なコンポーネントをプロジェクトに追加し、カスタマイズして使っています。
                </p>
              </div>
            </div>
          </div>

          {/* Twitch API */}
          <div className="bg-background border p-2 rounded-lg">
              <div className="flex flex-col justify-between p-6 h-[250px] sm:h-[300px]">
                <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 16 16">
                  <path fill="currentColor" d="M1.5 0L0 2.5V14h4v2h2l2-2h2.5L15 9.5V0H1.5zM13 8.5L10.5 11H8l-2 2v-2H3V2h10v6.5z"/><path fill="currentColor" d="M9.5 4H11v4H9.5V4zm-3 0H8v4H6.5V4z"/>
                </svg>
                <div className="space-y-2 text-left">
                  <h3 className="font-bold">Twitch API</h3>
                  <p className="text-sm text-muted-foreground">
                    Twitch APIはストリーミングプラットフォームのデータにアクセスするための開発ツールです。
                    クリップ検索APIはその機能の一つとして、視聴者が作成した短い動画クリップを条件指定して検索・取得できる仕組みを提供しています。
                  </p>
                </div>
              </div>
          </div>
        </div>

        <div className="mx-auto">
          <p className="text-muted-foreground sm:text-lg sm:leading-7">
            CLIPLOGはログインするとブログ投稿ができるようになります。
          </p>
        </div>
      </section>

      {/* コンタクト */}
      <section 
        id="contact" 
        className="w-full flex flex-col items-center justify-center text-center py-8 md:py-12 lg:py-24"
      >
        <div className="max-w-[58rem] w-full px-4">
          <h2 className="font-extrabold text-3xl md:text-6xl">
            Contact Me
          </h2>
          <div className="mt-4 text-muted-foreground sm:text-lg sm:leading-7">
            <p>もしもWebサービスが気に入った場合は下記よりご連絡ください。</p>
            <p>お仕事のご連絡をお待ちしております。</p>
            <Link 
              href={siteConfig.links.contact} 
              className="underline underline-offset-4"
              target="_blank"
              rel="noreferrer"
            >
              お仕事はこちらまで
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}