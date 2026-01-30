// src/components/SmoothScrollProvider.jsx
import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';

export default function SmoothScrollProvider({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,          // scroll time — higher = slower/smoother
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // nice ease
      smoothWheel: true,
      smoothTouch: false,     // mobile touch — keep native or set true
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Handle route changes → smooth scroll to top
    const handleRouteChange = () => {
      lenis.scrollTo(0, { duration: 1.5, easing: (t) => t }); // custom duration
    };

    window.addEventListener('popstate', handleRouteChange); // back/forward
    // Or use useLocation if you want to trigger on every nav

    return () => {
      lenis.destroy();
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return <>{children}</>;
}