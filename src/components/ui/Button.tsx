import { ButtonHTMLAttributes, FC } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  className?: string;
}

const Button: FC<ButtonProps> = ({
  children,
  variant = "primary",
  className,
  ...props
}) => {
  const hasCustomBg = className?.split(" ").some((c) => c.startsWith("bg-"));

  const baseStyles =
    "text-sm px-[50px] py-2 rounded-3xl font-medium focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all";
  const variantStyles = clsx({
    "bg-redColor text-white hover:bg-redColor/85":
      variant === "primary" && !hasCustomBg,
    "text-white": variant === "primary" && hasCustomBg,
    "bg-gray-200 text-gray-700 hover:bg-gray-300":
      variant === "secondary" && !hasCustomBg,
  });

  return (
    <button className={clsx(baseStyles, variantStyles, className)} {...props}>
      {children}
    </button>
  );
};

export default Button;
