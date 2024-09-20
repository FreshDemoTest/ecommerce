"use client";

import { useEffect, useState } from "react";
// material
import { Box, Button, Grid, Typography, useTheme } from "@mui/material";
import { type InvoiceType } from "../../../domain";
import { createBlobURI, decodeFile, fCurrency } from "../../../utils";

// ----------------------------------------------------------------------

interface InvoiceDetailsViewProps {
  invoiceDetails?: InvoiceType;
  paymentMethods: Record<string, string>;
}

export function InvoiceDetails({
  invoiceDetails,
  paymentMethods,
}: InvoiceDetailsViewProps): JSX.Element {
  const [xmlFileUrl, setXmlFileUrl] = useState<string | undefined>(undefined);
  const [pdfFileUrl, setPdfFileUrl] = useState<string | undefined>(undefined);
  const theme = useTheme();
  const notFound = invoiceDetails === undefined;

  useEffect(() => {
    let _pdfFile: File | undefined;
    let _xmlFile: File | undefined;
    if (invoiceDetails?.pdfFile) {
      _pdfFile = decodeFile({
        content: invoiceDetails.pdfFile,
        mimetype: "application/pdf",
        filename: `factura-${invoiceDetails.uuid}-${invoiceDetails.folio}.pdf`,
      });
      const pdfUri = createBlobURI(_pdfFile);
      setPdfFileUrl(pdfUri);
    }
    if (invoiceDetails?.xmlFile) {
      _xmlFile = decodeFile({
        content: invoiceDetails.xmlFile,
        mimetype: "application/xml",
        filename: `factura-${invoiceDetails.uuid}-${invoiceDetails.folio}.xml`,
      });
      const xmlUri = createBlobURI(_xmlFile);
      setXmlFileUrl(xmlUri);
    }
  }, [invoiceDetails]);

  return (
    <Box>
      {/* Invoice details */}
      {!notFound && (
        <Box sx={{ mt: theme.spacing(6), mb: theme.spacing(16) }}>
          {/* Factura ID */}
          <Typography
            variant="h4"
            sx={{ fontWeight: theme.typography.fontWeightLight }}
          >
            Factura
          </Typography>
          <Typography variant="subtitle1">
            SAT UUID: {invoiceDetails.uuid || ""}
          </Typography>

          {/* Proveedor */}
          <Grid container>
            <Grid item xs={6} sm={6}>
              <Typography
                variant="overline"
                paragraph
                sx={{ color: "text.disabled", mb: theme.spacing(0) }}
              >
                Proveedor
              </Typography>
              <Typography variant="body1">
                <b>{invoiceDetails.supplier?.supplierName || ""}</b>
              </Typography>
            </Grid>

            {/* Tipo de Orden */}
            <Grid item xs={6} sm={6}>
              <Typography
                variant="overline"
                paragraph
                sx={{
                  color: "text.disabled",
                  mb: theme.spacing(0),
                  mt: theme.spacing(0),
                }}
              >
                Total de Factura
              </Typography>
              <Box>
                <Typography variant="subtitle2">
                  {fCurrency(Number(invoiceDetails.total))}
                </Typography>
              </Box>
              <Typography
                variant="overline"
                paragraph
                sx={{
                  color: "text.disabled",
                  mb: theme.spacing(0),
                  mt: theme.spacing(1),
                }}
              >
                Tipo de Pago
              </Typography>
              <Box>
                <Typography variant="subtitle2">
                  {
                    paymentMethods[
                      invoiceDetails.paymentMethod?.toLowerCase() || ""
                    ]
                  }
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Actions */}
          <Grid container sx={{ mt: 8 }}>
            <Grid item xs={0} md={1} />
            <Grid item xs={6} md={5} sx={{ px: theme.spacing(0.5) }}>
              {xmlFileUrl ? (
                <Button
                  fullWidth
                  variant="outlined"
                  color="info"
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = xmlFileUrl;
                    link.download = `factura-${invoiceDetails.uuid}-${invoiceDetails.folio}.xml`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  Descargar XML
                </Button>
              ) : null}
            </Grid>

            <Grid item xs={6} md={5} sx={{ px: theme.spacing(0.5) }}>
              {pdfFileUrl ? (
                <Button
                  fullWidth
                  variant="contained"
                  color="info"
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = pdfFileUrl;
                    link.download = `factura-${invoiceDetails.uuid}-${invoiceDetails.folio}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  Descargar PDF
                </Button>
              ) : null}
            </Grid>
          </Grid>
        </Box>
      )}

      {/* No Invoice message */}
      {notFound ? (
        <Box sx={{ my: theme.spacing(24), textAlign: "center" }}>
          <Typography variant="h5" align="center">
            No hay ninguna factura asociada.
          </Typography>

          <Typography variant="subtitle2" align="center">
            Si requieres la factura de tu pedido, por favor contacta a nuestro
            equipo de soporte.
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
}
