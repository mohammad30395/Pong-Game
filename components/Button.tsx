import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary:
    "border-cyan-300/60 bg-cyan-300 text-slate-950 shadow-[0_0_28px_rgba(34,211,238,0.32)] hover:bg-white",
  secondary:
    "border-fuchsia-300/50 bg-fuchsia-400/12 text-fuchsia-100 hover:bg-fuchsia-400/22",
  ghost: "border-white/15 bg-white/6 text-slate-100 hover:bg-white/12",
  danger: "border-rose-300/50 bg-rose-500/14 text-rose-100 hover:bg-rose-500/24",
};

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-bold uppercase tracking-wide transition duration-200 disabled:cursor-not-allowed disabled:opacity-45";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  children: ReactNode;
  variant?: Variant;
}

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
