"use client";

import Link from "next/link";
import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import {
  BasicDialog,
  Box,
  Button,
  Container,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "ui";
import { useClientInfo } from "../../../providers/hooks";

interface ForgotPasswordProps {
  sellerName: string;
  resetPasswordLink: string;
}

export function CommerceForgotPassword({
  sellerName,
  resetPasswordLink,
}: ForgotPasswordProps): JSX.Element {
  const router = useRouter();
  const { sendResetPasswordCode, isAuthenticated } = useClientInfo();
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    redirect("/");
  }

  const handleSendResetPasswordCode = async (): Promise<void> => {
    try {
      await sendResetPasswordCode(email, resetPasswordLink);
      setOpen(true);
    } catch (e) {
      setError(
        "Ha ocurrido un error al enviar el correo de reseteo de contraseña. Por favor intenta de nuevo."
      );
    }
  };

  return (
    <Container maxWidth="sm">
      <BasicDialog
        title="Link para resetear tu contraseña ha sido enviado"
        msg="En caso que tu correo tenga una cuenta ha asociada, hemos enviado un correo con las instrucciones para resetear tu contraseña."
        open={open}
        closeMark={false}
        onClose={() => {
          setOpen(false);
        }}
        continueAction={{
          active: true,
          msg: "Continuar",
          actionFn: () => {
            setOpen(false);
            router.push("/login");
          },
        }}
      />
      <Snackbar
        open={error !== ""}
        autoHideDuration={4000}
        onClose={() => {
          setError("");
        }}
        message={error}
      />
      <Box sx={{ my: 16 }}>
        <Stack direction="row" alignItems="center" sx={{ mt: 2, mb: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6">¿Olvidaste tu contraseña?</Typography>
            <Typography sx={{ color: "text.primary", mt: 5 }}>
              {" "}
              {`Por favor ingresa el correo electrónico asociado a tu cuenta de ${sellerName} y te enviaremos un link para resetear tu contraseña.`}
            </Typography>
          </Box>
        </Stack>
        <Stack spacing={2}>
          {/* Forgot password form */}
          <TextField
            fullWidth
            type="email"
            label="Correo electrónico"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />

          <Button
            fullWidth
            size="large"
            variant="contained"
            onClick={() => {
              void handleSendResetPasswordCode();
            }}
          >
            Resetear contraseña
          </Button>

          <Link href="/login" passHref>
            <Button fullWidth size="large" variant="outlined">
              Regresar
            </Button>
          </Link>
        </Stack>
      </Box>
    </Container>
  );
}
