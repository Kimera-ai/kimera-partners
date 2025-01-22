import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#0D0517] border-t border-white/10">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Social Links */}
          <div className="space-y-4">
            <img 
              src="https://gerodpwicbuukllgkmzg.supabase.co/storage/v1/object/public/stuff/Partners%20logo.png"
              alt="Kimera Partners Logo"
              className="h-8 w-auto"
            />
            <div className="flex space-x-4">
              <a href="https://twitter.com/kimeraai" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="https://www.instagram.com/kimera.ai" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Instagram size={20} />
              </a>
              <a href="https://www.linkedin.com/company/kimera-ai" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Linkedin size={20} />
              </a>
              <a href="https://www.facebook.com/kimeraai" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-white">Pricing</Link>
              </li>
              <li>
                <Link to="/partner-program" className="text-gray-400 hover:text-white">Partner Program</Link>
              </li>
              <li>
                <Link to="/marketing-kit" className="text-gray-400 hover:text-white">Marketing Kit</Link>
              </li>
              <li>
                <Link to="/sales-kit" className="text-gray-400 hover:text-white">Sales Kit</Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://kimera.ai/blog" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a href="https://kimera.ai/docs" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  Documentation
                </a>
              </li>
              <li>
                <a href="https://kimera.ai/support" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://kimera.ai/about" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="https://kimera.ai/careers" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  Careers
                </a>
              </li>
              <li>
                <a href="https://kimera.ai/contact" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Kimera AI. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="https://kimera.ai/privacy" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm">
                Privacy Policy
              </a>
              <a href="https://kimera.ai/terms" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;