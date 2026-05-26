import { FiMenu } from "react-icons/fi";

const MobileHeader = ({ onMenuClick }) => {
  return (
    <div className="md:hidden sticky top-0 z-30 bg-white/95 border-b border-slate-200 px-4 py-3 flex items-center gap-3 backdrop-blur">
      <button
        onClick={onMenuClick}
        className="rounded-lg border border-slate-200 p-2 text-slate-700"
        aria-label="Open menu"
      >
        <FiMenu size={20} aria-hidden="true" />
      </button>
      <h1 className="font-semibold text-lg text-slate-950">Support Desk</h1>
    </div>
  );
};

export default MobileHeader;
