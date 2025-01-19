import BaseLayout from '@/components/layouts/BaseLayout';
import Hero from "@/components/partner-program/Hero";
import BenefitsGrid from "@/components/partner-program/BenefitsGrid";
import ApplicationForm from '@/components/partnerships/ApplicationForm';
import { useState } from 'react';

const PartnershipsPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <BaseLayout>
      <div className="min-h-screen bg-background pt-24 pb-16">
        <Hero />
        <BenefitsGrid />
        <ApplicationForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
      </div>
    </BaseLayout>
  );
};

export default PartnershipsPage;