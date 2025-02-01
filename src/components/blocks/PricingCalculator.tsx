import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import NumberFlow from "@number-flow/react";
import PricingRequestForm from "../pricing/PricingRequestForm";

interface Feature {
  name: string;
  credits: number;
  quantity: number;
}

const CREDIT_COST = 0.01; // 1 credit = $0.01
const USAGE_RATE = 0.7; // 70% of guests are expected to use features

const baseFeatures = {
  baseEvent: { price: 79, label: "Base Event" },
  brandedEvent: { price: 130, label: "Branded Event" },
};

const imageFeatures: Feature[] = [
  { name: "Standard HD Image ($0.14/image)", credits: 14, quantity: 0 },
  { name: "HQ Image for Print ($0.28/image)", credits: 28, quantity: 0 },
  { name: "Clothing Control", credits: 16, quantity: 0 },
];

const videoFeatures: Feature[] = [
  { name: "AI Video Generation (5 seconds)", credits: 36, quantity: 0 },
  { name: "Video Template Generation (10 seconds)", credits: 36, quantity: 0 },
  { name: "Basic transition video", credits: 4, quantity: 0 },
];

const CUSTOM_WORKFLOW_PRICE = 150;

export function PricingCalculator() {
  const [selectedBase, setSelectedBase] = useState<keyof typeof baseFeatures | null>(null);
  const [imageQuantities, setImageQuantities] = useState(imageFeatures);
  const [videoQuantities, setVideoQuantities] = useState(videoFeatures);
  const [customWorkflowQuantity, setCustomWorkflowQuantity] = useState(0);
  const [guestCount, setGuestCount] = useState(100);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const updateQuantity = (
    features: Feature[],
    setFeatures: React.Dispatch<React.SetStateAction<Feature[]>>,
    index: number,
    increment: boolean
  ) => {
    setFeatures(
      features.map((feature, i) =>
        i === index
          ? { ...feature, quantity: Math.max(0, feature.quantity + (increment ? 1 : -1)) }
          : feature
      )
    );
  };

  const calculateExpectedUsage = (baseCount: number) => {
    return Math.round(baseCount * USAGE_RATE);
  };

  const calculateTotal = () => {
    const basePrice = selectedBase ? baseFeatures[selectedBase].price : 0;
    
    const expectedUsage = calculateExpectedUsage(guestCount);
    
    const imageCreditTotal =
      imageQuantities.reduce((acc, feature) => {
        return acc + (feature.credits * feature.quantity * expectedUsage);
      }, 0) * CREDIT_COST;

    const videoCreditTotal =
      videoQuantities.reduce((acc, feature) => {
        return acc + (feature.credits * feature.quantity * expectedUsage);
      }, 0) * CREDIT_COST;

    const customWorkflowTotal = customWorkflowQuantity * CUSTOM_WORKFLOW_PRICE;
    
    return basePrice + imageCreditTotal + videoCreditTotal + customWorkflowTotal;
  };

  const getSelectedFeatures = () => {
    return {
      basePackage: selectedBase ? baseFeatures[selectedBase].label : null,
      guestCount,
      imageFeatures: imageQuantities
        .filter(f => f.quantity > 0)
        .map(f => f.name),
      videoFeatures: videoQuantities
        .filter(f => f.quantity > 0)
        .map(f => f.name),
      customWorkflows: customWorkflowQuantity
    };
  };

  return (
    <Card id="pricing-calculator" className="p-4 sm:p-6 bg-background/50 backdrop-blur">
      <h3 className="text-lg sm:text-xl font-semibold mb-4 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
        Pricing Calculator
      </h3>

      <div className="space-y-6 mb-6">
        <div className="space-y-4">
          <Label htmlFor="guestCount" className="text-lg text-center block">
            Expected Number of Guests
          </Label>
          <div className="max-w-md mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 via-secondary to-primary/50 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-background/80 border border-primary/20 backdrop-blur-xl rounded-lg p-6 shadow-2xl">
                <Input
                  id="guestCount"
                  type="number"
                  min="1"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="text-2xl h-14 text-center bg-background/50 border-primary/30 focus:border-primary"
                />
                <div className="text-primary font-medium text-lg text-center mt-3">
                  {calculateExpectedUsage(guestCount)} expected runs
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative group p-6 bg-background/80 border border-primary/20 backdrop-blur-xl rounded-lg">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30 rounded-lg blur opacity-30 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative">
            <h4 className="font-medium text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">Base Features</h4>
            {Object.entries(baseFeatures).map(([key, { label, price }]) => (
              <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg hover:bg-white/5 transition-colors">
                <div className="flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-start gap-2">
                  <Label className="mb-2 sm:mb-0">{label}</Label>
                  <Switch
                    checked={selectedBase === key}
                    onCheckedChange={() =>
                      setSelectedBase(selectedBase === key ? null : (key as keyof typeof baseFeatures))
                    }
                  />
                </div>
                <span className="text-sm font-medium text-center sm:text-left">
                  <NumberFlow
                    format={{ style: "currency", currency: "USD" }}
                    value={price}
                  />
                </span>
              </div>
            ))}

            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
              <div className="text-center sm:text-left">
                <Label>Custom Workflow</Label>
                <div className="text-sm text-muted-foreground">
                  ${CUSTOM_WORKFLOW_PRICE} per workflow
                </div>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <button
                  onClick={() => setCustomWorkflowQuantity(Math.max(0, customWorkflowQuantity - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-md border border-primary/30 hover:bg-primary/10 transition-colors"
                >
                  -
                </button>
                <span className="w-8 text-center">{customWorkflowQuantity}</span>
                <button
                  onClick={() => setCustomWorkflowQuantity(customWorkflowQuantity + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-md border border-primary/30 hover:bg-primary/10 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-6 bg-primary/20" />

      <div className="relative group p-6 bg-background/80 border border-primary/20 backdrop-blur-xl rounded-lg mb-6">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30 rounded-lg blur opacity-30 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative">
          <h4 className="font-medium text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Image Features (Credits per use)
          </h4>
          {imageQuantities.map((feature, index) => (
            <div key={feature.name} className="flex flex-col sm:flex-row justify-between gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
              <div className="space-y-1 text-center sm:text-left">
                <Label>{feature.name}</Label>
                <div className="text-sm text-muted-foreground">
                  {feature.credits} credits × {feature.quantity > 0 ? feature.quantity * calculateExpectedUsage(guestCount) : 0} runs
                </div>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <button
                  onClick={() => updateQuantity(imageQuantities, setImageQuantities, index, false)}
                  className="w-8 h-8 flex items-center justify-center rounded-md border border-primary/30 hover:bg-primary/10 transition-colors"
                >
                  -
                </button>
                <span className="w-24 text-center">
                  {feature.quantity > 0 ? `${feature.quantity * calculateExpectedUsage(guestCount)} runs` : '0 runs'}
                </span>
                <button
                  onClick={() => updateQuantity(imageQuantities, setImageQuantities, index, true)}
                  className="w-8 h-8 flex items-center justify-center rounded-md border border-primary/30 hover:bg-primary/10 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative group p-6 bg-background/80 border border-primary/20 backdrop-blur-xl rounded-lg mb-6">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30 rounded-lg blur opacity-30 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative">
          <h4 className="font-medium text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Video Features (Credits per use)
          </h4>
          {videoQuantities.map((feature, index) => (
            <div key={feature.name} className="flex flex-col sm:flex-row justify-between gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
              <div className="space-y-1 text-center sm:text-left">
                <Label>{feature.name}</Label>
                <div className="text-sm text-muted-foreground">
                  {feature.credits} credits × {feature.quantity > 0 ? feature.quantity * calculateExpectedUsage(guestCount) : 0} runs
                </div>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <button
                  onClick={() => updateQuantity(videoQuantities, setVideoQuantities, index, false)}
                  className="w-8 h-8 flex items-center justify-center rounded-md border border-primary/30 hover:bg-primary/10 transition-colors"
                >
                  -
                </button>
                <span className="w-24 text-center">
                  {feature.quantity > 0 ? `${feature.quantity * calculateExpectedUsage(guestCount)} runs` : '0 runs'}
                </span>
                <button
                  onClick={() => updateQuantity(videoQuantities, setVideoQuantities, index, true)}
                  className="w-8 h-8 flex items-center justify-center rounded-md border border-primary/30 hover:bg-primary/10 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative group p-6 bg-background/80 border border-primary/20 backdrop-blur-xl rounded-lg">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30 rounded-lg blur opacity-30 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative">
          <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center sm:items-center gap-4 text-lg p-4 rounded-lg bg-background/50">
            <span className="text-xl font-semibold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Total Price:
            </span>
            <div className="text-white">
              <NumberFlow
                format={{ style: "currency", currency: "USD" }}
                value={calculateTotal()}
                className="text-3xl font-bold animate-fade-in"
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-center">
            <Button 
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
              size="lg"
              variant="default"
              onClick={() => setIsFormOpen(true)}
              disabled={!selectedBase}
            >
              <div className="w-full flex items-center justify-center">
                <span className="truncate text-center w-full">
                  {!selectedBase ? "Please select a base feature" : "Submit Request"}
                </span>
              </div>
            </Button>
          </div>
        </div>
      </div>

      <PricingRequestForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        totalPrice={calculateTotal()}
        selectedFeatures={getSelectedFeatures()}
      />
    </Card>
  );
}
