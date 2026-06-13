import { CarbonCalculatorForm } from '@/components/carbon-calculator/carbon-calculator-form';

export default function CalculatorPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Carbon Footprint Calculator</h1>
      <CarbonCalculatorForm />
    </div>
  );
}
