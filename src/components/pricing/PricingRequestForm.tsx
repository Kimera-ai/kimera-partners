import React, { useState, useEffect } from 'react';
import { 
  Send,
  X,
  Loader
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface PricingRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  totalPrice: number;
  selectedFeatures: {
    basePackage: string | null;
    guestCount: number;
    imageFeatures: string[];
    videoFeatures: string[];
    customPipelines: number;
  };
}

const PricingRequestForm = ({ isOpen, onClose, totalPrice, selectedFeatures }: PricingRequestFormProps) => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    eventDate: '',
    additionalNotes: ''
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setFormData(prev => ({
          ...prev,
          email: session.user.email
        }));
      }
    };

    if (isOpen) {
      getSession();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Implement form submission logic here
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Pricing Request</h2>
          <button 
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Company Name"
              name="companyName"
              value={formData.companyName}
              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
              required
            />
            
            <FormField
              label="Contact Name"
              name="contactName"
              value={formData.contactName}
              onChange={(e) => setFormData({...formData, contactName: e.target.value})}
              required
            />
            
            <FormField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              disabled
            />
            
            <FormField
              label="Phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
            />
            
            <FormField
              label="Event Date"
              name="eventDate"
              type="date"
              value={formData.eventDate}
              onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
              required
            />
          </div>

          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <h3 className="font-medium">Selected Package Details</h3>
            <p>Base Package: {selectedFeatures.basePackage || 'None selected'}</p>
            <p>Guest Count: {selectedFeatures.guestCount}</p>
            <p>Custom Pipelines: {selectedFeatures.customPipelines}</p>
            <p className="font-semibold">Total Price: ${totalPrice.toFixed(2)}</p>
          </div>
          
          <div>
            <label className="block text-foreground mb-2">
              Additional Notes
            </label>
            <textarea
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={(e) => setFormData({...formData, additionalNotes: e.target.value})}
              className="w-full bg-background border border-input rounded-lg px-4 py-2 
                placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent
                transition-all h-32 resize-none"
              placeholder="Any specific requirements or questions..."
            />
          </div>
          
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-input text-foreground rounded-lg 
                hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg 
                transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send size={20} />
                  <span>Submit Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
}

const FormField = ({ label, name, type = 'text', value, onChange, required, disabled }: FormFieldProps) => (
  <div>
    <label htmlFor={name} className="block text-foreground mb-2">
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className="w-full bg-background border border-input rounded-lg px-4 py-2 
        placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent
        transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    />
  </div>
);

export default PricingRequestForm;