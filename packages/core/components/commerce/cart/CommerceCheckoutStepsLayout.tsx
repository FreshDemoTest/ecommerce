"use client";

import { redirect } from "next/navigation";
import { CheckoutStepper, Grid } from "ui";
import { CHECKOUT_STEPS } from "../../../domain";
import { useCart, useClientInfo } from "../../../providers/hooks";

interface CommerceCheckoutStepsLayoutProps {
  loginLink: string;
  children: React.ReactNode;
}

export function CommerceCheckoutStepsLayout({
  loginLink,
  children,
}: CommerceCheckoutStepsLayoutProps): JSX.Element {
  const { currentCheckoutStep } = useCart();
  const steps = CHECKOUT_STEPS.map((s) => s.label);
  const { isAuthenticated, isInitialized } = useClientInfo();

  // set up guard to register if it hasn't
  if (isInitialized && !isAuthenticated) {
    redirect(loginLink);
  }

  return (
    <>
      <Grid container>
        <Grid item xs={0} md={1} />
        {/* Steps */}
        <Grid item xs={12} md={7} sx={{ my: 3, px: { xs: 1, md: 2 } }}>
          <CheckoutStepper steps={steps} activeStep={currentCheckoutStep} />
        </Grid>
      </Grid>
      {children}
    </>
  );
}
