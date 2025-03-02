"use client";
import { NavItem } from "@/types";
import Link from "next/link";
import { ReactNode, useState } from "react";
import MobileNav from "./mobile-nav";

interface MainNavProps {
  items?: NavItem[];
  children?: ReactNode;
}

export default function MainNav({ items }: MainNavProps) {
  const [ showMobileMenu, setShowMobileMenu ] = useState<boolean>(false);

  return (
    <div className="flex items-center md:gap-10">
      <Link href={"/"} className="hidden md:flex items-center space-x-2">
        <span className="font-bold hidden sm:inline-block">CLIPLOG</span>
      </Link>
      <nav className="md:flex gap-6 hidden">
        {items?.map((item, index) => (
          <Link 
            key={index}
            href={item.href} 
            className="text-lg sm:text-sm font-medium hover:text-foreground/80"
          >
            {item.title}
          </Link>
        ))}
      </nav>
      {/* スマホサイズ用メニュー */}
      <button 
        className="md:hidden" 
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        {/* クローズ */}
        {showMobileMenu && (
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 48 48">
            <g fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth={4}>
              <path d="M8 8L40 40"/><path d="M8 40L40 8"/>
            </g>
          </svg>
        )}
        {/* ハンバーガーメニュー */}
        {!showMobileMenu && (
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        )}
      </button>
      {showMobileMenu && (
        <MobileNav 
          items={items} 
          onClose={() => setShowMobileMenu(!showMobileMenu)}
        />
      )}
    </div>
  )
}