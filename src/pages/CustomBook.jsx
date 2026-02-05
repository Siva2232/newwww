// src/pages/CustomBookPage.jsx    (or src/App.jsx)

import CustomBook from "../components/common/CustomBook";

export default function CustomBookPage() {
  return <CustomBook />;
}

// If you're using this as your main App:
export function App() {
  return (
    <div className="min-h-screen">
      <CustomBook />
    </div>
  );
}