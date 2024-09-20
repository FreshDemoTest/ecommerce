import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
// material
import {
  Alert,
  Button,
  Grid,
  LoadingProgress,
  PasswordTextField,
  Stack,
  TextField,
} from "ui";
import { useClientInfo } from "../../../providers/hooks";

interface LoginFormProps {
  login: (email: string, password: string) => Promise<void>;
}

export function LoginForm({ login }: LoginFormProps): JSX.Element {
  const { error: errorLogingIn } = useClientInfo();

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Correo electrónico tiene que ser un email válido")
      .required("Correo electrónico es requerido"),
    password: Yup.string()
      .min(8, "Contraseña de al menos 8 caracteres")
      .required("Contraseña es requerida"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        await login(values.email, values.password);
        setSubmitting(false);
      } catch (error) {
        setSubmitting(false);
        if (error instanceof Error) {
          setErrors({ email: error.message });
        } else {
          setErrors({
            email: "Ha ocurrido un error, por favor intenta de nuevo.",
          });
        }
      }
    },
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {errors.email ? <Alert severity="error">{errors.email}</Alert> : null}

          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Correo electrónico"
            {...getFieldProps("email")}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email ? errors.email : null}
          />

          <PasswordTextField
            fullWidth
            label="Contraseña"
            {...getFieldProps("password")}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password ? errors.password : null}
          />

          {errorLogingIn ? (
            <Alert severity="error">{errorLogingIn}</Alert>
          ) : null}

          <Grid container sx={{ mt: 1 }}>
            <Grid item xs={isSubmitting ? 8 : 12} md={isSubmitting ? 10 : 12}>
              <Button fullWidth size="large" type="submit" variant="contained">
                Iniciar Sesión
              </Button>
            </Grid>
            {isSubmitting ? (
              <Grid item xs={4} md={2}>
                <LoadingProgress sx={{ backgroundColor: "inherit" }} />
              </Grid>
            ) : null}
          </Grid>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
