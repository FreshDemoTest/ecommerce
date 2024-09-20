"use client";

import Link from "next/link";
import { redirect } from "next/navigation";
import { Box, Container, LoadingProgress, Stack, Typography } from "ui";
import { useClientInfo } from "../../../providers/hooks";
import { SignUpForm } from "./SignUpForm";

interface SignupFormProps {
  sellerName: string;
  loginLink: string;
  tycLink: string;
  privacyLink: string;
  commerceUrl: string;
}

export function CommerceSignUp({
  sellerName,
  loginLink,
  tycLink,
  privacyLink,
  commerceUrl,
}: SignupFormProps): JSX.Element {
  const { register, isAuthenticated, isInitialized } = useClientInfo();

  if (!isInitialized) {
    return <LoadingProgress sx={{ my: 6, backgroundColor: "inherit" }} />;
  }

  if (isAuthenticated) {
    redirect("/");
  }

  const handleRegister = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phoneNumber: string
  ): Promise<void> => {
    await register(
      email,
      password,
      firstName,
      lastName,
      commerceUrl,
      phoneNumber
    );
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 16 }}>
        <Stack direction="row" alignItems="center" sx={{ mt: 2, mb: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6">
              {`¡Empieza ahora ${sellerName}!`}
            </Typography>
            <Typography sx={{ color: "text.secondary", mt: 5 }}>
              {" "}
              Crea tu cuenta con tu correo electrónico.
            </Typography>
          </Box>
        </Stack>

        {/* Email password signup form */}
        <SignUpForm register={handleRegister} />

        <Typography sx={{ mt: 1 }} variant="body2">
          Al registrarte, tú y el negocio que representas están de acuerdo con
          la&nbsp;
          <Link href={privacyLink} style={{ cursor: "pointer" }}>
            Aviso de Privacidad
          </Link>
          &nbsp;y los&nbsp;
          <Link href={tycLink} style={{ cursor: "pointer" }}>
            Términos y Condiciones
          </Link>
          &nbsp;de {sellerName}.
        </Typography>

        <Box sx={{ mt: 2, display: "flex" }}>
          ¿Ya tienes cuenta? &nbsp;
          <Link href={loginLink} passHref>
            <Typography color="secondary.dark" variant="subtitle1">
              Inicia Sesión
            </Typography>
          </Link>
        </Box>
        {/* end email login */}
      </Box>
    </Container>
  );
}
