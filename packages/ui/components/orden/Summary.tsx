import {
  TableRow,
  type SxProps,
  TableCell,
  Box,
  Typography,
  useTheme,
} from "@mui/material";
import { fCurrency } from "../../utils";

interface SummaryRowProps {
  label: string;
  value: number | undefined;
  rowSx?: SxProps;
  sx?: SxProps;
  colSpan?: number;
  contentColSpan?: number;
}

export function SummaryRow({
  label,
  value,
  rowSx = {},
  sx = {},
  colSpan = 1,
  contentColSpan = 2,
}: SummaryRowProps): JSX.Element {
  const theme = useTheme();
  return (
    <TableRow
      sx={{
        "& td": {
          paddingTop: theme.spacing(1),
          paddingBottom: theme.spacing(1),
        },
        ...rowSx,
      }}
    >
      <TableCell colSpan={colSpan} />
      <TableCell align="right" colSpan={contentColSpan}>
        <Box />
        <Typography variant="body2" sx={{ ...sx }}>
          {label}
        </Typography>
      </TableCell>
      <TableCell align="center" width={80}>
        <Box />
        <Typography variant="body1" sx={{ ...sx }}>
          {fCurrency(value)}
        </Typography>
      </TableCell>
    </TableRow>
  );
}

export function SummaryRowPdf({
  label,
  value,
  rowSx = {},
  sx = {},
  colSpan = 2,
  contentColSpan = 2,
}: SummaryRowProps): JSX.Element {
  return (
    <TableRow sx={{ ...rowSx }}>
      <TableCell sx={{ pt: 0 }} colSpan={colSpan} />
      <TableCell sx={{ pt: 0 }} align="right" colSpan={contentColSpan}>
        <Typography variant="body2" sx={{ ...sx }}>
          {label}
        </Typography>
      </TableCell>
      <TableCell sx={{ pt: 0 }} align="center" width={80}>
        <Typography variant="body2" sx={{ ...sx }}>
          {fCurrency(value)}
        </Typography>
      </TableCell>
    </TableRow>
  );
}
