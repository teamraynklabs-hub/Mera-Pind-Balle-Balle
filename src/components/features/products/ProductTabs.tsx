"use client";

import { useState } from "react";

interface ProductTabsProps {
  story?: string;
  careInstructions?: string;
  socialImpact?: string;
  productName: string;
}

const defaultStory = (name: string) =>
  `Each ${name.toLowerCase()} is handcrafted by skilled rural women artisans who have inherited these traditional techniques from generations past. Every piece carries the unique touch of its maker, making it truly one-of-a-kind.\n\nThe creation process can take several days to weeks, depending on the complexity of the design. Our artisans work with natural, sustainable materials and employ eco-friendly methods that have minimal environmental impact.\n\nBy purchasing this product, you're directly supporting rural women entrepreneurs and helping preserve traditional crafts that are in danger of being lost to modernization.`;

const defaultCare =
  "Store in a cool, dry place away from direct sunlight. Avoid contact with water, perfumes, and chemicals. Clean gently with a soft dry cloth. Handle with care to preserve the handcrafted details.";

const defaultImpact =
  "Your purchase directly supports rural women artisans and their families. Each product helps preserve traditional craft techniques and provides sustainable income to rural communities. Together, we're building a more equitable future.";

export default function ProductTabs({
  story,
  careInstructions,
  socialImpact,
  productName,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<"story" | "care" | "impact">("story");

  const tabs = [
    { id: "story" as const, label: "The Story" },
    { id: "care" as const, label: "Care Instructions" },
    { id: "impact" as const, label: "Social Impact" },
  ];

  const content = {
    story: {
      title: "Crafted with Love & Heritage",
      text: story || defaultStory(productName),
    },
    care: {
      title: "How to Care for Your Product",
      text: careInstructions || defaultCare,
    },
    impact: {
      title: "Making a Difference",
      text: socialImpact || defaultImpact,
    },
  };

  const current = content[activeTab];

  return (
    <section className="mt-16">
      {/* Tab Headers */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-4 text-center text-sm sm:text-base font-medium transition-all duration-200 cursor-pointer relative ${
              activeTab === tab.id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-card border border-t-0 rounded-b-2xl p-6 sm:p-8">
        <h3 className="text-xl sm:text-2xl font-bold mb-4 font-serif">
          {current.title}
        </h3>
        {current.text.split("\n\n").map((paragraph, index) => (
          <p
            key={index}
            className="text-muted-foreground leading-relaxed mb-4 last:mb-0"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
