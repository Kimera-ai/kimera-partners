import BaseLayout from "@/components/layouts/BaseLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

const ThankYou = () => {
  const navigate = useNavigate();

  return (
    <BaseLayout>
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center space-y-6 max-w-2xl mx-auto p-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Thank You for Your Request
          </h1>
          <p className="text-xl text-gray-400">
            We've received your pricing request and will get back to you shortly. Our team is reviewing your requirements and will contact you with more information.
          </p>
          <div className="pt-6">
            <Button 
              onClick={() => navigate("/partner-program")}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Home className="mr-2" />
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default ThankYou;