"use client";

import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

interface CheckoutStepperProps {
  activeStep?: number;
  steps: string[];
}

export function CheckoutStepper({
  activeStep,
  steps,
}: CheckoutStepperProps): JSX.Element {
  return (
    <Stepper activeStep={activeStep} alternativeLabel>
      {steps.map((label) => {
        return (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        );
      })}
    </Stepper>
  );
}
