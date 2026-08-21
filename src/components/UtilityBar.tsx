import Link from "next/link";
import { company, contact } from "@/lib/site";

export function UtilityBar() {
  return (
    <div className="bg-forest text-[#e8efe9]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2 text-[0.72rem] tracking-wide uppercase md:px-6">
        <p className="font-mono">
          {company.shortName} · Mon–Fri {company.hours.weekday}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <a href={contact.phoneHref} className="text-[#e8efe9] no-underline hover:text-white">
            Call {contact.phone}
          </a>
          <Link href="/providers" className="text-[#e8efe9] no-underline hover:text-white">
            Refer a patient
          </Link>
          <Link href="/patients" className="text-[#e8efe9] no-underline hover:text-white">
            Patient billing
          </Link>
          <Link href="/va-fss-contractor" className="text-[#e8efe9] no-underline hover:text-white">
            Government buyers
          </Link>
        </div>
      </div>
    </div>
  );
}
