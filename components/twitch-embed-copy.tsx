import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check } from "lucide-react";

export default function TwitchEmbedCopy({ clipId }: { clipId: string }) {
  // 埋め込みコードの文字列を状態として管理
  const embedCode = `<iframe src="https://clips.twitch.tv/embed?clip=${clipId}&parent=${window.location.hostname}" frameborder="0" allowfullscreen="true" scrolling="no" height="378" width="620"></iframe>`;
  // コピー成功の状態を管理（true のときチェックマークを表示）
  const [copied, setCopied] = useState(false);

  // クリップボードにコピーする関数
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true); // コピー成功でアイコンを変更
      setTimeout(() => setCopied(false), 2000); // 2秒後にアイコンを元に戻す
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="grid flex-1 gap-2">
        <Label htmlFor="link" className="sr-only">
          Link
        </Label>
        <Input value={embedCode} readOnly />
      </div>
      <Button type="submit" size="sm" className="px-3" onClick={handleCopy}>
        <span className="sr-only">Copy</span>
        {copied ? <Check className="text-white" /> : <Copy />}
      </Button>
    </div>
  )
}