"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COUNTRIES = [
  "China",
  "United States",
  "Germany",
  "Japan",
  "South Korea",
  "Taiwan",
  "Vietnam",
  "Thailand",
  "Malaysia",
  "Indonesia",
  "Singapore",
  "Australia",
  "United Kingdom",
  "United Arab Emirates",
  "Saudi Arabia",
  "Bangladesh",
  "Sri Lanka",
  "Nepal",
  "New Zealand",
  "Italy",
  "France",
  "Netherlands",
  "Turkey",
  "Brazil",
  "Canada",
  "Mexico",
  "South Africa",
  "Nigeria",
  "Russia",
  "Switzerland",
];

interface ProductInputFormProps {
  onSubmit: (data: {
    productDescription: string;
    originCountry: string;
    assessableValueUSD: number;
  }) => void;
  isLoading: boolean;
  defaultProduct?: string;
}

export function ProductInputForm({
  onSubmit,
  isLoading,
  defaultProduct = "",
}: ProductInputFormProps) {
  const [productDescription, setProductDescription] = useState(defaultProduct);
  const [originCountry, setOriginCountry] = useState("");
  const [assessableValueUSD, setAssessableValueUSD] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productDescription || !originCountry || !assessableValueUSD) return;
    onSubmit({
      productDescription,
      originCountry,
      assessableValueUSD: parseFloat(assessableValueUSD),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Product Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product">Product Description</Label>
            <Textarea
              id="product"
              placeholder="e.g., Lithium-ion batteries for electric vehicles, 48V 100Ah"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              rows={3}
              required
            />
            <p className="text-xs text-gray-500">
              Be specific: include material, form, use, and specifications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country of Origin</Label>
              <Select value={originCountry} onValueChange={setOriginCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Assessable Value (USD)</Label>
              <Input
                id="value"
                type="number"
                min="1"
                step="0.01"
                placeholder="e.g., 10000"
                value={assessableValueUSD}
                onChange={(e) => setAssessableValueUSD(e.target.value)}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[var(--navy)] hover:bg-[var(--deep-blue)]"
            disabled={
              isLoading ||
              !productDescription ||
              !originCountry ||
              !assessableValueUSD
            }
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Analyzing...
              </span>
            ) : (
              "Generate Compliance Report"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
