// src/components/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Instant scroll to top to ensure the new page starts from the header
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}