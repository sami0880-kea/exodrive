import { Heading } from "@radix-ui/themes";

interface Step {
  title: string;
  description: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

const Stepper = ({ steps, currentStep, onStepClick }: StepperProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center flex-1 relative"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer ${
                index <= currentStep
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
              onClick={() => onStepClick(index)}
            >
              {index + 1}
            </div>
            <div className="mt-2 text-center">
              <Heading size="3" className="text-sm font-medium">
                {step.title}
              </Heading>
              <p className="text-xs text-gray-500">{step.description}</p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`absolute top-5 left-[calc(50%+20px)] w-[calc(100%-40px)] h-0.5 ${
                  index < currentStep ? "bg-red-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stepper;
