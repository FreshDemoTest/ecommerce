"use client";

import Link from "next/link";
// components
import {
  Box,
  Grid,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  Alert,
  TableContainer,
  Table,
  Hidden,
  TableBody,
} from "@mui/material";
import { UOMTypes, type SupplierProductType } from "../../../domain";
import { fCurrency, generateCloudinaryVersion, urlFormat } from "../../../utils";
import { Incrementer } from "../catalog/Incrementer";

// ----------------------------------------------------------------------

const IMAGE_CDN = "https://res.cloudinary.com/neutro-mx/image/upload/v1/";

/* original implementation @packages/core/domain/ecommerce/cart/index.tsx  */
export interface CartEntry {
  id?: string;
  supplierProduct: SupplierProductType;
  quantity: number;
  total?: number;
  comments?: string;
}

// ----------------------------------------------------------------------

interface ProductSelectorProps {
  products: CartEntry[];
  onDelete: (product: any) => void;
  onDecreaseQuantity: (product: any) => void;
  onIncreaseQuantity: (product: any) => void;
  onChangeQuantity: (product: any, value: number) => void;
  title?: string;
  minReached: { flag: boolean; amountStr: string };
  maxHeight?: number | string;
  defaultIconPath?: string;
}

function ProductSelector({
  products,
  onDelete,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onChangeQuantity,
  title = undefined,
  minReached,
  maxHeight = "calc(100vh - 250px)",
  defaultIconPath,
}: ProductSelectorProps): JSX.Element {
  const theme = useTheme();

  return (
    <Box
      sx={{
        overflowX: "hidden",
        overflowY: "auto",
        maxHeight,
      }}
    >
      <Typography
        variant="h6"
        sx={{ ml: 2, mb: 1, mt: 2 }}
        color="text.secondary"
        align="left"
      >
        {title || "Productos"}
      </Typography>
      {/* Table of products */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <Hidden smUp>
                <TableCell
                  align="center"
                  sx={{ color: theme.palette.text.disabled }}
                >
                  Producto
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ color: theme.palette.text.disabled }}
                >
                  Cantidad
                </TableCell>
              </Hidden>
            </TableRow>
          </TableHead>

          <TableBody>
            {products.map((product) => {
              const imageSrc =
                product.supplierProduct.images &&
                product.supplierProduct.images.length > 0
                  ? `${IMAGE_CDN.replace("/v1/", generateCloudinaryVersion())}${product.supplierProduct.images[0]}`
                  : defaultIconPath;
              const sUnit =
                Object.entries(UOMTypes).find(
                  (s) =>
                    s[0].toUpperCase() ===
                    product.supplierProduct.sellUnit.toUpperCase()
                )?.[1] || product.supplierProduct.sellUnit;
              return (
                <TableRow key={product.supplierProduct.id}>
                  {/* Product Cell */}
                  <TableCell sx={{ minWidth: 180, maxWidth: 210 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        component="img"
                        alt={`Imagen de ${product.supplierProduct.productDescription}`}
                        data-src={imageSrc}
                        src={imageSrc}
                        sx={{
                          mr: 2,
                          width: 48,
                          height: 48,
                          borderRadius: 1.5,
                        }}
                      />
                      <Box>
                        <Link
                          href={`/catalog/product/${urlFormat(
                            product.supplierProduct.productDescription
                          )}_${product.supplierProduct.id}`}
                          passHref
                          style={{ color: theme.palette.text.secondary }}
                        >
                          <Typography variant="subtitle2">
                            {product.supplierProduct.productDescription}
                          </Typography>
                        </Link>
                        <Typography
                          component="span"
                          variant="body1"
                          color="textSecondary"
                          sx={{ fontSize: 12 }}
                        >
                          {`${fCurrency(
                            product.supplierProduct.price?.amount
                          )} / ${sUnit}`}
                        </Typography>
                        {product.supplierProduct.minimumQuantity > 1 ? (
                          <><br />
                          <Typography
                            component="span"
                            variant="body1"
                            color="textSecondary"
                            sx={{ fontSize: 12 }}
                          >
                            {`Min. ${product.supplierProduct.minimumQuantity} ${sUnit}s`}
                          </Typography>
                          </>
                        ) : null}
                      </Box>
                    </Box>
                  </TableCell>
                  {/* Quantity Cell */}
                  <TableCell align="right">
                    <Grid container>
                      <Grid item xs={12}>
                        <Typography variant="body1" color="primary">
                          <b>
                            {fCurrency(
                              product.quantity *
                                (product.supplierProduct.unitMultiple || 1) *
                                (product.supplierProduct.price?.amount || 0)
                            )}{" "}
                          </b>
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sx={{
                          marginTop: 1,
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Incrementer
                          product={product}
                          onDelete={() => {
                            onDelete(product);
                          }}
                          onDecrease={() => {
                            onDecreaseQuantity(product);
                          }}
                          onIncrease={() => {
                            onIncreaseQuantity(product);
                          }}
                          onQuantityChange={(value) => {
                            onChangeQuantity(product, value);
                          }}
                        />
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              );
            })}

            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  <Typography variant="body1" color="textSecondary">
                    Selecciona un cliente para ver sus productos y precios
                    correspondientes.
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {products.length > 0 && products.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  <Typography variant="body1" color="textSecondary">
                    No hay productos que coincidan con la búsqueda.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {!minReached.flag && products.length > 0 && (
        <Box sx={{ px: 2 }}>
          <Hidden mdDown>
            {/* Desktop */}
            <Alert severity="info" sx={{ mt: 2 }}>
              Tu pedido no llega al mínimo: {minReached.amountStr}
            </Alert>
          </Hidden>
          <Hidden mdUp>
            {/* mobile */}
            <Alert severity="info" sx={{ mt: 2 }}>
              Tu pedido no llega al mínimo: <br /> {minReached.amountStr}
            </Alert>
          </Hidden>
        </Box>
      )}
    </Box>
  );
}

export { ProductSelector };
