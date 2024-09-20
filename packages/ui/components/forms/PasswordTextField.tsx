"use client";

import { useState } from "react";
import {
  IconButton,
  InputAdornment,
  TextField,
  type TextFieldProps,
} from "@mui/material";
import EyeFill from "@mui/icons-material/Visibility";
import EyeOffFill from "@mui/icons-material/VisibilityOff";

export function PasswordTextField(props: TextFieldProps): JSX.Element {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = (): void => {
    setShowPassword((show) => !show);
  };

  return (
    <TextField
      {...props}
      type={showPassword ? "text" : "password"}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleShowPassword} edge="end">
              {showPassword ? <EyeFill /> : <EyeOffFill />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
