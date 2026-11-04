import Image from "next/image";
import { siteConfig } from "@/lib/content/site";

type BrandLogoProps = {
  /** `lockup` warna; `mark` icon; `onDark` lockup putih */
  variant?: "lockup" | "mark" | "onDark";
  className?: string;
  priority?: boolean;
  height?: number;
};

export default function BrandLogo({
  variant = "lockup",
  className = "",
  priority = false,
  height = 40,
}: BrandLogoProps) {
  const src =
    variant === "mark"
      ? siteConfig.logoMark
      : variant === "onDark"
        ? siteConfig.logoOnDark
        : siteConfig.logo;
  const width =
    variant === "mark"
      ? Math.round(height * 1.18)
      : Math.round(height * 3.36);

  return (
    <Image
      src={src}
      alt={siteConfig.name}
      width={width}
      height={height}
      priority={priority}
      className={`w-auto object-contain ${className}`.trim()}
      style={{ height, width: "auto" }}
    />
  );
}
