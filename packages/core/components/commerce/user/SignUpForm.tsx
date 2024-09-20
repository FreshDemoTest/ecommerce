import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import {
  Alert,
  Button,
  Grid,
  LoadingProgress,
  PasswordTextField,
  Stack,
  TextField,
  Typography,
} from "ui";
import type { UserType } from "../../../domain/user";
import { useClientInfo } from "../../../providers/hooks";

interface SignupFormProps {
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phoneNumber: string
  ) => Promise<void>;
  userState?: UserType & { password?: string };
  editMode?: boolean;
}

export function SignUpForm({
  register,
  userState = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  },
  editMode = false,
}: SignupFormProps): JSX.Element {
  const { error: errorSigningUp } = useClientInfo();

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, "¡Nombre demasiado corto!")
      .max(50, "¡Nombre demasiado largo!")
      .required("Nombre es requerido."),
    lastName: Yup.string()
      .min(2, "¡Apellido demasiado corto!")
      .max(50, "¡Apellido demasiado largo!")
      .required("Apellido es requerido."),
    email: Yup.string()
      .email("¡Correo eléctronico inválido!")
      .required("Correo electrónico es requerido."),
    phoneNumber: Yup.string()
      .length(10, "¡Teléfono debe de ser a 10 dígitos")
      .matches(/\d*/)
      .required("Teléfono es requerido."),
    password: Yup.string()
      .min(8, "¡Contraseña debe ser de al menos 8 caractéres!")
      .required("Contraseña es requerida."),
  });

  const formik = useFormik({
    initialValues: userState,
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        // redux
        if (!editMode) {
          // auth
          await register(
            values.email,
            values.password || "",
            values.firstName,
            values.lastName,
            values.phoneNumber || ""
          );
        } else {
          // edit user
          // backend - [TODO]
        }
        setSubmitting(false);
      } catch (error: any) {
        setSubmitting(false);
        setErrors({ email: (error as Error).message });
      }
    },
  });

  const { values, errors, touched, handleSubmit, isSubmitting, getFieldProps } =
    formik;
  const nonEmpty =
    values.firstName !== "" &&
    values.lastName !== "" &&
    values.email !== "" &&
    values.phoneNumber !== "" &&
    values.password !== "";
  const allValues = Object.keys(errors).length === 0;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {!allValues && nonEmpty ? (
            <Alert severity="error">
              {errors.firstName ||
                errors.lastName ||
                errors.phoneNumber ||
                errors.email ||
                errors.password}
            </Alert>
          ) : null}

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              disabled={editMode}
              label="Nombre"
              {...getFieldProps("firstName")}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName ? errors.firstName : null}
            />

            <TextField
              fullWidth
              disabled={editMode}
              label="Apellido(s)"
              {...getFieldProps("lastName")}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName ? errors.lastName : null}
            />
          </Stack>

          <TextField
            fullWidth
            autoComplete="phone"
            type="number"
            label="Teléfono"
            disabled={editMode}
            {...getFieldProps("phoneNumber")}
            error={Boolean(touched.phoneNumber && errors.phoneNumber)}
            helperText={touched.phoneNumber ? errors.phoneNumber : null}
            InputProps={{
              startAdornment: <Typography>+52&nbsp;</Typography>,
            }}
          />

          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Correo electrónico"
            disabled={editMode}
            {...getFieldProps("email")}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email ? errors.email : null}
          />

          {!editMode && (
            <PasswordTextField
              fullWidth
              label="Contraseña"
              {...getFieldProps("password")}
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password ? errors.password : null}
            />
          )}

          {errorSigningUp ? (
            <Alert severity="error">{errorSigningUp}</Alert>
          ) : null}

          {!editMode ? (
            <Grid container sx={{ mt: 1 }}>
              <Grid item xs={isSubmitting ? 8 : 12} md={isSubmitting ? 10 : 12}>
                <Button
                  fullWidth
                  disabled={!allValues}
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  Registrarme
                </Button>
              </Grid>
              {isSubmitting ? (
                <Grid item xs={4} md={2}>
                  <LoadingProgress sx={{ backgroundColor: "inherit" }} />
                </Grid>
              ) : null}
            </Grid>
          ) : null}
        </Stack>
      </Form>
    </FormikProvider>
  );
}
