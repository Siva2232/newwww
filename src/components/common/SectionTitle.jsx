export default function SectionTitle({
  label,
  title,
  description,
  center = false,
}) {
  return (
    <div className={`${center ? "text-center" : ""} max-w-3xl mb-12`}>
      {label && (
        <span className="inline-block mb-3 px-4 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-widest uppercase">
          {label}
        </span>
      )}

      <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
        {title}
      </h2>

      {description && (
        <p className="mt-4 text-gray-400 text-base md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
