"use client";

import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import Link from "next/link";
import {
  AppBar,
  Badge,
  Box,
  Divider,
  Grid,
  Hidden,
  IconButton,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LoginIcon from "@mui/icons-material/Login";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import CancelIcon from "@mui/icons-material/Cancel";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ViewListIcon from "@mui/icons-material/ViewList";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CategoryIcon from "@mui/icons-material/Category";
import HomeIcon from "@mui/icons-material/Home";
import AppsIcon from "@mui/icons-material/Apps";
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import { type SvgIconComponent } from "@mui/icons-material";
import { Logo } from "../Logo";
import { MenuPopover } from "../MenuPopover";

// ----------------------------------------------------------------------

const menuIconMap: Record<string, SvgIconComponent> = {
  generic: AppsIcon,
  exit: ExitToAppIcon,
  login: LoginIcon,
  menu: MenuIcon,
  search: SearchIcon,
  close: CloseIcon,
  cancel: CancelIcon,
  account: AccountCircle,
  viewList: ViewListIcon,
  shoppingCart: ShoppingCartIcon,
  category: CategoryIcon,
  home: HomeIcon,
  docTemplate: DocumentScannerIcon,
};

// ----------------------------------------------------------------------

const HOME_LINK = "/";
const CATALOG_LINK = "/catalog/list";
const PROFILE_LINK = "/user/profile";
const ORDEN_HISTORY_LINK = "/orden/history";
const LOGIN_LINK = "/login";

interface TopNavBarProps {
  logoSrc?: string;
  sellerName?: string;
  user?: {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    deleted?: boolean;
    isAuthenticated: boolean;
  };
  searchPlaceholder?: string;
  searchValue?: string;
  onChangeSearch: (s: string) => void;
  cartClick: () => void;
  cartItems?: number;
  showSearchBar?: boolean;
  showCartIcon?: boolean;
  logoutClick: () => void;
  withModalMenu?: boolean;
  additionalMenuItems?: {
    withAuth: boolean;
    icon: string;
    label: string;
    link: string;
  }[];
}

export function TopNavBar(tnProps: TopNavBarProps): JSX.Element {
  const {
    logoSrc,
    sellerName,
    user,
    searchPlaceholder,
    searchValue,
    onChangeSearch,
    cartClick,
    cartItems,
    showSearchBar = true,
    showCartIcon = true,
    logoutClick,
    withModalMenu = true,
  } = tnProps;
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (
    event: React.MouseEvent<HTMLElement>
  ): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleSearchWrapper = useDebouncedCallback((term: string) => {
    onChangeSearch(term);
  }, 300);

  const handleMenuClose = (): void => {
    setAnchorEl(null);
  };

  const menuId = "primary-search-account-menu";
  const renderModalMenu = (
    <MenuPopover
      open={isMenuOpen}
      onClose={handleMenuClose}
      sx={{
        "& .MuiDialog-paper": {
          overflowY: "visible",
          marginTop: "-10vh",
          marginRight: "1vw",
          width: "20vw",
          maxHeight: "80vh",
          height: "80vh",
          [theme.breakpoints.down("md")]: {
            width: "70vw",
          },
        },
      }}
    >
      <Box sx={{ m: 0, pl: 2, pt: 1, pr: 2 }}>
        <Typography variant="h6" sx={{ mt: 2 }}>
          {sellerName || ""}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5, ml: 1.5 }}
        >
          {user?.firstName}, {user?.lastName} <br />
          {user?.email}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleMenuClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ pl: 2 }}>
        <Divider sx={{ mt: 1, mb: 2 }} />

        <Link
          href={HOME_LINK}
          passHref
          style={{ color: theme.palette.text.primary }}
        >
          <MenuItem onClick={handleMenuClose}>
            <HomeIcon
              color="primary"
              fontSize="medium"
              sx={{ mr: theme.spacing(3) }}
            />

            <Typography variant="subtitle1">Página Inicio</Typography>
          </MenuItem>
        </Link>

        <Link
          href={CATALOG_LINK}
          passHref
          style={{ color: theme.palette.text.primary }}
        >
          <MenuItem onClick={handleMenuClose}>
            <CategoryIcon
              color="primary"
              fontSize="medium"
              sx={{ mr: theme.spacing(3) }}
            />
            <Typography variant="subtitle1">Catálogo</Typography>
          </MenuItem>
        </Link>

        {/* Additional Menu Items */}
        {(tnProps.additionalMenuItems || [])
          .filter((item) => !item.withAuth)
          .map((item) => {
            const IconComp = menuIconMap[item.icon] || menuIconMap.generic!;
            return (
              <Link
                key={item.link}
                href={item.link}
                passHref
                style={{ color: theme.palette.text.primary }}
              >
                <MenuItem onClick={handleMenuClose}>
                  <IconComp
                    color="primary"
                    fontSize="medium"
                    sx={{ mr: theme.spacing(3) }}
                  />
                  <Typography variant="subtitle1">{item.label}</Typography>
                </MenuItem>
              </Link>
            );
          })}

        {user?.isAuthenticated ? (
          <>
            <Link
              href={PROFILE_LINK}
              passHref
              style={{ color: theme.palette.text.primary }}
            >
              <MenuItem onClick={handleMenuClose}>
                <AccountCircle
                  color="primary"
                  fontSize="medium"
                  sx={{ mr: theme.spacing(3) }}
                />

                <Typography variant="subtitle1">Perfil</Typography>
              </MenuItem>
            </Link>
            <Link
              href={ORDEN_HISTORY_LINK}
              passHref
              style={{ color: theme.palette.text.primary }}
            >
              <MenuItem onClick={handleMenuClose}>
                <ViewListIcon
                  color="primary"
                  fontSize="medium"
                  sx={{ mr: theme.spacing(3) }}
                />

                <Typography variant="subtitle1">Mis Pedidos</Typography>
              </MenuItem>
            </Link>

            {/* Additional Menu Items with Auth */}
            {(tnProps.additionalMenuItems || [])
              .filter((item) => item.withAuth)
              .map((item) => {
                const IconComp = menuIconMap[item.icon] || menuIconMap.generic!;
                return (
                  <Link
                    key={item.link}
                    href={item.link}
                    passHref
                    style={{ color: theme.palette.text.primary }}
                  >
                    <MenuItem onClick={handleMenuClose}>
                      <IconComp
                        color="primary"
                        fontSize="medium"
                        sx={{ mr: theme.spacing(3) }}
                      />
                      <Typography variant="subtitle1">{item.label}</Typography>
                    </MenuItem>
                  </Link>
                );
              })}
          </>
        ) : null}

        {!user?.isAuthenticated ? (
          <Link
            href={LOGIN_LINK}
            passHref
            style={{ color: theme.palette.text.primary }}
          >
            <MenuItem onClick={handleMenuClose}>
              <LoginIcon
                color="primary"
                fontSize="medium"
                sx={{ mr: theme.spacing(3) }}
              />

              <Typography variant="subtitle1">Iniciar Sesión</Typography>
            </MenuItem>
          </Link>
        ) : null}

        {/* Log out */}
        {user?.isAuthenticated ? (
          <Box
            sx={{
              position: "absolute",
              bottom: theme.spacing(3),
              width: "100%",
            }}
          >
            <Divider sx={{ mb: 2 }} />
            <MenuItem
              onClick={() => {
                handleMenuClose();
                logoutClick();
              }}
            >
              <ExitToAppIcon
                color="primary"
                fontSize="small"
                sx={{ mr: theme.spacing(2) }}
              />
              Cerrar Sesión
            </MenuItem>
          </Box>
        ) : null}
      </Box>
    </MenuPopover>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Grid container>
            <Grid item xs={3} md={3}>
              {/* Logo section */}
              {!logoSrc && (
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{
                    display: { xs: "none", sm: "block" },
                    px: 3,
                    color: theme.palette.getContrastText(
                      theme.palette.primary.main
                    ),
                  }}
                >
                  {sellerName || ""}
                </Typography>
              )}

              {logoSrc ? (
                <>
                  <Hidden smUp>
                    {/* Mobile */}
                    <Link href="/">
                      <Logo
                        src={logoSrc}
                        height={40}
                        width={40 * 3.5}
                        sx={{
                          marginTop: theme.spacing(0.8),
                          marginLeft: theme.spacing(-5.6),
                        }}
                      />
                    </Link>
                  </Hidden>
                  <Hidden smDown>
                    {/* Desktop ideally 3.5:1 ratio*/}
                    <Link href="/">
                      <Logo
                        src={logoSrc}
                        height={64}
                        width={224}
                        sx={{
                          marginRight: theme.spacing(2),
                          marginLeft: theme.spacing(2),
                        }}
                      />
                    </Link>
                  </Hidden>
                </>
              ) : null}
            </Grid>
            <Grid item xs={7} md={6}>
              <Box
                sx={{ display: "flex", justifyContent: "right", width: "85%" }}
              >
                {showSearchBar ? (
                  <OutlinedInput
                    id="search-input"
                    placeholder={searchPlaceholder}
                    defaultValue={searchValue}
                    onChange={(e) => {
                      handleSearchWrapper(e.target.value);
                    }}
                    startAdornment={
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        {searchValue ? (
                          <IconButton
                            aria-label="close"
                            onClick={() => {
                              onChangeSearch("");
                            }}
                            edge="end"
                            size="small"
                          >
                            <CancelIcon color="disabled" />
                          </IconButton>
                        ) : null}
                      </InputAdornment>
                    }
                    sx={{
                      borderColor: theme.palette.background.paper,
                      backgroundColor: theme.palette.common.white,
                      fontWeight: theme.typography.fontWeightMedium,
                      boxShadow: theme.shadows[1],
                      width: "100%",
                      height: theme.spacing(5),
                      marginTop: theme.spacing(1.5),
                      [theme.breakpoints.down("md")]: {
                        fontSize: theme.typography.body2.fontSize,
                        marginTop: theme.spacing(1),
                      },
                    }}
                    inputProps={{
                      "aria-label": "weight",
                    }}
                  />
                ) : null}
              </Box>
            </Grid>

            <Grid item xs={2} md={3}>
              {/* cart  */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: theme.spacing(1),
                }}
              >
                {showCartIcon ? (
                  <IconButton
                    size="large"
                    edge="end"
                    onClick={cartClick}
                    color="inherit"
                  >
                    <Badge
                      badgeContent={cartItems}
                      color="error"
                      sx={{
                        "& .MuiBadge-badge": {
                          padding: theme.spacing(0),
                        },
                      }}
                    >
                      <ShoppingCartIcon />
                    </Badge>
                  </IconButton>
                ) : null}
                {/* pop up menu */}
                {withModalMenu ? (
                  <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                  >
                    <MenuIcon />
                  </IconButton>
                ) : null}
              </Box>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      {withModalMenu ? renderModalMenu : null}
    </Box>
  );
}

export function VanillaTopNavBar(tnProps: TopNavBarProps): JSX.Element {
  const {
    logoSrc,
    sellerName,
    user,
    searchPlaceholder,
    searchValue,
    onChangeSearch,
    cartClick,
    cartItems,
    showSearchBar = true,
    showCartIcon = true,
    logoutClick,
    withModalMenu = true,
  } = tnProps;
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (
    event: React.MouseEvent<HTMLElement>
  ): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleSearchWrapper = useDebouncedCallback((term: string) => {
    onChangeSearch(term);
  }, 300);

  const handleMenuClose = (): void => {
    setAnchorEl(null);
  };

  const menuId = "primary-search-account-menu";
  const renderModalMenu = (
    <MenuPopover
      open={isMenuOpen}
      onClose={handleMenuClose}
      sx={{
        "& .MuiDialog-paper": {
          overflowY: "visible",
          marginTop: "-10vh",
          marginRight: "1vw",
          width: "20vw",
          maxHeight: "80vh",
          height: "80vh",
          [theme.breakpoints.down("md")]: {
            width: "70vw",
          },
        },
      }}
    >
      <Box sx={{ m: 0, pl: 2, pt: 1, pr: 2 }}>
        <Typography variant="h6" sx={{ mt: 2 }}>
          {sellerName || ""}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5, ml: 1.5 }}
        >
          {user?.firstName}, {user?.lastName} <br />
          {user?.email}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleMenuClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ pl: 2 }}>
        <Divider sx={{ mt: 1, mb: 2 }} />

        <Link
          href={HOME_LINK}
          passHref
          style={{ color: theme.palette.text.disabled }}
        >
          <MenuItem onClick={handleMenuClose}>
            <HomeIcon
              color="disabled"
              fontSize="medium"
              sx={{ mr: theme.spacing(3) }}
            />

            <Typography variant="subtitle1">Página Inicio</Typography>
          </MenuItem>
        </Link>

        <Link
          href={CATALOG_LINK}
          passHref
          style={{ color: theme.palette.text.disabled }}
        >
          <MenuItem onClick={handleMenuClose}>
            <CategoryIcon
              color="disabled"
              fontSize="medium"
              sx={{ mr: theme.spacing(3) }}
            />
            <Typography variant="subtitle1">Catálogo</Typography>
          </MenuItem>
        </Link>

        {user?.isAuthenticated ? (
          <Link
            href={PROFILE_LINK}
            passHref
            style={{ color: theme.palette.text.disabled }}
          >
            <MenuItem onClick={handleMenuClose}>
              <AccountCircle
                color="disabled"
                fontSize="medium"
                sx={{ mr: theme.spacing(3) }}
              />

              <Typography variant="subtitle1">Perfil</Typography>
            </MenuItem>
          </Link>
        ) : null}

        {!user?.isAuthenticated ? (
          <Link
            href={LOGIN_LINK}
            passHref
            style={{ color: theme.palette.text.disabled }}
          >
            <MenuItem onClick={handleMenuClose}>
              <LoginIcon
                color="disabled"
                fontSize="medium"
                sx={{ mr: theme.spacing(3) }}
              />

              <Typography variant="subtitle1">Iniciar Sesión</Typography>
            </MenuItem>
          </Link>
        ) : null}

        {user?.isAuthenticated ? (
          <Box
            sx={{
              position: "absolute",
              bottom: theme.spacing(3),
              width: "100%",
            }}
          >
            <Divider sx={{ mb: 2 }} />
            <MenuItem
              onClick={() => {
                handleMenuClose();
                logoutClick();
              }}
            >
              <ExitToAppIcon
                color="disabled"
                fontSize="small"
                sx={{ mr: theme.spacing(2) }}
              />
              Cerrar Sesión
            </MenuItem>
          </Box>
        ) : null}
      </Box>
    </MenuPopover>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Grid container>
            <Grid item xs={6} md={3}>
              {/* Logo section */}
              {!logoSrc && (
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{
                    display: { xs: "none", sm: "block" },
                    px: 3,
                    color: theme.palette.getContrastText(
                      theme.palette.primary.main
                    ),
                  }}
                >
                  {sellerName || ""}
                </Typography>
              )}

              {logoSrc ? (
                <>
                  <Hidden smUp>
                    {/* Mobile */}
                    <Link href="/">
                      <Logo
                        src={logoSrc}
                        height={46}
                        width={48 * 3.5}
                        sx={{
                          marginLeft: theme.spacing(-2),
                        }}
                      />
                    </Link>
                  </Hidden>
                  <Hidden smDown>
                    {/* Desktop ideally 3.5:1 ratio*/}
                    <Link href="/">
                      <Logo src={logoSrc} height={72} width={72 * 3.5} />
                    </Link>
                  </Hidden>
                </>
              ) : null}
            </Grid>
            <Grid item xs={4} md={6}>
              <Box
                sx={{ display: "flex", justifyContent: "right", width: "85%" }}
              >
                {showSearchBar ? (
                  <OutlinedInput
                    id="search-input"
                    placeholder={searchPlaceholder}
                    defaultValue={searchValue}
                    onChange={(e) => {
                      handleSearchWrapper(e.target.value);
                    }}
                    startAdornment={
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        {searchValue ? (
                          <IconButton
                            aria-label="close"
                            onClick={() => {
                              onChangeSearch("");
                            }}
                            edge="end"
                            size="small"
                          >
                            <CancelIcon color="disabled" />
                          </IconButton>
                        ) : null}
                      </InputAdornment>
                    }
                    sx={{
                      borderColor: theme.palette.background.paper,
                      backgroundColor: theme.palette.common.white,
                      fontWeight: theme.typography.fontWeightMedium,
                      boxShadow: theme.shadows[1],
                      width: "100%",
                      height: theme.spacing(5),
                      marginTop: theme.spacing(1.5),
                      [theme.breakpoints.down("md")]: {
                        fontSize: theme.typography.body2.fontSize,
                        marginTop: theme.spacing(1),
                      },
                    }}
                    inputProps={{
                      "aria-label": "weight",
                    }}
                  />
                ) : null}
              </Box>
            </Grid>

            <Grid item xs={2} md={3}>
              {/* cart  */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: theme.spacing(1),
                }}
              >
                {showCartIcon ? (
                  <IconButton
                    size="large"
                    edge="end"
                    onClick={cartClick}
                    color="inherit"
                  >
                    <Badge
                      badgeContent={cartItems}
                      color="error"
                      sx={{
                        "& .MuiBadge-badge": {
                          padding: theme.spacing(0),
                        },
                      }}
                    >
                      <ShoppingCartIcon />
                    </Badge>
                  </IconButton>
                ) : null}
                {/* pop up menu */}
                {withModalMenu ? (
                  <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                  >
                    <MenuIcon />
                  </IconButton>
                ) : null}
              </Box>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      {withModalMenu ? renderModalMenu : null}
    </Box>
  );
}
