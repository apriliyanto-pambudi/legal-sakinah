import { User } from "lucide-react";

type Props = {
  /** Label singkat di bawah ikon */
  label?: string;
  className?: string;
  /** Isi penuh parent `relative` (hero / mid CTA) */
  fill?: boolean;
};

/** Placeholder foto advokat — ganti file asli nanti tanpa ubah layout. */
export default function PortraitDummy({
  label = "Foto dummy",
  className = "",
  fill = false,
}: Props) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-b from-primary/15 to-muted text-text-muted ${
        fill ? "absolute inset-0" : ""
      } ${className}`.trim()}
      role="img"
      aria-label={label}
    >
      <User className="w-14 h-14 sm:w-16 sm:h-16 opacity-35" aria-hidden="true" />
      <span className="text-xs opacity-70">{label}</span>
    </div>
  );
}
