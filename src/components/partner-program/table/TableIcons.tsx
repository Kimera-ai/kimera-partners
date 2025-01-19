import { Check } from "lucide-react";

export const CheckMark = () => (
  <div className="flex items-center justify-center">
    <Check className="h-4 w-4 text-green-500" />
  </div>
);

export const Dash = () => (
  <div className="flex items-center justify-center">
    <span className="text-gray-400">-</span>
  </div>
);