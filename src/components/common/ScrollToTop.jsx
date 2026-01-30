// src/components/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Smooth scroll to top — feels natural and premium
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'     // ← this is the magic: gentle easing
    });
  }, [pathname, search]);

  return null;
}