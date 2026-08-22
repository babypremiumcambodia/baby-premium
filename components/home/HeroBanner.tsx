"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/language/LanguageProvider";

export default function HeroBanner() {
  const { language } = useLanguage();

  return (
    <section className="glass mt-3 overflow-hidden rounded-[36px] p-6">
      <p className="text-xs font-semibold tracking-[0.28em] text-gold">
        BABY PREMIUM & ESSENTIALS
      </p>

      <h2
        className={`mt-3 font-bold ${
          language === "km"
            ? "font-khmer text-2xl leading-[1.7]"
            : "text-3xl leading-tight"
        }`}
      >
        {language === "km" ? (
          <>
            តម្រូវការប្រចាំថ្ងៃសម្រាប់កូនលោកអ្នក
      
          </>
        ) : (
          <>
            Original Products
            
          </>
        )}
      </h2>

      <p
        className={`mt-3 text-gray-500 ${
          language === "km"
            ? "font-khmer text-sm leading-7"
            : "text-sm leading-6"
        }`}
      >
        {language === "km" ? (
          <>
            គុណភាពល្អមកពីរប្រទេសអូស្រ្ដាលី នូវែលសេឡង់ សហរដ្ឋអាមេរិក និងអឺរ៉ុប
            
          </>
        ) : (
          <>
            Trusted brands from Australia, New Zealand, USA
            <br />
            &amp; Europe
          </>
        )}
      </p>

      <Link
        href="/shop"
        className={`mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 font-semibold text-white transition hover:opacity-90 active:scale-95 ${
          language === "km"
            ? "font-khmer leading-7"
            : ""
        }`}
      >
        {language === "km" ? "មើលទំនិញ" : "Shop Now"}

        <ArrowRight size={18} />
      </Link>
    </section>
  );
}