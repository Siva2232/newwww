export default function Card({
  children,
  className = "",
  hover = true,
  glass = false,
}) {
  return (
    <div
      className={`
        relative rounded-3xl p-6 md:p-8
        ${glass
          ? "bg-white/5 backdrop-blur-xl border border-white/10"
          : "bg-[#0B0B0B] border border-white/10"}
        ${hover
          ? "transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
          : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
