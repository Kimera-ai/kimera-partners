import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import NumberFlow from "@number-flow/react";

interface Feature {
  name: string;
  credits: number;
  quantity: number;
}

const CREDIT_COST = 0.01; // 1 credit = $0.01

const baseFeatures = {
  baseEvent: { price: 79, label: "Base Event" },
  brandedEvent: { price: 130, label: "Branded Event" },
};

const imageFeatures: Feature[] = [
  { name: "Face Swap", credits: 5, quantity: 0 },
  { name: "Standard HD Image", credits: 7, quantity: 0 },
  { name: "HQ Image for Print", credits: 21, quantity: 0 },
  { name: "Background Removal", credits: 2, quantity: 0 },
  { name: "Clothing Control", credits: 16, quantity: 0 },
];

const videoFeatures: Feature[] = [
  { name: "AI Video Generation (5 seconds)", credits: 36, quantity: 0 },
  { name: "Video Template Generation (10 seconds)", credits: 36, quantity: 0 },
  { name: "Basic transition video", credits: 4, quantity: 0 },
];

const CUSTOM_PIPELINE_PRICE = 150;

export function PricingCalculator() {
  const [selectedBase, setSelectedBase] = useState<keyof typeof baseFeatures | null>(null);
  const [imageQuantities, setImageQuantities] = useState(imageFeatures);
  const [videoQuantities, setVideoQuantities] = useState(videoFeatures);
  const [customPipelineQuantity, setCustomPipelineQuantity] = useState(0);

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

  const calculateTotal = () => {
    const basePrice = selectedBase ? baseFeatures[selectedBase].price : 0;
    const imageCreditTotal =
      imageQuantities.reduce((acc, feature) => acc + feature.credits * feature.quantity, 0) *
      CREDIT_COST;
    const videoCreditTotal =
      videoQuantities.reduce((acc, feature) => acc + feature.credits * feature.quantity, 0) *
      CREDIT_COST;
    const customPipelineTotal = customPipelineQuantity * CUSTOM_PIPELINE_PRICE;
    return basePrice + imageCreditTotal + videoCreditTotal + customPipelineTotal;
  };

  return (
    <Card className="p-6 bg-background/50 backdrop-blur">
      <h3 className="text-xl font-semibold mb-4">Pricing Calculator</h3>

      <div className="space-y-4 mb-6">
        <h4 className="font-medium">Base Features</h4>
        {Object.entries(baseFeatures).map(([key, { label, price }]) => (
          <div key={key} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                checked={selectedBase === key}
                onCheckedChange={() =>
                  setSelectedBase(selectedBase === key ? null : (key as keyof typeof baseFeatures))
                }
              />
              <Label>{label}</Label>
            </div>
            <span className="text-sm font-medium">
              <NumberFlow
                format={{ style: "currency", currency: "USD" }}
                value={price}
              />
            </span>
          </div>
        ))}

        <div className="flex items-center justify-between mt-4">
          <div>
            <Label>Custom Pipeline</Label>
            <div className="text-sm text-muted-foreground">
              ${CUSTOM_PIPELINE_PRICE} per pipeline
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCustomPipelineQuantity(Math.max(0, customPipelineQuantity - 1))}
              className="w-8 h-8 flex items-center justify-center rounded-md border"
            >
              -
            </button>
            <span className="w-8 text-center">{customPipelineQuantity}</span>
            <button
              onClick={() => setCustomPipelineQuantity(customPipelineQuantity + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-md border"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="space-y-4 mb-6">
        <h4 className="font-medium">Image Features (Credits)</h4>
        {imageQuantities.map((feature, index) => (
          <div key={feature.name} className="flex items-center justify-between">
            <div>
              <Label>{feature.name}</Label>
              <div className="text-sm text-muted-foreground">
                {feature.credits} credits per use
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
        <h4 className="font-medium">Video Features (Credits)</h4>
        {videoQuantities.map((feature, index) => (
          <div key={feature.name} className="flex items-center justify-between">
            <div>
              <Label>{feature.name}</Label>
              <div className="text-sm text-muted-foreground">
                {feature.credits} credits per use
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

      <div className="flex justify-between items-center text-lg font-semibold">
        <span>Total Price:</span>
        <NumberFlow
          format={{ style: "currency", currency: "USD" }}
          value={calculateTotal()}
        />
      </div>
    </Card>
  );
}