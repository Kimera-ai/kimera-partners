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
      <h3 className="text-lg sm:text-xl font-semibold mb-4">Pricing Calculator</h3>

      <div className="space-y-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="guestCount">Expected Number of Guests</Label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Input
              id="guestCount"
              type="number"
              min="1"
              value={guestCount}
              onChange={(e) => setGuestCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full sm:w-32"
            />
            <span className="text-sm text-muted-foreground">
              ({calculateExpectedUsage(guestCount)} expected runs)
            </span>
          </div>
        </div>

        <h4 className="font-medium pt-4">Base Features</h4>
        {Object.entries(baseFeatures).map(([key, { label, price }]) => (
          <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Switch
                checked={selectedBase === key}
                onCheckedChange={() =>
                  setSelectedBase(selectedBase === key ? null : (key as keyof typeof baseFeatures))
                }
              />
              <Label>{label}</Label>
            </div>
            <span className="text-sm font-medium ml-8 sm:ml-0">
              <NumberFlow
                format={{ style: "currency", currency: "USD" }}
                value={price}
              />
            </span>
          </div>
        ))}

        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
          <div>
            <Label>Custom Workflow</Label>
            <div className="text-sm text-muted-foreground">
              ${CUSTOM_WORKFLOW_PRICE} per workflow
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCustomWorkflowQuantity(Math.max(0, customWorkflowQuantity - 1))}
              className="w-8 h-8 flex items-center justify-center rounded-md border"
            >
              -
            </button>
            <span className="w-8 text-center">{customWorkflowQuantity}</span>
            <button
              onClick={() => setCustomWorkflowQuantity(customWorkflowQuantity + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-md border"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="space-y-4 mb-6">
        <h4 className="font-medium">Image Features (Credits per use)</h4>
        {imageQuantities.map((feature, index) => (
          <div key={feature.name} className="flex flex-col sm:flex-row justify-between gap-3">
            <div className="space-y-1">
              <Label>{feature.name}</Label>
              <div className="text-sm text-muted-foreground">
                {feature.credits} credits × {feature.quantity > 0 ? feature.quantity * calculateExpectedUsage(guestCount) : 0} runs
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(imageQuantities, setImageQuantities, index, false)}
                className="w-8 h-8 flex items-center justify-center rounded-md border"
              >
                -
              </button>
              <span className="w-8 text-center">{feature.quantity}</span>
              <button
                onClick={() => updateQuantity(imageQuantities, setImageQuantities, index, true)}
                className="w-8 h-8 flex items-center justify-center rounded-md border"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-6" />

      <div className="space-y-4 mb-6">
        <h4 className="font-medium">Video Features (Credits per use)</h4>
        {videoQuantities.map((feature, index) => (
          <div key={feature.name} className="flex flex-col sm:flex-row justify-between gap-3">
            <div className="space-y-1">
              <Label>{feature.name}</Label>
              <div className="text-sm text-muted-foreground">
                {feature.credits} credits × {feature.quantity > 0 ? feature.quantity * calculateExpectedUsage(guestCount) : 0} runs
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(videoQuantities, setVideoQuantities, index, false)}
                className="w-8 h-8 flex items-center justify-center rounded-md border"
              >
                -
              </button>
              <span className="w-8 text-center">{feature.quantity}</span>
              <button
                onClick={() => updateQuantity(videoQuantities, setVideoQuantities, index, true)}
                className="w-8 h-8 flex items-center justify-center rounded-md border"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-6" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-lg font-semibold">
        <span>Total Price:</span>
        <NumberFlow
          format={{ style: "currency", currency: "USD" }}
          value={calculateTotal()}
        />
      </div>
      
      <div className="mt-6">
        <Button 
          className="w-full bg-primary hover:bg-primary/90"
          size="lg"
          variant="default"
          onClick={() => setIsFormOpen(true)}
          disabled={!selectedBase}
        >
          {!selectedBase ? "Please select a base feature" : "Submit Request"}
        </Button>
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