import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoLoaderProps {
  size?: number;
  className?: string;
}

export default function LogoLoader({ size = 40, className }: LogoLoaderProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center",
        className
      )}
    >
      <div className="relative animate-spin">
        <Image
          src="/images/icons/logo.png"
          alt="Loading..."
          width={size}
          height={size}
          className="opacity-80"
        />
        <div className="absolute inset-0 animate-pulse">
          <div className="h-full w-full rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      </div>
    </div>
  );
}
