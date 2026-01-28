export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50";

  const variants = {
    primary:
      "bg-primary text-black hover:bg-yellow-400 shadow-lg shadow-primary/30",
    secondary:
      "bg-white text-black hover:bg-gray-100",
    outline:
      "border border-primary text-primary hover:bg-primary hover:text-black",
    dark:
      "bg-black text-primary border border-primary hover:bg-primary hover:text-black"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm md:text-base",
    lg: "px-8 py-4 text-base md:text-lg"
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
