import AnalysisDisplay from './analysis-display';
import { analyze } from './actions';

export default function TrendsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Business Trend Analyzer</h2>
        <p className="text-muted-foreground mt-2">
          Use generative AI to analyze your booking data. Identify popular services, revenue trends, and get pricing suggestions to optimize your offerings.
        </p>
      </div>
      <AnalysisDisplay analyzeAction={analyze} />
    </div>
  );
}
