import {
  Box,
  type SxProps,
  Typography,
  Radio,
  RadioGroup as MuiRadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";

interface RadioGroupProps {
  label: string;
  name: string;
  defaultValue: string;
  options: { value: string; label: string }[];
  direction?: "row" | "column";
  radioSx?: SxProps;
  onChange: (value: string) => void;
}

export function RadioGroup({
  label,
  name,
  defaultValue,
  options,
  direction = "column",
  radioSx,
  onChange,
}: RadioGroupProps): JSX.Element {
  return (
    <FormControl>
      <FormLabel id={`${name}-radio-buttons-group-label`}>
        <Typography variant="h6" sx={{ mb: 1 }} align="center">
          {label}
        </Typography>
      </FormLabel>
      <MuiRadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        value={defaultValue}
        name={name}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      >
        <Box sx={{ display: "flex", flexDirection: direction }}>
          {options.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio />}
              label={option.label}
              sx={radioSx}
            />
          ))}
        </Box>
      </MuiRadioGroup>
    </FormControl>
  );
}
