import Link from "next/link";
import { forwardRef } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  Grid,
  IconButton,
  Slide,
  Typography,
  useTheme,
} from "@mui/material";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import CloseIcon from "@mui/icons-material/Close";
import type { TransitionProps } from "@mui/material/transitions";
import { fCurrency } from "../../../utils";
import { ProductSelector } from "./ProductSelector";
import type { CartEntry } from "./ProductSelector";

// ----------------------------------

const deskModalWidth = "27vw";
const mobileModalWidth = "95vw";
const subtotalCartDisclaimer = `Consulta información de envío al finalizar la pedido.`;

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

// ----------------------------------

interface CartModalProps {
  open: boolean;
  onClose: () => void;
  checkoutUrl: string;
  products: CartEntry[];
  subtotal: number;
  onDelete: (product: any) => void;
  onDecreaseQuantity: (product: any) => void;
  onIncreaseQuantity: (product: any) => void;
  onChangeQuantity: (product: any, value: number) => void;
  emptyCart: () => void;
  minReached: { flag: boolean; amountStr: string };
  defaultIconPath?: string;
}

export function CartModal({
  open,
  onClose,
  checkoutUrl,
  products,
  subtotal,
  onDelete,
  onDecreaseQuantity,
  onIncreaseQuantity,
  onChangeQuantity,
  emptyCart,
  minReached,
  defaultIconPath
}: CartModalProps): JSX.Element {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: theme.spacing(0),
        "& .MuiDialog-paper": {
          overflowY: "visible",
          margin: theme.spacing(0),
          borderRadius: 0,
          width: deskModalWidth,
          maxHeight: "100vh",
          height: "100vh",
          [theme.breakpoints.down("md")]: {
            width: mobileModalWidth,
          },
        },
      }}
    >
      <DialogTitle sx={{ m: 0, pt: 1, pr: 2, mb: 2.5 }}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      {/* products list */}
      {products.length > 0 ? (
        <ProductSelector
          title="Tu Carrito"
          products={products}
          onDelete={onDelete}
          onDecreaseQuantity={onDecreaseQuantity}
          onIncreaseQuantity={onIncreaseQuantity}
          onChangeQuantity={onChangeQuantity}
          minReached={minReached}
          defaultIconPath={defaultIconPath}
        />
      ) : null}

      {/* message no products */}
      {products.length === 0 ? (
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: theme.spacing(8),
            }}
          >
            <Typography variant="h6">Carrito vacío</Typography>
          </Box>
          <Typography variant="body2" sx={{ ml: 1 }} align="center">
            No has agregado productos a tu carrito.
          </Typography>
        </Box>
      ) : null}

      {/* bottom bar */}
      <Box
        sx={{ position: "absolute", bottom: theme.spacing(5), width: "100%" }}
      >
        <Grid container sx={{ mb: 2 }}>
          <Grid item xs={1} />
          <Grid item xs={6}>
            <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Subtotal:
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{ mt: 0.5, mb: 2, color: theme.palette.text.secondary }}
            >
              {subtotalCartDisclaimer}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Typography
                variant="h6"
                sx={{ my: 2, fontWeight: theme.typography.fontWeightBold }}
              >
                {fCurrency(subtotal)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box sx={{ display: "flex" }}>
            <Link
              href={checkoutUrl}
              passHref
              style={{ marginRight: theme.spacing(0.5) }}
            >
              <Button
                variant="contained"
                color="primary"
                startIcon={<ShoppingCart />}
                onClick={onClose}
              >
                Continuar Compra
              </Button>
            </Link>
            <Button
              variant="outlined"
              color="info"
              onClick={emptyCart}
              startIcon={<RemoveShoppingCartIcon />}
              sx={{ ml: theme.spacing(0.5) }}
            >
              Vaciar carrito
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
