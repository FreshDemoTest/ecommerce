"use client";

import type { SxProps } from "@mui/material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Radio,
  useTheme,
} from "@mui/material";

interface BranchCardProps {
  address: string | React.ReactNode;
  selected: boolean;
  sx?: SxProps;
  onClick?: () => void;
  disabled?: boolean;
  editOption?: () => void;
}

export function BranchCard({
  address,
  selected,
  sx,
  onClick,
  disabled = false,
  editOption = undefined,
}: BranchCardProps): JSX.Element {
  const theme = useTheme();
  const bgColor = disabled ? { backgroundColor: theme.palette.grey[200] } : {};

  const containerSz = editOption !== undefined ? 9.5 : 12;
  return (
    <Card sx={{ backgroundColor: bgColor.backgroundColor || "inherit", ...sx }}>
      <CardContent>
        <Grid container>
          <Grid item xs={containerSz} md={containerSz}>
            <Grid container onClick={onClick} sx={{ cursor: "pointer" }}>
              <Grid item xs={3} md={3}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    pt: { xs: 3, md: 1 },
                  }}
                >
                  <Radio checked={selected} />
                </Box>
              </Grid>
              <Grid item xs={9} md={7}>
                <Box sx={{ pt: { xs: 0.5, md: 1.5 }, pr: { xs: 2, md: 0 } }}>
                  {address}
                </Box>
              </Grid>
            </Grid>
          </Grid>
          {editOption !== undefined ? (
            <Grid item xs={12 - containerSz} md={12 - containerSz}>
              <Button variant="outlined" size="small" onClick={editOption}>
                Editar
              </Button>
            </Grid>
          ) : null}
        </Grid>
      </CardContent>
    </Card>
  );
}
