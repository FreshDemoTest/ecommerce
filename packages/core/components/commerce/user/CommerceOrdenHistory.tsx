"use client";

import { useState } from "react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import es from "date-fns/locale/es";
import {
  Box,
  Button,
  Grid,
  Hidden,
  InlineDatePicker,
  OrdenCard,
  Pagination,
  Typography,
} from "ui";
import type { InvoiceType, OrdenType } from "ui/domain";
import { fISODate } from "ui/utils";
import { useClientInfo } from "../../../providers/hooks";

// ------------------------------------------------------------

const baseRedirectTo = "/orden/history";
const ordenDetailsPrefix = "/orden/";
const loginRedirectTo = "/login";

interface CommerceOrdenHistoryProps {
  fromDate: Date;
  toDate: Date;
  totalResults: number;
  currentPage: number;
  pages: number;
  pedidos: { orden: OrdenType; invoice?: InvoiceType }[];
}

export function CommerceOrdenHistory({
  fromDate,
  toDate,
  currentPage,
  pages,
  pedidos,
  totalResults,
}: CommerceOrdenHistoryProps): JSX.Element {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isInitialized, isAuthenticated } = useClientInfo();
  const [filterFromDate, setFilterFromDate] = useState<Date>(fromDate);
  const [filterToDate, setFilterToDate] = useState<Date>(toDate);

  // if not logged in redirect to Login
  if (isInitialized && !isAuthenticated) {
    redirect(loginRedirectTo);
  }

  // pagintaion
  function handleHistoryPagination(page: number): void {
    // fetch params
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.replace(`${baseRedirectTo}?${params.toString()}`);
  }

  // filter
  function handleHistoryFilter(): void {
    // fetch params
    const params = new URLSearchParams(searchParams);
    params.set("from_date", fISODate(filterFromDate));
    params.set("to_date", fISODate(filterToDate));
    params.set("page", "1");
    router.replace(`${baseRedirectTo}?${params.toString()}`);
  }

  return (
    <Grid container sx={{ my: { xs: 2, md: 4 }, px: { xs: 2, md: 8 } }}>
      <Grid item xs={12} md={2} />
      {/* Orden List */}
      <Grid item xs={12} md={8}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Historial de Pedidos
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }} color="text.secondary">
            Total de Pedidos: {totalResults}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              mt: 1,
              mb: { xs: 0, md: 2 },
            }}
          >
            <Box sx={{ mr: { xs: 2 } }}>
              <InlineDatePicker
                label="Desde"
                locale={es}
                dateValue={fromDate}
                onChange={(v) => {
                  if (v && v instanceof Date) {
                    setFilterFromDate(v);
                  }
                }}
              />
            </Box>
            <Box sx={{ mr: { xs: 0, md: 2 } }}>
              <InlineDatePicker
                label="Hasta"
                locale={es}
                dateValue={toDate}
                onChange={(v) => {
                  if (v && v instanceof Date) {
                    setFilterToDate(v);
                  }
                }}
              />
            </Box>
            {/* Desktop */}
            <Hidden mdDown>
              <Button
                sx={{ px: 6, my: 0.5 }}
                variant="contained"
                color="primary"
                size="medium"
                onClick={() => {
                  handleHistoryFilter();
                }}
              >
                Filtrar
              </Button>
            </Hidden>
          </Box>
          {/* Mobile */}
          <Hidden mdUp>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                sx={{ px: 3, py: 1, mb: { xs: 2, md: 0 }, mt: 1 }}
                variant="contained"
                color="primary"
                size="small"
                onClick={() => {
                  handleHistoryFilter();
                }}
              >
                Filtrar
              </Button>
            </Box>
          </Hidden>
          <Box>
            {pedidos.map((pedido) => (
              <Link
                key={pedido.orden.id}
                href={`${ordenDetailsPrefix}${pedido.orden.id}`}
                style={{ textDecoration: "none" }}
              >
                <OrdenCard orden={pedido.orden} invoice={pedido.invoice} />
              </Link>
            ))}
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} md={12}>
        {/* Pagination */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            mt: 1,
            mb: 2,
          }}
        >
          <Pagination
            count={pages}
            variant="outlined"
            color="standard"
            page={currentPage}
            onChange={(event, page) => {
              handleHistoryPagination(page);
            }}
          />
        </Box>
      </Grid>
    </Grid>
  );
}
