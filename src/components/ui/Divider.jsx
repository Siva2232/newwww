export default function Divider({ className = "" }) {
  return (
    <div
      className={`w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent ${className}`}
    />
  );
}
