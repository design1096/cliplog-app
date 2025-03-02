"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import TextareaAutosize from 'react-textarea-autosize';
import EditorJS from '@editorjs/editorjs';
import { useCallback, useEffect, useRef, useState } from "react";
import Header from '@editorjs/header';
import LinkTool from '@editorjs/link';
import EditorjsList from '@editorjs/list';
import Code from '@editorjs/code';
import RawTool from '@editorjs/raw';
import { Post } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postPatchSchema, postPatchSchemaType } from "@/lib/validations/post";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaAnglesRight } from "react-icons/fa6";
import { FaAnglesLeft } from "react-icons/fa6";
import TwitchEmbedCopy from "./twitch-embed-copy";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Icon } from "./icon";

interface EditorProps {
  post: Pick<Post, "id" | "title" | "content" | "published">;
}

export default function Editor({ post }: EditorProps) {
  const ref = useRef<EditorJS | undefined>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [streamerId, setStreamerId] = useState<string>(""); // 配信者ID
  const [gameId, setGameId] = useState<string>(""); // ゲームID
  const [streamerName, setStreamerName] = useState<string>(""); // 配信者名
  const [gameName, setGameName] = useState<string>(""); // ゲーム名
  const [startDate, setStartDate] = useState<Date>(); // クリップ作成開始日
  const [enddate, setEndDate] = useState<Date>(); // クリップ作成終了日
  const [clips, setClips] = useState<any[]>([]); // 現在表示中のクリップ
  const [history, setHistory] = useState<{ clips: any[]; pagination: { after?: string; before?: string } }[]>([]); // 過去のページのクリップを保存
  const [currentPage, setCurrentPage] = useState<number>(0); // 現在のページ番号
  const [isSearching, setIsSearching] = useState<boolean>(false); // 検索状態管理
  const [isNextSearching, setIsNextSearching] = useState<boolean>(false); // 「次へ」検索状態管理
  const [paginationCursor, setPaginationCursor] = useState<{ after?: string; before?: string }>({});
  const [isSaving, setIsSaving] = useState<boolean>(false); // 保存状態管理
  const [isPublishing, setIsPublishing] = useState<boolean>(false); // 公開状態管理
  const dialogContentRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // エディタの生成
  const initializeEditor = useCallback(async () => {
    const body = postPatchSchema.parse(post);

    const editor = new EditorJS({
      holder: "editor",
      onReady() {
        ref.current = editor;
      },
      placeholder: "ここに記事を書く",
      inlineToolbar: true,
      data: body.content,
      tools: {
        header: Header,
        raw: RawTool,
        linkTool: LinkTool,
        list: EditorjsList,
        code: Code,
      }
    });
  }, [post]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      initializeEditor();
    }

    return () => {
      ref.current?.destroy();
      ref.current = undefined;
    };
  }, [isMounted, initializeEditor]);

  const { register, handleSubmit, formState: { errors } } = useForm<postPatchSchemaType>({
    resolver: zodResolver(postPatchSchema),
  });

  // Submit関数（保存API）
  const onSubmit = async (data: postPatchSchemaType) => {
    setIsSaving(true);
    const blocks = await ref.current?.save();
    const response = await fetch(`/api/posts/${post.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/jspn",
      },
      body: JSON.stringify({
        title: data.title,
        content: blocks,
      }),
    });

    setIsSaving(false);

    // 失敗した場合
    if (!response.ok) {
      return toast({
        title: "問題が発生しました。",
        description: "あなたの記事は保存されませんでした。もう一度お試しください。",
        variant: "destructive",
      });
    }

    router.refresh();
    return toast({
      description: "正常に保存されました。",
    });
  };

  // Twitch API（配信者ID取得）
  const fetchStreamerId = async (streamerName: string) => {
    const clientId = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;
    const accessToken = process.env.NEXT_PUBLIC_TWITCH_ACCESS_TOKEN;
    
    if (!clientId || !accessToken) {
      console.error("Twitch API credentials are missing.");
      return null;
    }
  
    const url = `https://api.twitch.tv/helix/users?login=${encodeURIComponent(streamerName)}`;
  
    const response = await fetch(url, {
      headers: {
        "Client-ID": clientId,
        "Authorization": `Bearer ${accessToken}`,
      },
    });
  
    if (!response.ok) {
      console.error("Failed to fetch streamer ID");
      return null;
    }
  
    const data = await response.json();
    return data.data?.[0]?.id || null;
  };
  
  // Twitch API（ゲームID取得）
  const fetchGameId = async (gameName: string) => {
    const clientId = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;
    const accessToken = process.env.NEXT_PUBLIC_TWITCH_ACCESS_TOKEN;
    
    if (!clientId || !accessToken) {
      console.error("Twitch API credentials are missing.");
      return null;
    }
  
    const url = `https://api.twitch.tv/helix/games?name=${encodeURIComponent(gameName)}`;
  
    const response = await fetch(url, {
      headers: {
        "Client-ID": clientId,
        "Authorization": `Bearer ${accessToken}`,
      },
    });
  
    if (!response.ok) {
      console.error("Failed to fetch game ID");
      return null;
    }
  
    const data = await response.json();
    return data.data?.[0]?.id || null;
  };  

  // Twitch API（クリップ検索）
  const fetchTwitchClips = async (streamerId: string, gameId: string, startDate?: Date, endDate?: Date, cursor?: { after?: string; before?: string }) => {
    const clientId = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;
    const accessToken = process.env.NEXT_PUBLIC_TWITCH_ACCESS_TOKEN;
    if (!clientId || !accessToken) {
      console.error("Twitch API credentials are missing.");
      return { clips: [], pagination: {} };
    }
  
    // Twitch API のエンドポイント
    let url = `https://api.twitch.tv/helix/clips?first=10`;
  
    if (streamerId) url += `&broadcaster_id=${streamerId}`;
    if (gameId) url += `&game_id=${gameId}`;
    if (startDate) url += `&started_at=${startDate.toISOString()}`;
    if (endDate) url += `&ended_at=${endDate.toISOString()}`;
    if (cursor?.after) {
      url += `&after=${cursor.after}`;
    } else if (cursor?.before) {
      url += `&before=${cursor.before}`;
    }
  
    const response = await fetch(url, {
      headers: {
        "Client-ID": clientId,
        "Authorization": `Bearer ${accessToken}`,
      },
    });
  
    if (!response.ok) {
      console.error("Failed to fetch Twitch clips");
      return { clips: [], pagination: {} };
    }
  
    const data = await response.json();
    return {
      clips: data.data || [],
      pagination: {
        after: data.pagination?.cursor ?? undefined, 
        before: cursor?.after ?? undefined, 
      },
    };
  };

  // Twitchクリップ検索ボタン押下時処理
  const handleSearch = async () => {
    setIsSearching(true); // 検索中
    let fetchedStreamerId = "";
    let fetchedGameId = "";

    // 配信者名→配信者ID変換
    if (streamerName) {
      fetchedStreamerId = await fetchStreamerId(streamerName);
      setStreamerId(fetchedStreamerId);
    }

    // ゲーム名→ゲームID変換
    if (gameName) {
      fetchedGameId = await fetchGameId(gameName);
      setGameId(fetchedGameId);
    }

    // クリップ検索
    const { clips: fetchedClips, pagination } = await fetchTwitchClips(fetchedStreamerId, fetchedGameId, startDate, enddate);
    setHistory([{ clips: fetchedClips, pagination }]); // 取得したクリップを履歴に保存
    setClips(fetchedClips);
    setCurrentPage(0);

    // 検索結果が空なら「次へ」ボタンを無効化
    setPaginationCursor({
      after: fetchedClips.length > 0 ? pagination.after ?? undefined : undefined
    });

    setIsSearching(false); // 検索完了
  };

  // 次へボタン押下時処理
  const handleNextPage = async () => {
    if (!paginationCursor.after) return; // 次のページがない場合は何もしない
    setIsNextSearching(true);
  
    const { clips: fetchedClips, pagination } = await fetchTwitchClips(
      streamerId, gameId, startDate, enddate, { after: paginationCursor.after }
    );
  
    if (fetchedClips.length === 0) {
      setPaginationCursor({ after: undefined, before: paginationCursor.after });
    } else {
      setHistory([...history, { clips: fetchedClips, pagination }]);
      setClips(fetchedClips);
      setCurrentPage(currentPage + 1);
      setPaginationCursor({
        after: pagination.after || undefined, // after がなければ undefined にする
        before: paginationCursor.after, // 現在の after を before に保存
      });
    }
  
    scrollToTop();
    setIsNextSearching(false);
  };
  
  // 前へボタン押下時処理
  const handlePrevPage = () => {
    if (currentPage === 0) return; // 最初のページなら何もしない
  
    // 1つ前のページの履歴を取得
    const prevHistory = history[currentPage - 1];
  
    if (!prevHistory) {
      console.error("Error: No previous history found");
      return;
    }
  
    setClips(prevHistory.clips || []); // clips が undefined の場合、空配列をセット
    setCurrentPage(currentPage - 1);
  
    setPaginationCursor({ 
      after: prevHistory.pagination.after ?? undefined,
      before: prevHistory.pagination.before ?? undefined
    });

    scrollToTop();
  };

  // 公開ボタン押下時処理
  const handlePublish = () => {
    return toast({
      description: "公開機能は現在準備中です。",
    });
  };

  // スクロールトップに移動（ダイアログ）
  const scrollToTop = () => {
    if (dialogContentRef.current) {
      dialogContentRef.current.scrollTop = 0;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-screen-lg mx-auto px-4">
      <div className="grid w-full gap-10">
        <div className="flex w-full items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-5">
            <Link 
              href={"/dashboard"}
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              戻る
            </Link>
            <p className="text-sm text-muted-foreground">
              {post.published ? "公開" : "ドラフト"}
            </p>
          </div>
          <div className="flex items-center space-x-5">
            {/* Twitchクリップを探すダイアログ */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Twitchクリップを探す</Button>
              </DialogTrigger>
              <DialogContent ref={dialogContentRef} className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Twitchクリップを探す</DialogTitle>
                  <DialogDescription>
                    Twitchクリップの埋め込みコードをエディタの「Raw HTML」に貼り付けてシェアしてみましょう。
                  </DialogDescription>
                </DialogHeader>

                {/* 入力フォーム */}
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    {/* 配信者名入力 */}
                    <Label htmlFor="streamerName" className="text-right">
                      配信者名
                    </Label>
                    <Input
                      id="streamerName"
                      placeholder="Enter the streamer name"
                      className="col-span-3"
                      value={streamerName}
                      onChange={(e) => setStreamerName(e.target.value)}
                      disabled={!!gameName}
                    />
                    {/* ゲーム名入力 */}
                    <Label htmlFor="gameName" className="text-right">
                      ゲーム名
                    </Label>
                    <Input
                      id="gameName"
                      placeholder="Enter the game name"
                      className="col-span-3"
                      value={gameName}
                      onChange={(e) => setGameName(e.target.value)}
                      disabled={!!streamerName}
                    />
                    {/* エラーメッセージ */}
                    {!streamerName && !gameName && (
                      <p className="text-red-500 col-span-4 text-sm text-right">
                        ※ 配信者名またはゲーム名のいずれかを入力してください。
                      </p>
                    )}
                    {/* クリップ作成開始日入力 */}
                    <Label htmlFor="name" className="text-right">
                      クリップ作成開始日
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "col-span-3 justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon />
                          {startDate ? format(startDate, "PPP") : <span>Pick a start date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {/* クリップ作成終了日入力 */}
                    <Label htmlFor="name" className="text-right">
                      クリップ作成終了日
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "col-span-3 justify-start text-left font-normal",
                            !enddate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon />
                          {enddate ? format(enddate, "PPP") : <span>Pick a end date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={enddate}
                          onSelect={setEndDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* 検索ボタン */}
                <DialogFooter>
                  {isSearching ? (
                    <Button disabled>
                      <Loader2 className="animate-spin" />
                      検索中
                    </Button>
                  ) : (
                    <Button 
                      type="button" 
                      onClick={handleSearch}
                      disabled={!streamerName && !gameName}
                    >
                      検索
                    </Button>
                  )}
                </DialogFooter>

                {/* クリップ表示エリア */}
                <div className="mt-4">
                  <DialogHeader>
                    <DialogTitle>検索結果</DialogTitle>
                    {Array.isArray(clips) && clips.length === 0 ? (
                      <DialogDescription>クリップが見つかりませんでした。</DialogDescription>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        {clips.map((clip) => (
                          <div key={clip.id} className="border rounded-lg overflow-hidden">
                            <iframe
                              src={`${clip.embed_url}&parent=${window.location.hostname}`}
                              height="200"
                              width="100%"
                              allowFullScreen
                            ></iframe>
                            <div className="flex items-center justify-between px-2 pt-2">
                              <p className="text-xs text-muted-foreground pr-2">{clip.broadcaster_name}</p>
                              <p className="text-xs text-muted-foreground">作成日:{format(clip.created_at, "yyyy/MM/dd")}</p>
                            </div>
                            <div className="flex items-center justify-between p-2">
                              <p className="text-sm font-medium pr-2">{clip.title}</p>
                              <p className="text-xs text-muted-foreground">{clip.view_count}回再生</p>
                            </div>
                            {/* 埋め込みコードコピー */}
                            <TwitchEmbedCopy clipId={clip.id} />
                            {/* clipsの長さが奇数なら空のdivを追加して、ボタンの位置を維持 */}
                            {clips.length % 2 !== 0 && <div></div>}
                          </div>
                        ))}
                        {/* 前へボタン */}
                        <div className="col-span-2 flex justify-between">
                          {isNextSearching ? (
                            <Button disabled>
                              <FaAnglesLeft className="text-white" />
                              前へ
                            </Button>
                          ) : (
                            <Button onClick={handlePrevPage} disabled={currentPage === 0}>
                              <FaAnglesLeft className="text-white" />
                              前へ
                            </Button>
                          )}
                          {/* 次へボタン */}
                          {isNextSearching ? (
                            <Button disabled>
                              <Loader2 className="animate-spin" />
                              検索中
                            </Button>
                          ) : (
                            <Button 
                              onClick={handleNextPage} 
                              disabled={isNextSearching || !paginationCursor.after}
                            >
                              次へ
                              <FaAnglesRight className="text-white" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </DialogHeader>
                </div>

                {/* 閉じるボタン */}
                <DialogFooter className="sm:justify-start">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      閉じる
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* 保存ボタン */}
            <button 
              className={cn(buttonVariants())}
              type="submit"
              disabled={isSaving}
            >
              {isSaving && (
                <Icon.spinner className="w-4 h-4 mr-2 animate-spin" />
              )}
              <span>保存</span>
            </button>

            {/* 公開ボタン */}
            {!post.published && (
              <button
                type="button"
                className={cn(buttonVariants({ variant: "destructive" }))}
                disabled={isPublishing}
                onClick={handlePublish}
              >
                {isPublishing && (
                  <Icon.spinner className="w-4 h-4 mr-2 animate-spin" />
                )}
                <span>公開</span>
              </button>
            )}
          </div>
        </div>
        {/* タイトル入力 */}
        <div className="max-w-[800px] w-full mx-auto">
          <TextareaAutosize 
            id="title" 
            autoFocus 
            defaultValue={post.title}
            placeholder="Post Title"
            className="w-full resize-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
            {...register("title")}
           />
        </div>
        {/* エディタ */}
        <div id="editor" className="min-h-[500px] max-w-full overflow-hidden px-2" />
        <p className="text-sm text-gray-500">
          Use
          <kbd className="rounded-md border bg-muted px-1 text-xs uppercase">
            Tab
          </kbd>
          to open the command menu
        </p>
      </div>
    </form>
  )
}