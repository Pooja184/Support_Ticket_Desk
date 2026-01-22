import { FiMenu } from "react-icons/fi";

const MobileHeader = ({ onMenuClick }) => {
  return (
    <div className="md:hidden sticky top-0 z-50 bg-white border-b px-4 py-3 flex items-center gap-3">
      <button onClick={onMenuClick}>
        <FiMenu size={22} />
      </button>
      <h1 className="font-semibold text-lg">Support Desk</h1>
    </div>
  );
};

export default MobileHeader;
