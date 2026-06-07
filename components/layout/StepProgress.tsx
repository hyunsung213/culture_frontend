interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepProgress({ currentStep, totalSteps }: StepProgressProps) {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className="px-5 py-3 w-full shrink-0">
      <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-in-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
