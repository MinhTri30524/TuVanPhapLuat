import React, { useEffect, useState } from "react";
import { ArrowUpIcon } from "@heroicons/react/24/solid";
export default function CpScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    visible && (
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-[#1D3557] hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all"
        aria-label="Lên đầu trang"
      >
        <ArrowUpIcon className="w-5 h-5" />
      </button>
    )
  );
}
