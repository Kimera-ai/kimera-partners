import { Card } from "@/components/ui/card";

export const SkeletonCard = () => (
  <Card className="animate-pulse">
    <div className="aspect-video bg-white/10" />
    <div className="p-6">
      <div className="h-4 bg-white/10 rounded w-1/4 mb-4" />
      <div className="h-6 bg-white/10 rounded w-3/4 mb-3" />
      <div className="h-4 bg-white/10 rounded w-2/3" />
    </div>
  </Card>
);

export const ErrorState = ({ message }: { message: string }) => (
  <div className="text-center py-12">
    <h3 className="text-xl text-white mb-2">Unable to Load Resources</h3>
    <p className="text-gray-300 mb-4">{message}</p>
    <button className="px-4 py-2 bg-[#FF2B6E] text-white rounded-lg hover:bg-[#FF068B] transition-colors">
      Try Again
    </button>
  </div>
);