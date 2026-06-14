type LogoProps = {
  variant?: "dark" | "light"
  className?: string
}

export function Logo({ variant = "dark", className = "" }: LogoProps) {
  const textColor = variant === "light" ? "text-white" : "text-navy-text"

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoMark />
      <div className="leading-none">
        <p className={`font-serif text-lg font-bold tracking-tight ${textColor}`}>Asia Web3 &amp; AI Alliance</p>
        <p className="text-sm font-semibold tracking-[0.35em] text-awaj-red">JAPAN</p>
      </div>
    </div>
  )
}

export function LogoMark({ size = 44 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="AWAJ logo"
    >
      {/* Navy outer S */}
      <path
        d="M46 16c-3.5-4-9-6-15-6C18 10 10 17 10 26c0 8 6 12 15 14"
        stroke="#061B33"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M18 48c3.5 4 9 6 15 6 13 0 21-7 21-16 0-8-6-12-15-14"
        stroke="#061B33"
        strokeWidth="7"
        strokeLinecap="round"
      />
      {/* Red accent dot/cap */}
      <path d="M10 26c0-9 8-16 21-16" stroke="#D71920" strokeWidth="7" strokeLinecap="round" />
    </svg>
  )
}
