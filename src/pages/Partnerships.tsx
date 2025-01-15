import { useState } from 'react';
import BaseLayout from '@/components/layouts/BaseLayout';
import Hero from "@/components/partner-program/Hero";
import BenefitsGrid from "@/components/partner-program/BenefitsGrid";
import CTASection from "@/components/partner-program/CTASection";
import ApplicationForm from '@/components/partnerships/ApplicationForm';

const PartnershipsPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <BaseLayout>
      <div className="min-h-screen bg-background pt-24 pb-16">
        <Hero />
        <BenefitsGrid />
        <CTASection setIsFormOpen={setIsFormOpen} />
        <ApplicationForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
      </div>
    </BaseLayout>
  );
};

export default PartnershipsPage;