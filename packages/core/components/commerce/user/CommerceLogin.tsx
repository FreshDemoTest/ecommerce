"use client";

import Link from "next/link";
import { redirect } from "next/navigation";
import { Box, Container, LoadingProgress, Stack, Typography } from "ui";
import { useCart, useClientInfo } from "../../../providers/hooks";
import { LoginForm } from "./LoginForm";

interface LoginFormProps {
  sellerName: string;
  registerLink: string;
  forgotPasswordLink: string;
}

export function CommerceLogin({
  sellerName,
  registerLink,
  forgotPasswordLink,
}: LoginFormProps): JSX.Element {
  const { apiURL, sellerId } = useClientInfo();
  const { login, isAuthenticated, isInitialized } = useClientInfo();
  const { refreshCart } = useCart();

  const loginWrapper = async (
    email: string,
    password: string
  ): Promise<void> => {
    try {
      await login(email, password);
      refreshCart(apiURL, sellerId || "");
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  };

  if (!isInitialized) {
    return <LoadingProgress sx={{ my: 6, backgroundColor: "inherit" }} />;
  }

  if (isAuthenticated) {
    redirect("/");
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 16 }}>
        <Stack direction="row" alignItems="center" sx={{ mt: 2, mb: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6">
              {`Entra a tu cuenta de ${sellerName}`}
            </Typography>
            <Typography sx={{ color: "text.primary", mt: 5 }}>
              {" "}
              Inicia sesión con tu correo electrónico.
            </Typography>
          </Box>
        </Stack>

        {/* Email password login form */}
        <LoginForm login={loginWrapper} />
        <Box sx={{ mt: 2, display: "flex" }}>
          ¿No tienes cuenta? &nbsp;
          <Link href={registerLink} passHref>
            <Typography color="secondary.dark" variant="subtitle1">
              Regístrate
            </Typography>
          </Link>
          <Stack
            direction="row"
            alignItems="right"
            justifyContent="right"
            sx={{ ml: 16 }}
          >
            <Link href={forgotPasswordLink}>
              <Typography variant="subtitle1" color="secondary.dark">
                ¿Olvidaste tu contraseña?
              </Typography>
            </Link>
          </Stack>
        </Box>
        {/* end email login */}
      </Box>
    </Container>
  );
}
