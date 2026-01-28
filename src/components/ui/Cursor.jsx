import { useEffect, useRef, useState } from "react";
import { MousePointer2 } from "lucide-react";

export default function Cursor() {
  const cursorRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    window.addEventListener("mousemove", moveCursor);

    const handleEnter = () => setIsHovered(true);
    const handleLeave = () => setIsHovered(false);

    const interactiveElements = document.querySelectorAll(
      "a, button, [role='button'], input, textarea, label, select, [tabindex]:not([tabindex='-1'])"
    );

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleEnter);
      el.addEventListener("mouseleave", handleLeave);
    });

    document.documentElement.style.cursor = "none";

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleEnter);
        el.removeEventListener("mouseleave", handleLeave);
      });
      document.documentElement.style.cursor = "auto";
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 z-[9999] pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out hidden md:block"
    >
      <div
        className={`relative flex items-center justify-center transition-all duration-500 ease-out
        ${isHovered ? "w-20 h-20" : "w-10 h-10"}`}
      >
        {/* Outer ring with your brand color */}
        <div className="absolute inset-0 rounded-full border-2 border-[#f7ef22] mix-blend-difference" />

        {/* Center pointer icon (visible only on hover) */}
        <div
          className={`flex items-center justify-center transition-all duration-300 ease-out
          ${isHovered ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
        >
          <MousePointer2
            size={20}
            className="text-[#f7ef22] mix-blend-difference"
          />
        </div>

        {/* Inner dot (visible when not hovered) */}
        {!isHovered && (
          <div className="w-3 h-3 bg-[#f7ef22] rounded-full shadow-lg" />
        )}
      </div>
    </div>
  );
}