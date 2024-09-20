"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Alert,
  BasicDialog,
  Box,
  BranchCard,
  Button,
  Container,
  Divider,
  LoadingProgress,
  Snackbar,
  Stack,
  Typography,
} from "ui";
import { useClientInfo } from "../../../providers/hooks";
import { type BranchStateType } from "../../../domain/user";
import { SignUpForm } from "./SignUpForm";
import { BranchForm } from "./BranchForm";

interface ProfileProps {
  loginLink: string;
  sellerName: string;
}

export function CommerceProfile({
  loginLink,
  sellerName,
}: ProfileProps): JSX.Element {
  const {
    isAuthenticated,
    isInitialized,
    user,
    addresses,
    defaultAddress,
    setDefaultAddress,
    addAddress,
    editAddress,
    error: addressError,
  } = useClientInfo();
  const [openError, setOpenError] = useState(false);
  const [openBranchModal, setOpenBranchModal] = useState(false);
  const [editBranchState, setEditBranchState] =
    useState<BranchStateType | null>(null);
  const [openEditBranchModal, setOpenEditBranchModal] = useState(false);

  useEffect(() => {
    if (addressError) {
      setOpenError(true);
    }
  }, [addressError]);

  if (!isInitialized) {
    return <LoadingProgress sx={{ my: 6, backgroundColor: "inherit" }} />;
  }

  if (!isAuthenticated) {
    redirect(loginLink);
  }

  const handleUpdateProfile = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phoneNumber: string
    // eslint-disable-next-line @typescript-eslint/require-await
  ): Promise<void> => {
    // [TODO] implement profile update later
    email + firstName + lastName + phoneNumber;
  };

  return (
    <Container maxWidth="sm">
      {/* errorsnackbar */}
      <Snackbar
        open={openError}
        autoHideDuration={3000}
        onClose={(_e) => {
          setOpenError(false);
        }}
      >
        <Alert severity="error">
          ¡Hubo un error, creando tu Dirección! Intenta de nuevo.
        </Alert>
      </Snackbar>
      {/* Add branch modal */}
      <BasicDialog
        open={openBranchModal}
        title="Agrega una dirección"
        onClose={() => {
          setOpenBranchModal(false);
        }}
        closeMark
      >
        <Box sx={{ my: 1 }}>
          <BranchForm
            onUpsert={async (br, _act) => {
              try {
                await addAddress(br);
                setOpenBranchModal(false);
              } catch (_e) {
                setOpenError(true);
              }
            }}
          />
        </Box>
      </BasicDialog>

      {/* Edit branch modal */}
      <BasicDialog
        open={openEditBranchModal}
        title="Edita tu dirección"
        onClose={() => {
          setOpenEditBranchModal(false);
        }}
        closeMark
      >
        <Box sx={{ my: 1 }}>
          {editBranchState ? (
            <BranchForm
              onUpsert={async (br, _act) => {
                try {
                  await editAddress(br);
                  setOpenEditBranchModal(false);
                } catch (_e) {
                  setOpenError(true);
                }
              }}
              branchState={editBranchState}
              editMode
            />
          ) : null}
          {!editBranchState && <LoadingProgress sx={{ my: 4 }} />}
        </Box>
      </BasicDialog>
      <Box sx={{ my: 16 }}>
        <Stack direction="row" alignItems="center" sx={{ mt: 2, mb: 4 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6">
              {`Perfil de tu cuenta de ${sellerName}`}
            </Typography>
          </Box>
        </Stack>

        {/* Email password signup form */}
        <SignUpForm register={handleUpdateProfile} userState={user} editMode />
        <Divider sx={{ my: 2 }} />
        {/* Addresses */}
        <Stack direction="row" alignItems="center" sx={{ mt: 2, mb: 4 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Tus Direcciones</Typography>
          </Box>
        </Stack>
        {addresses.map((br) => {
          return (
            <BranchCard
              key={br.id}
              address={
                <Typography>
                  <b>
                    {br.branchName}
                    {br.id === defaultAddress?.id ? " (Predefinida)" : ""}
                  </b>
                  <br /> {br.fullAddress}
                </Typography>
              }
              selected={br.id === defaultAddress?.id}
              sx={{ mx: { xs: 0.5, md: 2 }, my: 2 }}
              onClick={() => {
                setDefaultAddress(br.id!);
              }}
              editOption={() => {
                setEditBranchState(br);
                setOpenEditBranchModal(true);
              }}
            />
          );
        })}
        {/* Add an address */}
        <Box sx={{ my: 3, display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="info"
            onClick={() => {
              setOpenBranchModal(true);
            }}
          >
            Agregar dirección
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
