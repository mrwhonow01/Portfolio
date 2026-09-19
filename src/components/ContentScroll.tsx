import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface ContentScrollProps {
  onScrollUp: () => void;
  onScrollDown: () => void;
  canScrollUp?: boolean;
  canScrollDown?: boolean;
}

export const ContentScroll: React.FC<ContentScrollProps> = ({
  onScrollUp,
  onScrollDown,
}) => {
  return (
    <aside
      id="content_scroll"
      className="hidden md:flex flex-col fixed top-[50px] right-[30px] z-30"
      aria-label="Content navigation"
    >
      <button
        type="button"
        onClick={onScrollUp}
        className="w-[27px] h-[27px] flex items-center justify-center text-black bg-white border border-[#dddddd] mb-1.5 transition-colors duration-150 hover:bg-black hover:text-white hover:border-black cursor-pointer shadow-sm"
        title="Scroll up / previous"
        aria-label="Previous artwork"
      >
        <ChevronUp className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={onScrollDown}
        className="w-[27px] h-[27px] flex items-center justify-center text-black bg-white border border-[#dddddd] transition-colors duration-150 hover:bg-black hover:text-white hover:border-black cursor-pointer shadow-sm"
        title="Scroll down / next"
        aria-label="Next artwork"
      >
        <ChevronDown className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
};
