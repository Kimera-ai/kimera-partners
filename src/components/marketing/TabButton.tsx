import { LucideIcon } from "lucide-react";

interface TabButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  icon: LucideIcon;
}

export const TabButton = ({ children, active, onClick, icon: Icon }: TabButtonProps) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
      active 
        ? 'border-primary text-white' 
        : 'border-transparent text-gray-400 hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span>{children}</span>
  </button>
);