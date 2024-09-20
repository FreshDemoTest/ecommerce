"use client";
import { useState } from "react";
import {
  Grid,
  IconButton,
  InputAdornment,
  type SxProps,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchBarProps {
  placeholder: string;
  searchCallback?: (search: string) => void;
  searchResultsLength: number;
  label?: string;
  sx?: SxProps;
}

export function SearchBar({
  placeholder,
  searchCallback,
  label = "Busca",
  sx,
}: SearchBarProps): JSX.Element {
  const flexSizes = { xs: 12, lg: 12 };
  const [sValue, setSValue] = useState<string>("");

  return (
    <>
      <Grid container direction="row">
        <Grid item xs={flexSizes.xs} lg={flexSizes.lg}>
          <TextField
            fullWidth
            sx={{
              ...sx,
            }}
            variant="filled"
            label={label}
            placeholder={placeholder}
            value={sValue}
            onChange={(e) => {
              setSValue(e.target.value);
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter" && searchCallback) {
                searchCallback(sValue);
              }
            }}
            onBlur={() => {
              if (searchCallback) {
                searchCallback(sValue);
              }
            }}
            InputProps={{
              disableUnderline: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() => {
                      if (searchCallback) {
                        searchCallback(sValue);
                      }
                    }}
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
      {/* {sValue !== "" && (
        <Typography variant="body2" color="text.secondary">
          Hay {searchResultsLength} resultados con tu búsqueda &quot;
          {sValue}&quot;.
        </Typography>
      )} */}
    </>
  );
}
