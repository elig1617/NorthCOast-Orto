import Link from "next/link";
import { contact } from "@/lib/site";

export function MobileActions() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur md:hidden">
      <nav
        aria-label="Quick actions"
        className="grid grid-cols-3 text-center text-[0.7rem] font-medium uppercase tracking-wide"
      >
        <a href={contact.phoneHref} className="border-r border-line px-2 py-3 text-ink no-underline">
          Call
          <span className="mt-1 block text-[0.62rem] normal-case tracking-normal text-slate">
            {contact.phone}
          </span>
        </a>
        <Link href="/providers" className="border-r border-line px-2 py-3 text-ink no-underline">
          Refer
          <span className="mt-1 block text-[0.62rem] normal-case tracking-normal text-slate">
            Providers
          </span>
        </Link>
        <Link href="/contact" className="px-2 py-3 text-ink no-underline">
          Contact
          <span className="mt-1 block text-[0.62rem] normal-case tracking-normal text-slate">
            Quote or order
          </span>
        </Link>
      </nav>
    </div>
  );
}
