"use client";

import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import {
  BasicDialog,
  Box,
  Button,
  Container,
  PasswordTextField,
  Snackbar,
  Stack,
  Typography,
} from "ui";
import { useClientInfo } from "../../../providers/hooks";

interface ResetPasswordProps {
  sellerName: string;
  resetToken?: string;
}

export function CommerceResetPassword({
  sellerName,
  resetToken,
}: ResetPasswordProps): JSX.Element {
  const router = useRouter();
  const { resetPasswordWithCode, isAuthenticated } = useClientInfo();
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    redirect("/");
  }

  const handleResetPassword = async (): Promise<void> => {
    try {
      if (!resetToken) {
        setError(
          "El token de reseteo de contraseña no es válido. Por favor intenta de nuevo."
        );
        return;
      }
      await resetPasswordWithCode(password, resetToken);
      setOpen(true);
    } catch (e) {
      setError(
        "Ha ocurrido un error al enviar reestablecer tu contraseña. Por favor intenta de nuevo."
      );
    }
  };

  return (
    <Container maxWidth="sm">
      <BasicDialog
        title="Contraseña reseteada"
        msg="Tu contraseña ha sido reestablecida con éxito."
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
            <Typography variant="h6">Reestablece tu contraseña</Typography>
            <Typography sx={{ color: "text.primary", mt: 5 }}>
              {" "}
              {`Por favor ingresa tu nueva contraseña de tu cuenta de ${sellerName}.`}
            </Typography>
          </Box>
        </Stack>
        <Stack spacing={2}>
          {/* reset password form */}
          <PasswordTextField
            fullWidth
            label="Nueva contraseña"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <PasswordTextField
            fullWidth
            label="Confirma tu nueva contraseña"
            onChange={(e) => {
              setPasswordCheck(e.target.value);
            }}
            helperText={
              passwordCheck !== password ? "Las contraseñas no coinciden" : null
            }
          />

          <Button
            fullWidth
            size="large"
            variant="contained"
            disabled={passwordCheck !== password}
            onClick={() => {
              void handleResetPassword();
            }}
          >
            Actualizar contraseña
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
