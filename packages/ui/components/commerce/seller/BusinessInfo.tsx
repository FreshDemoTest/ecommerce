import {
  Box,
  List,
  ListItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  tableCellClasses,
  useTheme,
} from "@mui/material";
import type { SxProps } from "@mui/material";
import Link from "next/link";

function StyledTableCell({
  sx,
  children,
}: {
  sx?: SxProps;
  children: React.ReactNode;
}): JSX.Element {
  const theme = useTheme();
  return (
    <TableCell
      sx={{
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: theme.palette.primary.dark,
          color: theme.palette.getContrastText(theme.palette.primary.dark),
        },
        ...sx,
      }}
      align="center"
    >
      {children}
    </TableCell>
  );
}

interface BusinessInfoProps {
  seller: {
    businessName: string;
    website?: string;
    policyTerms: string;
    minQuantity: number;
    minQuantityUnit: string;
  };
  units: {
    unitName: string;
    fullAddress: string;
    deliverySchedules: {
      dow: string;
      start: number; // 0-22 hrs
      end: number; // 1-23 hrs
    }[];
    deliveryZones: string[];
    deliveryWindowSize: number; // in hours
    cutOffTime: number; // 0-23 hrs
    warnDays: number; // days before delivery date
  }[];
}

export function BusinessInfo({
  seller,
  units,
}: BusinessInfoProps): JSX.Element {
  const theme = useTheme();
  return (
    <Box sx={{ px: { xs: 4, md: 40 }, pt: 3, pb: 5 }}>
      <Typography variant="h4" sx={{ mb: 1 }}>
        {seller.businessName}
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Nuestro servicio dentro de éste comercio electrónico requiere un mínimo
        de pedido de {seller.minQuantity} {seller.minQuantityUnit}.
      </Typography>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Políticas de compra
      </Typography>
      <Typography variant="body1" sx={{ mb: 1 }}>
        {seller.policyTerms}
      </Typography>
      {seller.website ? (
        <Typography variant="body2" sx={{ mb: 2 }}>
          Para más información consulta:{" "}
          <Link rel="noopener noreferrer" target="_blank" href={seller.website}>
            {seller.website}
          </Link>
        </Typography>
      ) : null}
      {/* Cobertura */}
      <Box sx={{ mt: 1 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Cobertura
        </Typography>
        <TableContainer component={Paper} sx={{ overflow: "scroll" }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Unidad</StyledTableCell>
                <StyledTableCell sx={{ minWidth: 160 }}>
                  Dirección
                </StyledTableCell>
                <StyledTableCell sx={{ minWidth: 200 }}>
                  Horario Entregas
                </StyledTableCell>
                <StyledTableCell sx={{ minWidth: 200 }}>
                  Aviso de Pedidos
                </StyledTableCell>
                <StyledTableCell sx={{ minWidth: 200 }}>
                  Zonas de Entrega
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {units.map((unit) => (
                <TableRow key={unit.unitName + unit.fullAddress}>
                  <TableCell>
                    <Typography variant="body1">{unit.unitName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">{unit.fullAddress}</Typography>
                  </TableCell>
                  {/* horario */}
                  <TableCell>
                    {unit.deliverySchedules.map((schedule) => (
                      <Box
                        key={schedule.dow}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <Typography variant="body1">
                          {schedule.dow}, Entre {schedule.start} y{" "}
                          {schedule.end}
                        </Typography>
                      </Box>
                    ))}
                    <Typography
                      variant="body1"
                      sx={{
                        mt: 2,
                        fontWeight: theme.typography.fontWeightMedium,
                      }}
                      align="center"
                    >
                      * En ventanas de entrega de {unit.deliveryWindowSize} hrs.
                    </Typography>
                  </TableCell>
                  {/* aviso de pedidos */}
                  <TableCell>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      Pedidios con {unit.warnDays} día(s) antes del día de
                      entrega. Hasta las {unit.cutOffTime} hrs.
                    </Typography>
                  </TableCell>
                  {/* zonas de entrega */}
                  <TableCell>
                    <List sx={{ maxHeight: 240, overflowY: "scroll" }}>
                      {unit.deliveryZones.map((zone) => (
                        <ListItem key={zone}>
                          <Typography variant="body1">* {zone}</Typography>
                        </ListItem>
                      ))}
                    </List>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
