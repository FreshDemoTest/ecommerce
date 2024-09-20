"use client";
import * as Yup from "yup";
import { useState } from "react";
import { useFormik, Form, FormikProvider } from "formik";
import {
  Alert,
  BasicDialog,
  Button,
  Grid,
  LoadingProgress,
  MenuItem,
  SearchInput,
  Stack,
  TextField,
  Typography,
} from "ui";
import {
  zipCodes,
  type BranchStateType,
  estatesMx,
} from "../../../domain/user";
import { InvoiceBranchForm } from "./InvoiceBranchForm";

// ----------------------------------------------------------------------

interface BranchFormProps {
  onUpsert: (branch: BranchStateType, action: "add" | "edit") => Promise<void>;
  branchState?: BranchStateType;
  editMode?: boolean;
}

export function BranchForm({
  onUpsert,
  branchState = {
    branchCategory: undefined,
    branchName: "",
    street: "",
    externalNum: "",
    internalNum: "",
    neighborhood: "",
    city: "",
    estate: "",
    country: "México",
    zipCode: "",
    taxId: "", // RFC in Mexico
    fiscalRegime: "",
    taxName: "",
    taxAddress: "",
    cfdiUse: "",
    taxZipCode: "",
    invoiceEmail: "",
  },
  editMode = false,
}: BranchFormProps): JSX.Element {
  const [openConfirmDiag, setOpenConfirmDiag] = useState(false);
  const [confirmedSave, setConfirmedSave] = useState(false);

  // zipcode handler
  const handleZip = async (option: {
    label: string;
    value: string;
    estate?: string;
    city?: string;
  }): Promise<void> => {
    // update formik values
    await setFieldValue("estate", option.estate);
    await setFieldValue("zipCode", option.value);
    if (option.city) {
      await setFieldValue("city", option.city);
    }
    if (option.label) {
      await setFieldValue("neighborhood", option.label);
    }
  };

  const handleConfirm = (validationReminder: boolean): void => {
    if (validationReminder) {
      setOpenConfirmDiag(false);
      setConfirmedSave(true);
      handleSubmit();
    } else {
      setOpenConfirmDiag(false);
    }
  };

  const BranchSchema = Yup.object().shape({
    branchName: Yup.string()
      .min(2, "¡Nombre demasiado corto!")
      .max(50, "¡Nombre demasiado largo!")
      .required("Nombre de la Dirección es requerido."),
    street: Yup.string()
      .min(3, "¡Calle demasiado corta!")
      .required("Calle es requerido."),
    externalNum: Yup.string()
      .max(255, "¡Numero exterior demasiado largo, Máx. 255 caractéres!")
      .required("Número exterior es requerido."),
    internalNum: Yup.string().max(
      255,
      "¡Numero interior demasiado largo, Máx. 255 caractéres!"
    ),
    neighborhood: Yup.string()
      .max(255, "¡Colonia es demasiado larga, Máx. 255 caractéres!")
      .required("Colonia es requerida."),
    city: Yup.string()
      .max(255, "Municipio/Alcaldía es demasiado largo, Máx. 255 caractéres!")
      .required("Municipio/Alcaldía es requerido."),
    estate: Yup.string()
      .max(255, "Estado es demasiado largo, Máx. 255 caractéres!")
      .required("Estado es requerido."),
    country: Yup.string()
      .max(255, "País es demasiado largo, Máx. 255 caractéres!")
      .required("País es requerido."),
    zipCode: Yup.string()
      .length(5, "¡Código postal debe de ser a 5 dígitos")
      .matches(/\d*/)
      .required("Código postal es requerido."),
    // additional invoice info
    taxId: Yup.string().max(14, "RFC es inválido!"),
    fiscalRegime: Yup.string(),
    taxName: Yup.string().max(
      511,
      "Razón Social / Nombre es demasiado largo, Máx. 500 caractéres!"
    ),
    taxAddress: Yup.string().max(
      511,
      "Dirección Fiscal es demasiado larga, Máx. 500 caractéres!"
    ),
    cfdiUse: Yup.string(),
    taxZipCode: Yup.string()
      .length(5, "¡Código postal debe de ser a 5 dígitos")
      .matches(/\d*/),
    invoiceEmail: Yup.string().email("Email inválido"),
  });

  const formik = useFormik({
    initialValues: branchState,
    validationSchema: BranchSchema,
    onSubmit: async (values, { setSubmitting }) => {
      // if the invoice info is not there and it has not been confirmed
      const isInvoiceInfoValid =
        values.taxId !== "" &&
        values.fiscalRegime !== "" &&
        values.taxName !== "" &&
        values.taxAddress !== "" &&
        values.cfdiUse !== "" &&
        values.taxZipCode !== "" &&
        values.invoiceEmail !== "";
      if (!isInvoiceInfoValid && !confirmedSave) {
        setOpenConfirmDiag(true);
        setSubmitting(false);
        return;
      }
      try {
        await onUpsert(
          {
            ...values,
            fullAddress: `${values.street} ${values.externalNum} ${values.internalNum}, ${values.neighborhood}, ${values.city}, ${values.estate}, ${values.country}, C.P. ${values.zipCode}`,
          },
          editMode ? "edit" : "add"
        );
        // fetch all branches

        setSubmitting(false);
      } catch (error) {
        setSubmitting(false);
      }
    },
  });

  const {
    values,
    errors,
    touched,
    handleSubmit,
    isSubmitting,
    getFieldProps,
    setFieldValue,
  } = formik;
  const nonEmpty =
    values.branchName !== "" &&
    values.street !== "" &&
    values.externalNum !== "" &&
    values.neighborhood !== "" &&
    values.city !== "" &&
    values.estate !== "" &&
    values.zipCode !== "";
  const allValues =
    Object.keys(errors).filter(
      (k) => !["internalNum", "neighborhood"].includes(k)
    ).length === 0;

  const zipDefaultIdx = zipCodes.find((z) => z.v === branchState.zipCode);
  const zipDefault = zipDefaultIdx
    ? {
        label: zipDefaultIdx.l,
        value: zipDefaultIdx.v,
        estate: zipDefaultIdx.e,
        city: zipDefaultIdx.c,
      }
    : undefined;

  return (
    <>
      {/* confirmation dialog */}
      <BasicDialog
        open={openConfirmDiag}
        title="¡Nos falta tu información de Facturación!"
        msg="Parece ser que no agregaste la información de facturación de tu dirección."
        continueAction={{
          active: true,
          msg: "Guardar de todos modos",
          actionFn: () => {
            handleConfirm(true);
          },
        }}
        backAction={{
          active: true,
          msg: "Regresar",
          actionFn: () => {
            setOpenConfirmDiag(false);
          },
        }}
        closeMark={false}
        onClose={() => {
          handleConfirm(false);
        }}
      >
        <Typography>
          <br />
          Agregala aquí para poder recibir las facturas de tu proveedor
          directamente.
          <br />
        </Typography>
      </BasicDialog>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Branch Info */}

            <TextField
              fullWidth
              label="Nombre de la Dirección"
              {...getFieldProps("branchName")}
              error={Boolean(touched.branchName && errors.branchName)}
              helperText={touched.branchName ? errors.branchName : undefined}
            />

            <Grid container>
              <Grid item xs={8} lg={8} sx={{ pr: 2 }}>
                <TextField
                  fullWidth
                  label="Calle"
                  {...getFieldProps("street")}
                  error={Boolean(touched.street && errors.street)}
                  helperText={touched.street ? errors.street : undefined}
                />
              </Grid>
              <Grid item xs={4} lg={4}>
                <TextField
                  fullWidth
                  label="Núm. Ext."
                  {...getFieldProps("externalNum")}
                  error={Boolean(touched.externalNum && errors.externalNum)}
                  helperText={
                    touched.externalNum ? errors.externalNum : undefined
                  }
                />
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={4} lg={4} sx={{ pr: 2 }}>
                <TextField
                  fullWidth
                  label="Núm. Int."
                  {...getFieldProps("internalNum")}
                  error={Boolean(touched.internalNum && errors.internalNum)}
                  helperText={
                    touched.internalNum ? errors.internalNum : undefined
                  }
                />
              </Grid>
              <Grid item xs={8} lg={8}>
                <SearchInput
                  fullWidth
                  label="Código Postal"
                  options={zipCodes.map((z) => ({
                    label: z.l,
                    value: z.v,
                    estate: z.e,
                    city: z.c,
                  }))}
                  onSelectOption={(o) => {
                    void handleZip(o);
                  }}
                  defaultValue={editMode ? zipDefault : undefined}
                  fieldProps={{
                    error: Boolean(touched.zipCode && errors.zipCode),
                    helperText: touched.zipCode && errors.zipCode,
                  }}
                  initialSize={20}
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Colonia"
              {...getFieldProps("neighborhood")}
              error={Boolean(touched.neighborhood && errors.neighborhood)}
              helperText={
                touched.neighborhood ? errors.neighborhood : undefined
              }
            />

            <TextField
              fullWidth
              label="Municipio o Alcaldía"
              {...getFieldProps("city")}
              error={Boolean(touched.city && errors.city)}
              helperText={touched.city ? errors.city : undefined}
            />

            <Grid container>
              <Grid item xs={7} lg={7} sx={{ pr: 2 }}>
                <TextField
                  fullWidth
                  select
                  label="Estado"
                  {...getFieldProps("estate")}
                  error={Boolean(touched.estate && errors.estate)}
                  helperText={touched.estate ? errors.estate : undefined}
                >
                  {Object.values(estatesMx).map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={5} lg={5}>
                <TextField
                  fullWidth
                  disabled
                  label="País"
                  {...getFieldProps("country")}
                  error={Boolean(touched.country && errors.country)}
                  helperText={touched.country ? errors.country : undefined}
                />
              </Grid>
            </Grid>

            {/* Branch Tax Info */}
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ mt: 3 }}
            >
              Datos Fiscales
            </Typography>
            <InvoiceBranchForm
              getFieldProps={getFieldProps}
              setFieldValue={setFieldValue}
              touched={touched}
              errors={errors}
              defaultValues={branchState}
              editMode={editMode}
            />

            {!allValues && nonEmpty ? (
              <Alert severity="error">
                {errors.branchName ||
                  errors.externalNum ||
                  errors.neighborhood ||
                  errors.city ||
                  errors.estate ||
                  errors.zipCode ||
                  errors.country}
              </Alert>
            ) : null}

            <Grid container>
              <Grid item xs={isSubmitting ? 8 : 12} md={isSubmitting ? 10 : 12}>
                <Button
                  fullWidth
                  disabled={!allValues || isSubmitting}
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  {editMode ? "Editar Dirección" : "Crear Dirección"}
                </Button>
              </Grid>
              {isSubmitting ? (
                <Grid item xs={4} md={2}>
                  <LoadingProgress />
                </Grid>
              ) : null}
            </Grid>
          </Stack>
        </Form>
      </FormikProvider>
    </>
  );
}
