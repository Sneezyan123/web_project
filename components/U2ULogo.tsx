import Image from "next/image";

const SIZES = {
  header: { height: 35, className: "h-[35px] w-auto max-h-[58px]" },
  footer: { height: 56, className: "h-14 w-auto" },
} as const;

export function U2ULogo({ variant = "header" }: { variant?: keyof typeof SIZES }) {
  const { className } = SIZES[variant];

  return (
    <Image
      src="/logo.png"
      alt="U2U"
      width={139}
      height={76}
      className={`${className} object-contain object-left`}
      priority={variant === "header"}
    />
  );
}
