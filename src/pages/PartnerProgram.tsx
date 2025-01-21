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
      <div className="relative min-h-screen bg-background pb-16">
        <div className="absolute inset-0 pointer-events-none">
          <DotPattern 
            className="[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]"
            cy={1}
            cr={1}
            cx={1}
          />
        </div>
        <div className="relative z-10">
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