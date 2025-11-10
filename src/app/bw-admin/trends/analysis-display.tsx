"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader, Lightbulb, LineChart } from "lucide-react";
import { AnalyzeBusinessTrendsOutput } from "@/ai/flows/analyze-business-trends";

type AnalysisDisplayProps = {
  analyzeAction: () => Promise<AnalyzeBusinessTrendsOutput>;
};

export default function AnalysisDisplay({ analyzeAction }: AnalysisDisplayProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeBusinessTrendsOutput | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    const analysisResult = await analyzeAction();
    setResult(analysisResult);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleAnalyze} disabled={loading}>
            {loading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Business Trends"
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <LineChart className="h-6 w-6" />
              </div>
              <CardTitle>Trends Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{result.summary}</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <Lightbulb className="h-6 w-6" />
              </div>
              <CardTitle>Pricing Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{result.pricingSuggestions}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
