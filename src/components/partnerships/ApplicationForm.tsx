import React, { useState } from 'react';
import { 
  Send,
  X,
  Loader
} from 'lucide-react';

const ApplicationForm = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    location: '',
    experience: '',
    events: '',
    motivation: ''
  });
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Implement form submission logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#100919] border border-white/10 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#100919] border-b border-white/10 p-4 flex items-center justify-between">
          <h2 className="text-xl text-white">Partnership Application</h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
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
              label="Website"
              name="website"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({...formData, website: e.target.value})}
            />
            
            <FormField
              label="Location"
              name="location"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              required
            />
          </div>
          
          <FormField
            label="Years of Experience"
            name="experience"
            value={formData.experience}
            onChange={(e) => setFormData({...formData, experience: e.target.value})}
            required
          />
          
          <FormField
            label="Average Monthly Events"
            name="events"
            value={formData.events}
            onChange={(e) => setFormData({...formData, events: e.target.value})}
            required
          />
          
          <div>
            <label className="block text-white mb-2">
              Why do you want to partner with Kimera AI?
            </label>
            <textarea
              name="motivation"
              value={formData.motivation}
              onChange={(e) => setFormData({...formData, motivation: e.target.value})}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white 
                placeholder:text-gray-500 focus:ring-2 focus:ring-[#FF2B6E] focus:border-transparent
                transition-all h-32 resize-none"
              placeholder="Tell us about your motivation and vision..."
            />
          </div>
          
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-white/20 text-white rounded-lg 
                hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#FF2B6E] hover:bg-[#FF068B] text-white rounded-lg 
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
                  <span>Submit Application</span>
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
}

const FormField = ({ label, name, type = 'text', value, onChange, required }: FormFieldProps) => (
  <div>
    <label htmlFor={name} className="block text-white mb-2">
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white 
        placeholder:text-gray-500 focus:ring-2 focus:ring-[#FF2B6E] focus:border-transparent
        transition-all"
    />
  </div>
);

export default ApplicationForm;