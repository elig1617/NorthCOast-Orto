"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { Logo } from "@/components/Logo";
import { nav } from "@/lib/content";
import { confirm } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Logo />
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {nav.primary.map((item) => (
            <div key={item.href} className="relative group">
              <Link
                href={item.href}
                className={`px-3 py-2 text-sm font-medium no-underline hover:text-red ${
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                    ? "text-red"
                    : "text-ink"
                }`}
              >
                {item.label}
              </Link>
              {"children" in item && item.children ? (
                <div className="invisible absolute left-0 top-full z-30 min-w-56 border border-line bg-white py-2 opacity-0 shadow-[0_12px_30px_rgba(22,19,16,0.08)] transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-4 py-2 text-sm text-ink no-underline hover:bg-paper-2"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/contact"
            className="text-sm font-medium text-ink no-underline hover:text-red"
          >
            Call {confirm.phone}
          </Link>
        </div>
        <button
          type="button"
          className="inline-flex items-center border border-ink px-3 py-2 text-sm lg:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open ? (
        <div
          id={menuId}
          className="border-t border-line bg-white px-4 py-4 lg:hidden"
        >
          <nav aria-label="Mobile">
            <ul className="space-y-3">
              {nav.primary.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="font-serif text-2xl no-underline">
                    {item.label}
                  </Link>
                  {"children" in item && item.children ? (
                    <ul className="mt-2 space-y-1 pl-3">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link href={child.href} className="text-sm text-slate no-underline">
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
