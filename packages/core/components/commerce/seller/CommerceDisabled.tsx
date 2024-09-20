"use server";

import { redirect } from "next/navigation";
import { AppBar, Box, Grid, Hidden, Logo, Typography } from "ui";
import { getSellerInfo } from "../../../data/api";

interface CommerceDisabledProps {
  reactivatedLink: string;
  apiURL: string;
  sellerId: string;
  logoSrc: string;
}

export async function CommerceDisabled(
  props: CommerceDisabledProps
): Promise<JSX.Element> {
  const sellerInfo = await getSellerInfo(props.apiURL, props.sellerId);

  // if activeAccount has been set to true, redirect to reactivatedLink
  if (sellerInfo.commerceConfig.activeAccount) {
    redirect(props.reactivatedLink);
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          sx={{ height: { md: 64, xs: 40 }, width: "100%" }}
        >
          <>
            <Hidden smUp>
              {/* Mobile */}
              <Logo
                src={props.logoSrc}
                height={40}
                width={40 * 3.5}
                sx={{
                  marginTop: 0.8,
                  marginLeft: -5.6,
                }}
              />
            </Hidden>
            <Hidden smDown>
              {/* Desktop ideally 3.5:1 ratio*/}
              <Logo
                src={props.logoSrc}
                height={64}
                width={224}
                sx={{
                  marginRight: 2,
                  marginLeft: 2,
                }}
              />
            </Hidden>
          </>
        </AppBar>
      </Box>
      <Box
        sx={{
          display: "flex-column",
          justifyContent: "center",
        }}
      >
        <Grid container>
          <Grid item xs={12} md={3} />
          <Grid item xs={12} md={6} sx={{ mt: 8, ml: { md: 0, xs: 1 } }}>
            <Typography variant="h2" sx={{ mb: 4 }}>
              E-commerce deshabilitado
            </Typography>
            <Typography variant="h6">
              El Portal de Compras de {sellerInfo.seller.businessName} se
              encuentra deshabilitado por el momento.
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
