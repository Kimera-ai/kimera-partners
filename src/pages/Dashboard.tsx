import BaseLayout from "@/components/layouts/BaseLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowUpRight, Users, DollarSign, Star } from "lucide-react";
import { SectionHeader } from "@/components/ui/portal";

const stats = [
  {
    title: "Total Partners",
    value: "2,345",
    change: "+12.5%",
    icon: Users,
  },
  {
    title: "Revenue Generated",
    value: "$123.4k",
    change: "+8.2%",
    icon: DollarSign,
  },
  {
    title: "Partner Rating",
    value: "4.8/5",
    change: "+0.3",
    icon: Star,
  },
];

const Dashboard = () => {
  return (
    <BaseLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <SectionHeader
            title="Dashboard"
            description="Welcome back to your partner portal"
          />
          <Button>Download Report</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="p-6 bg-card hover:border-[#FF2B6E]/50 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <stat.icon className="w-5 h-5 text-primary" />
                <div className="flex items-center text-green-500">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-sm">{stat.change}</span>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-gray-400 text-sm">{stat.title}</h3>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6 bg-card">
          <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-white/10">
                <div>
                  <p className="text-white">New partner registration</p>
                  <p className="text-sm text-gray-400">2 hours ago</p>
                </div>
                <Button variant="ghost" className="text-primary">
                  View
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </BaseLayout>
  );
};

export default Dashboard;