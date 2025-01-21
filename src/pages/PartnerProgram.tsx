import BaseLayout from '@/components/layouts/BaseLayout';
import Hero from "@/components/partner-program/Hero";
import BenefitsGrid from "@/components/partner-program/BenefitsGrid";
import BenefitsTierTable from "@/components/partner-program/BenefitsTierTable";
import ApplicationForm from '@/components/partnerships/ApplicationForm';
import { DotPattern } from '@/components/ui/dot-pattern';
import { useState } from 'react';

const PartnershipsPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <BaseLayout>
      <div className="relative min-h-screen bg-background">
        <div className="absolute inset-0 pointer-events-none">
          <DotPattern 
            width={24}
            height={24}
            className="[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]"
            cy={1}
            cr={1}
            cx={1}
          />
        </div>
        <div className="relative">
          <Hero />
          <BenefitsGrid />
          <BenefitsTierTable />
          <ApplicationForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
        </div>
      </div>
    </BaseLayout>
  );
};

export default PartnershipsPage;