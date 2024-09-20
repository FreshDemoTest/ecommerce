// material
import {
  ExpandableAccordion,
  // ExpandMoreIcon,
  Grid,
  MenuItem,
  SearchInput,
  Stack,
  TextField,
  Typography,
} from "ui";
import type {
  FormikErrors,
  FieldInputProps,
  FormikTouched,
  FormikValues,
} from "formik";
import {
  type BranchInvoiceInfoType,
  CfdiUses,
  FiscalRegimes,
  zipCodes,
} from "../../../domain/user";

interface InvoiceBranchFormProps {
  getFieldProps: (nameOrOptions: any) => FieldInputProps<any>;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<FormikErrors<FormikValues>> | Promise<void>;
  touched: FormikTouched<FormikValues>;
  errors: FormikErrors<FormikValues>;
  defaultValues?: BranchInvoiceInfoType;
  editMode?: boolean;
}

export function InvoiceBranchForm({
  getFieldProps,
  setFieldValue,
  touched,
  errors,
  defaultValues,
  editMode = false,
}: InvoiceBranchFormProps): JSX.Element {
  const handleTaxZip = (option: {
    label: string;
    value: string;
    estate?: string;
    city?: string;
  }): void => {
    // update formik values
    void setFieldValue("taxZipCode", option.value);
  };

  const zipDefaultIdx = zipCodes.find((z) => z.v === defaultValues?.taxZipCode);
  const zipDefault = zipDefaultIdx
    ? {
        label: zipDefaultIdx.l,
        value: zipDefaultIdx.v,
        estate: zipDefaultIdx.e,
        city: zipDefaultIdx.c,
      }
    : undefined;

  return (
    <ExpandableAccordion
      summary={
        <Grid container direction="row" spacing={1}>
          <Grid item xs={12} md={12}>
            <Typography>Información de facturación (opcional)</Typography>
          </Grid>
        </Grid>
      }
    >
      <Stack spacing={2}>
        <TextField
          fullWidth
          select
          label="Régimen Fiscal"
          {...getFieldProps("fiscalRegime")}
          error={Boolean(touched.fiscalRegime && errors.fiscalRegime)}
          helperText={
            touched.fiscalRegime
              ? (errors.fiscalRegime as React.ReactNode)
              : undefined
          }
        >
          {/* iter over fiscal regimes in alphabetical order */}
          {FiscalRegimes.sort((a, b): number =>
            b.label.localeCompare(a.label)
          ).map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="RFC"
          {...getFieldProps("taxId")}
          error={Boolean(touched.taxId && errors.taxId)}
          helperText={
            touched.taxId ? (errors.taxId as React.ReactNode) : undefined
          }
          onChange={(e) => {
            const value = e.target.value.toUpperCase();
            void setFieldValue("taxId", value);
          }}
        />

        <TextField
          fullWidth
          label="Nombre o Razón Social"
          {...getFieldProps("taxName")}
          sx={{
            textTransform: "uppercase",
          }}
          error={Boolean(touched.taxName && errors.taxName)}
          helperText={
            touched.taxName ? (errors.taxName as React.ReactNode) : undefined
          }
          onChange={(e) => {
            const value = e.target.value.toUpperCase();
            void setFieldValue("taxName", value);
          }}
        />

        <TextField
          fullWidth
          label="Dirección Fiscal"
          {...getFieldProps("taxAddress")}
          error={Boolean(touched.taxAddress && errors.taxAddress)}
          helperText={
            touched.taxAddress
              ? (errors.taxAddress as React.ReactNode)
              : undefined
          }
        />

        <Grid container>
          <Grid item xs={7} lg={7} sx={{ pr: 2 }}>
            <TextField
              fullWidth
              select
              label="Uso de CFDI"
              {...getFieldProps("cfdiUse")}
              error={Boolean(touched.cfdiUse && errors.taxZipCcfdiUseode)}
              helperText={
                touched.cfdiUse
                  ? (errors.cfdiUse as React.ReactNode)
                  : undefined
              }
            >
              {CfdiUses.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {`${option.label}`}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={5} lg={5}>
            <SearchInput
              fullWidth
              label="Código Postal"
              options={zipCodes.map((z) => ({
                label: z.l,
                value: z.v,
                estate: z.e,
                city: z.c,
              }))}
              onSelectOption={handleTaxZip}
              defaultValue={editMode ? zipDefault : undefined}
              fieldProps={{
                error: Boolean(touched.taxZipCode && errors.taxZipCode),
                helperText: touched.taxZipCode
                  ? (errors.taxZipCode as React.ReactNode)
                  : undefined,
              }}
            />
          </Grid>
        </Grid>
        <TextField
          fullWidth
          label="Email para Facturación"
          {...getFieldProps("invoiceEmail")}
          error={Boolean(touched.invoiceEmail && errors.invoiceEmail)}
          helperText={
            touched.invoiceEmail
              ? (errors.invoiceEmail as React.ReactNode)
              : undefined
          }
        />
      </Stack>
    </ExpandableAccordion>
  );
}
