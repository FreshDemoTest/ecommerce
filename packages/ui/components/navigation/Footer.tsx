"use client";
import Link from "next/link";
import {
  Box,
  Button,
  Container,
  Grid,
  Hidden,
  type SxProps,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import WebIcon from "@mui/icons-material/Web";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import { Logo } from "../Logo";

// ----------------------------------------------------------------------

const CTA_LINK = "/catalog/list";
const ABOUT_LINK = "/about";
const CATALOG_LINK = "/catalog/list";
const TYCS_LINK = "/terminos-y-condiciones";
const PRIVACY_LINK = "/aviso-de-privacidad";

const SOCIAL_LOGOS: Record<string, (s: SxProps) => React.ReactNode> = {
  instagram: (sxps) => <InstagramIcon sx={sxps} />,
  facebook: (sxps) => <FacebookIcon sx={sxps} />,
  web: (sxps) => <WebIcon sx={sxps} />,
};

// ----------------------------------------------------------------------

const FooterRootDiv = styled("div")(({ theme }) => ({
  position: "relative",
  bottom: 0,
  width: "100%",
  textAlign: "center",
  padding: theme.spacing(5, 0),
  [theme.breakpoints.up("md")]: {
    textAlign: "left",
  },
}));

const FooterContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(0),
}));

// ----------------------------------------------------------------------

export interface FooterProps {
  logoSrc?: string;
  sellerName: string;
  supportContact: {
    phone: string;
    email?: string;
    isPhoneWA: boolean;
  };
  msg?: string;
  ctaMsg?: string;
  additionalLinks?: {
    href: string;
    label: string;
    icon?: string;
  }[];
}

export function Footer({
  logoSrc,
  sellerName,
  msg = `¿Listo para empezar?`,
  ctaMsg = `Iniciar Sesión`,
  supportContact,
  additionalLinks,
}: FooterProps): JSX.Element {
  const theme = useTheme();
  const bgColor = theme.palette.primary.main;
  const bgContrastColor = theme.palette.getContrastText(bgColor);
  const ctaColor = theme.palette.secondary.main;

  // hrefs
  const WA_CONTACT_LINK = `https://wa.me/${supportContact.phone}`;
  const CALL_CONTACT_LINK = `callto:+${supportContact.phone}`;
  const MAILTO_CONTACT_LINK = `mailto:${supportContact.email}`;

  return (
    <FooterRootDiv sx={{ bgcolor: bgColor }}>
      {/* Content */}
      <FooterContainer maxWidth="lg">
        <Grid container>
          <Grid item xs={1} md={1} />
          <Grid item xs={11} md={7}>
            {/* Logo */}
            {/* eslint-disable-next-line react/jsx-no-leaked-render -- valid */}
            {logoSrc && (
              <Box sx={{ maxWidth: 100 }}>
                <Hidden smUp>
                  {/* Mobile */}
                  <Link href="/">
                    <Logo
                      src={logoSrc}
                      height={82}
                      width={287}
                      sx={{
                        marginLeft: theme.spacing(1),
                      }}
                    />
                  </Link>
                </Hidden>
                <Hidden smDown>
                  {/* Desktop  3.5:1 ratio*/}
                  <Link href="/">
                    <Logo
                      src={logoSrc}
                      height={82}
                      width={287}
                      sx={{
                        marginLeft: theme.spacing(4),
                      }}
                    />
                  </Link>
                </Hidden>
              </Box>
            )}
            <Box sx={{ ml: { xs: 0, md: 4 } }}>
              {/* Message */}
              <Typography
                variant="h6"
                sx={{
                  mb: 0,
                  mt: { xs: 4, md: 2 },
                  color: theme.palette.getContrastText(bgColor),
                }}
                align="left"
              >
                {msg}
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "left" }}>
                <Link href={CTA_LINK} passHref>
                  <Button
                    size="large"
                    variant="contained"
                    sx={{
                      mt: { xs: 3, md: 3 },
                      mb: { xs: 6, md: 0 },
                      bgcolor: ctaColor,
                      color: theme.palette.getContrastText(ctaColor),
                    }}
                  >
                    {ctaMsg}
                  </Button>
                </Link>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            {/* About */}
            <Grid container>
              <Grid item xs={6} md={12}>
                <Typography variant="h6" sx={{ mb: 2, color: bgContrastColor }}>
                  Acerca de
                </Typography>
                {additionalLinks && additionalLinks.length > 0
                  ? additionalLinks.map((alink) => (
                    <Typography
                      key={alink.href}
                      variant="body2"
                      sx={{ color: bgContrastColor, mb: 1 }}
                    >
                      <Link href={alink.href} style={{ color: ctaColor }}>
                        {alink.label}
                      </Link>
                    </Typography>
                  ))
                  : null}
                <Typography
                  variant="body2"
                  sx={{ color: bgContrastColor, mb: 1 }}
                >
                  <Link href={ABOUT_LINK} style={{ color: ctaColor }}>
                    Nosotros
                  </Link>
                </Typography>
                <Typography variant="body2" sx={{ color: bgContrastColor }}>
                  <Link href={CATALOG_LINK} style={{ color: ctaColor }}>
                    Catálogo
                  </Link>
                </Typography>
              </Grid>
              <Grid item xs={6} md={12}>
                <Typography
                  variant="h6"
                  sx={{ mt: { xs: 0, md: 2 }, mb: 2, color: bgContrastColor }}
                >
                  Contacto
                </Typography>
                <Box sx={{ display: "inline-block" }}>
                  {supportContact.isPhoneWA ? (
                    <Link href={WA_CONTACT_LINK} passHref>
                      <Button
                        sx={{
                          color: ctaColor,
                          fontWeight: theme.typography.fontWeightRegular,
                          textTransform: "none",
                        }}
                        variant="text"
                        startIcon={<WhatsAppIcon sx={{ color: ctaColor }} />}
                      >
                        WhatsApp
                      </Button>
                    </Link>
                  ) : null}
                  {!supportContact.isPhoneWA && (
                    <Link href={CALL_CONTACT_LINK} passHref>
                      <Button
                        sx={{
                          color: ctaColor,
                          fontWeight: theme.typography.fontWeightRegular,
                          textTransform: "none",
                        }}
                        variant="text"
                        startIcon={<LocalPhoneIcon sx={{ color: ctaColor }} />}
                      >
                        Tel. {supportContact.phone}
                      </Button>
                    </Link>
                  )}
                </Box>
                {supportContact.email ? (
                  <Typography variant="body2" sx={{ color: ctaColor }}>
                    <Link
                      href={MAILTO_CONTACT_LINK}
                      style={{ color: ctaColor }}
                    >
                      <Button
                        sx={{
                          color: ctaColor,
                          fontWeight: theme.typography.fontWeightRegular,
                          textTransform: "none",
                        }}
                        variant="text"
                        startIcon={<EmailIcon sx={{ color: ctaColor }} />}
                      >
                        {/* <u>{supportContact.email.slice(0, 21)}</u> */}
                        Correo Electrónico
                      </Button>
                    </Link>
                  </Typography>
                ) : null}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={1} />
        </Grid>
      </FooterContainer>

      {/* Copyright, T&C, Privacy */}
      <FooterContainer maxWidth="lg" sx={{ mt: 10 }}>
        <Grid container>
          <Grid item xs={12} md={1} />
          <Grid item xs={12} md={11}>
            <Typography
              variant="caption"
              style={{ marginRight: 5, color: bgContrastColor }}
            >
              {sellerName}&nbsp;{new Date().getFullYear()} &nbsp;|
            </Typography>
            <Typography variant="caption" style={{ color: bgContrastColor }}>
              &nbsp;{" "}
              <Link href={TYCS_LINK} style={{ color: ctaColor }}>
                Términos y Condiciones
              </Link>{" "}
              &nbsp;|&nbsp;
            </Typography>
            <Typography variant="caption">
              &nbsp;{" "}
              <Link href={PRIVACY_LINK} style={{ color: ctaColor }}>
                Aviso de privacidad
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </FooterContainer>
    </FooterRootDiv>
  );
}

export function VanillaFooter({
  logoSrc,
  sellerName,
  msg = `¿Listo para empezar?`,
  ctaMsg = `Iniciar Sesión`,
  supportContact,
  additionalLinks
}: FooterProps): JSX.Element {
  const theme = useTheme();
  const bgColor = theme.palette.primary.main;
  const bgContrastColor = theme.palette.getContrastText(bgColor);
  const ctaColor = theme.palette.secondary.main;

  // hrefs
  const WA_CONTACT_LINK = `https://wa.me/${supportContact.phone}`;
  const MAILTO_CONTACT_LINK = `mailto:${supportContact.email}`;

  return (
    <FooterRootDiv sx={{ bgcolor: bgColor }}>
      {/* Content */}
      <FooterContainer maxWidth="lg">
        <Grid container>
          <Grid item xs={1} md={1} />
          <Grid item xs={11} md={7}>
            {/* Logo */}
            {/* eslint-disable-next-line react/jsx-no-leaked-render -- valid */}
            {logoSrc && (
              <Box sx={{ maxWidth: 100 }}>
                <Hidden smUp>
                  {/* Mobile */}
                  <Link href="/">
                    <Logo
                      src={logoSrc}
                      height={72}
                      width={287}
                      sx={{
                        marginLeft: theme.spacing(1),
                      }}
                    />
                  </Link>
                </Hidden>
                <Hidden smDown>
                  {/* Desktop  3.5:1 ratio*/}
                  <Link href="/">
                    <Logo
                      src={logoSrc}
                      height={72}
                      width={287}
                      sx={{
                        marginLeft: theme.spacing(4),
                      }}
                    />
                  </Link>
                </Hidden>
              </Box>
            )}
            <Box sx={{ ml: { xs: 0, md: 4 } }}>
              {/* Message */}
              <Typography
                variant="h6"
                sx={{
                  mb: 0,
                  mt: { xs: 4, md: 2 },
                  pr: { xs: 2, md: 10 },
                  color: theme.palette.getContrastText(bgColor),
                }}
                align="left"
              >
                {msg}
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "left" }}>
                <Link href="/search" passHref>
                  <Button
                    size="large"
                    variant="contained"
                    sx={{
                      mt: { xs: 3, md: 3 },
                      mb: { xs: 6, md: 0 },
                      bgcolor: ctaColor,
                      color: theme.palette.getContrastText(ctaColor),
                    }}
                  >
                    {ctaMsg}
                  </Button>
                </Link>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            {/* About */}
            <Grid container>
              <Grid item xs={6} md={12}>
                <Typography variant="h6" sx={{ mb: 2, color: bgContrastColor }}>
                  Acerca de
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: bgContrastColor, mb: 1 }}
                >
                  <Link
                    href="https://alima.la/buscador"
                    style={{ color: ctaColor }}
                  >
                    Nosotros
                  </Link>
                </Typography>
              </Grid>
              <Grid item xs={6} md={12}>
                <Typography
                  variant="h6"
                  sx={{ mt: { xs: 0, md: 2 }, mb: 2, color: bgContrastColor }}
                >
                  Contacto
                </Typography>
                {additionalLinks && additionalLinks.length > 0
                  ? additionalLinks.map((alink) => {
                    const iconFn = SOCIAL_LOGOS[alink.icon || "web"] || (sxps => <WebIcon sx={sxps} />);
                    return (
                      <Box key={alink.href} >
                        <Link href={alink.href} passHref>
                          <Button
                            sx={{
                              color: ctaColor,
                              fontWeight: theme.typography.fontWeightRegular,
                              textTransform: "none",
                            }}
                            variant="text"
                            startIcon={iconFn({ color: ctaColor })}
                          >
                            {alink.label}
                          </Button>
                        </Link>
                      </Box>
                    );
                  }
                  )
                  : null}
                {supportContact.isPhoneWA ? (
                  <Box sx={{ display: "inline-block" }}>
                    <Link href={WA_CONTACT_LINK} passHref>
                      <Button
                        sx={{
                          color: ctaColor,
                          fontWeight: theme.typography.fontWeightRegular,
                          textTransform: "none",
                        }}
                        variant="text"
                        startIcon={<WhatsAppIcon sx={{ color: ctaColor }} />}
                      >
                        WhatsApp
                      </Button>
                    </Link>
                  </Box>
                ) : null}
                {supportContact.email ? (
                  <Typography variant="body2" sx={{ color: ctaColor }}>
                    <Link
                      href={MAILTO_CONTACT_LINK}
                      style={{ color: ctaColor }}
                    >
                      <Button
                        sx={{
                          color: ctaColor,
                          fontWeight: theme.typography.fontWeightRegular,
                          textTransform: "none",
                        }}
                        variant="text"
                        startIcon={<EmailIcon sx={{ color: ctaColor }} />}
                      >
                        <u>{supportContact.email}</u>
                      </Button>
                    </Link>
                  </Typography>
                ) : null}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={1} />
        </Grid>
      </FooterContainer>

      {/* Copyright, T&C, Privacy */}
      <FooterContainer maxWidth="lg" sx={{ mt: 10 }}>
        <Grid container>
          <Grid item xs={12} md={1} />
          <Grid item xs={12} md={11}>
            <Typography
              variant="caption"
              style={{ marginRight: 5, color: bgContrastColor }}
            >
              {sellerName}&nbsp;©&nbsp;Alima&nbsp;{new Date().getFullYear()}
            </Typography>
            <Typography variant="caption" style={{ color: bgContrastColor }}>
              &nbsp;{" "}
              {/* <Link href={TYCS_LINK} style={{ color: ctaColor }}>
                Términos y Condiciones
              </Link>{" "} */}
              &nbsp;|&nbsp;
            </Typography>
            <Typography variant="caption">
              &nbsp;{" "}
              <Link href={PRIVACY_LINK} style={{ color: ctaColor }}>
                Aviso de privacidad
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </FooterContainer>
    </FooterRootDiv >
  );
}
