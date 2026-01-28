export default function Badge({
  children,
  variant = "primary",
  className = "",
}) {
  const variants = {
    primary: "bg-primary/15 text-primary",
    dark: "bg-black text-white border border-white/10",
    outline: "border border-primary text-primary",
  };

  return (
    <span
      className={`
        inline-flex items-center px-3 py-1 rounded-full
        text-xs font-semibold tracking-wide uppercase
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
