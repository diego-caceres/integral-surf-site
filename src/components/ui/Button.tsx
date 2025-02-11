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
  const baseStyles =
    "text-sm rounded-[60px] px-[50px] py-2 rounded-xl font-medium focus:outline-none transition-all";
  const variantStyles = clsx({
    "bg-[#ff3131] text-white hover:bg-red-600": variant === "primary",
    "bg-gray-200 text-gray-700 hover:bg-gray-300": variant === "secondary",
  });

  return (
    <button className={clsx(baseStyles, variantStyles, className)} {...props}>
      {children}
    </button>
  );
};

export default Button;
