"use client";
import { useEffect, useRef } from "react";

export default function CanvasAnimation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  //粒子データ設定
  const particles = useRef<
    { x: number; y: number; dx: number; dy: number; size: number; char: string; fontSize: number; fontWeight: string }[]
  >([]);

  // ランダムな英字を生成する関数
  const getRandomChar = () => {
    // const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const chars = "CLIPLOGcliplog";
    return chars[Math.floor(Math.random() * chars.length)];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let prevWidth = canvas.clientWidth;
    let prevHeight = canvas.clientHeight;

    // Canvasのリサイズ処理
    const resizeCanvas = () => {
      const newWidth = canvas.parentElement?.clientWidth || 400;
      const newHeight = canvas.parentElement?.clientHeight || 400;
    
      // スケール計算（座標のみ適用）
      const scaleX = newWidth / prevWidth;
      const scaleY = newHeight / prevHeight;
    
      // キャンバスのサイズを更新
      canvas.width = newWidth;
      canvas.height = newHeight;
    
      // 粒子の座標を調整（フォントサイズはそのまま）
      particles.current.forEach((p) => {
        p.x *= scaleX;
        p.y *= scaleY;
      });
    
      // 更新後のサイズを保存
      prevWidth = newWidth;
      prevHeight = newHeight;
    };          

    // 粒子を生成する関数
    const createParticles = (count: number, x?: number, y?: number) => {
      // フォントウェイト設定
      const fontWeights = ["normal", "bold", "bolder", "lighter"];
      for (let i = 0; i < count; i++) {
        particles.current.push({
            x: x ?? Math.random() * canvas.width,
            y: y ?? Math.random() * canvas.height,
            dx: (Math.random() - 0.5) * 2,
            dy: (Math.random() - 0.5) * 2,
            size: Math.random() * 6 + 3,
            char: getRandomChar(),
            fontSize: Math.floor(Math.random() * 60) + 10, // 10px〜70pxのランダムなサイズ
            fontWeight: fontWeights[Math.floor(Math.random() * fontWeights.length)], // ランダムなウェイト
        });
      }
    };

    // リサイズ処理呼び出し
    resizeCanvas();
    // 初期粒子を増やす(30個)
    createParticles(30);

    // アニメーション関数
    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.textAlign = "center"; // 文字の中央を基準に配置
        ctx.textBaseline = "middle";
      
        particles.current.forEach((p) => {
          ctx.font = `${p.fontWeight} ${p.fontSize}px Helvetica`; // ランダムなフォントサイズ＆ウェイト
          ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
          ctx.fillText(p.char, p.x, p.y); // 文字を描画
      
          p.x += p.dx;
          p.y += p.dy;
      
          if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        });
      
        animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // クリックで粒子を追加
    const addParticles = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      createParticles(12, x, y); // クリック位置に12個追加
    };

    // マウスムーブで粒子を引き寄せる
    const moveParticles = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      particles.current.forEach((p) => {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy); // 粒子とマウスの直線距離を算出

        // 粒子がマウスから150px以内にある場合
        if (distance < 150) {
            const force = 1 - distance / 200; // 近い粒子ほど強く引き寄せる
          p.x += dx * 0.04; // 引き寄せる力を強くする
          p.y += dy * 0.04;
        }
      });
    };

    window.addEventListener("resize", resizeCanvas);
    canvas.addEventListener("click", addParticles);
    canvas.addEventListener("mousemove", moveParticles);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("click", addParticles);
      canvas.removeEventListener("mousemove", moveParticles);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full"></canvas>;
}
