"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ClassificationResult } from "@/types/hs-code";

interface HSCodeSelectorProps {
  classification: ClassificationResult;
  onSelect: (hsCode: string) => void;
}

export function HSCodeSelector({
  classification,
  onSelect,
}: HSCodeSelectorProps) {
  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader>
        <CardTitle className="text-lg text-amber-800">
          HS Code Classification — Low Confidence
        </CardTitle>
        <p className="text-sm text-amber-700">
          We couldn&apos;t confidently determine the HS code. Please select the
          best match:
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {classification.candidates.map((candidate) => (
            <button
              key={candidate.code}
              onClick={() => onSelect(candidate.code)}
              className="w-full text-left p-3 rounded-lg border border-amber-200 hover:border-[var(--gold)] hover:bg-[var(--gold)]/5 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono font-semibold text-[var(--navy)]">
                    {candidate.code}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">
                    {candidate.description}
                  </p>
                </div>
                <span className="text-xs text-gray-400 ml-4 shrink-0">
                  {Math.round(candidate.similarity * 100)}% match
                </span>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
