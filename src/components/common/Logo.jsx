import { Link } from "react-router-dom";

export default function Logo({ className = "" }) {
  return (
    <Link
      to="/"
      className={`flex items-center gap-2 font-extrabold text-xl tracking-wide ${className}`}
    >
      <span className="text-primary">STUDIO</span>
      <span className="text-white">PRESS</span>
    </Link>
  );
}
