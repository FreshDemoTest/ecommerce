// next
import NextLink from "next/link";
// @mui
import {
  Link,
  ListItemText,
  styled,
  ListItem,
  ListItemButton,
  alpha,
  useTheme,
  ListItemIcon,
  Box,
} from "@mui/material";
import type { Theme } from "@mui/material";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";

// ----------------------------------------------------------------------

const NAVBAR_ITEM = 22;
const DASHBOARD_ITEM_ROOT_HEIGHT = 48;

const ListItemTextStyle = styled(ListItemText, {
  shouldForwardProp: (prop) => prop !== "isCollapse",
})(({ isCollapse, theme }: { isCollapse: boolean; theme: Theme }) => ({
  whiteSpace: "nowrap",
  transition: theme.transitions.create(["width", "opacity"], {
    duration: theme.transitions.duration.shorter,
  }),
  ...(isCollapse && {
    width: 0,
    opacity: 0,
  }),
}));

function ListItemIconStyle({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <ListItemIcon
      sx={{
        width: NAVBAR_ITEM,
        height: NAVBAR_ITEM,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "& svg": { width: "100%", height: "100%" },
      }}
    >
      {children}
    </ListItemIcon>
  );
}

interface ListItemStyleProps {
  activeRoot?: boolean;
  activeSub?: boolean;
  subItem?: boolean;
  otherProps?: any;
  children: React.ReactNode;
}

function ListItemStyle({
  activeRoot = false,
  activeSub = false,
  subItem = false,
  children,
  ...otherProps
}: ListItemStyleProps): JSX.Element {
  const theme = useTheme();
  return (
    <ListItemButton
      sx={{
        ...theme.typography.body2,
        position: "relative",
        height: DASHBOARD_ITEM_ROOT_HEIGHT,
        textTransform: "capitalize",
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1.5),
        marginBottom: theme.spacing(0.5),
        color: theme.palette.text.secondary,
        // activeRoot
        ...(activeRoot && {
          ...theme.typography.subtitle2,
          color: theme.palette.primary.main,
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity
          ),
        }),
        // activeSub
        ...(activeSub && {
          ...theme.typography.subtitle2,
          color: theme.palette.info.main,
        }),
        // subItem
        ...(subItem && {
          height: "auto",
        }),
      }}
      {...otherProps}
    >
      {children}
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function isExternalLink(path: string): boolean {
  return path.includes("http");
}

export interface SubNavOptions {
  title: string;
  path: string;
  children?: SubNavOptions[];
}

interface FilterItemRootProps {
  active: boolean;
  open?: boolean;
  isCollapse: boolean;
  onOpen?: () => void;
  item: {
    title: string;
    path: string;
    children?: SubNavOptions[];
  };
}

export function FilterItemRoot({
  item,
  isCollapse,
  open = false,
  active,
  onOpen,
}: FilterItemRootProps): JSX.Element {
  const { title, path, children } = item;
  const theme = useTheme();
  const MAX_TITLE_LENGTH = 30;

  const renderContent = (
    <>
      <ListItemTextStyle
        disableTypography
        theme={theme}
        primary={
          title.length < MAX_TITLE_LENGTH
            ? title
            : `${title.slice(0, MAX_TITLE_LENGTH)}...`
        }
        isCollapse={isCollapse}
      />
      {!isCollapse && <>{children ? <ArrowIcon open={open} /> : null}</>}
    </>
  );

  if (children) {
    return (
      <ListItemStyle activeRoot={active} {...{ onClick: onOpen }}>
        {renderContent}
      </ListItemStyle>
    );
  }

  return isExternalLink(path) ? (
    <ListItem component={Link} href={path} target="_blank" rel="noopener">
      {renderContent}
    </ListItem>
  ) : (
    <NextLink href={path} passHref>
      <ListItemStyle activeRoot={active}>{renderContent}</ListItemStyle>
    </NextLink>
  );
}

// ----------------------------------------------------------------------

interface FilterItemSubProps {
  active: boolean;
  open?: boolean;
  onOpen?: () => void;
  item: SubNavOptions;
}

export function FilterItemSub({
  item,
  open = false,
  active = false,
  onOpen,
}: FilterItemSubProps): JSX.Element {
  const { title, path, children } = item;

  const renderContent = (
    <>
      <DotIcon active={active} />
      <ListItemText disableTypography primary={title} />
      {/* {info && info} */}
      {children ? <ArrowIcon open={open} /> : null}
    </>
  );

  if (children) {
    return (
      <ListItemStyle activeSub={active} subItem {...{ onClick: onOpen }}>
        {renderContent}
      </ListItemStyle>
    );
  }

  return isExternalLink(path) ? (
    <ListItemStyle
      subItem
      {...{ component: Link, href: path, target: "_blank", rel: "noopener" }}
    >
      {renderContent}
    </ListItemStyle>
  ) : (
    <NextLink href={path} passHref>
      <ListItemStyle activeSub={active} subItem>
        {renderContent}
      </ListItemStyle>
    </NextLink>
  );
}

// ----------------------------------------------------------------------

interface DotIconProps {
  active: boolean;
}

export function DotIcon({ active }: DotIconProps): JSX.Element {
  return (
    <ListItemIconStyle>
      <Box
        component="span"
        sx={{
          width: 4,
          height: 4,
          borderRadius: "50%",
          bgcolor: "text.disabled",
          transition: (theme: Theme) =>
            theme.transitions.create("transform", {
              duration: theme.transitions.duration.shorter,
            }),
          ...(active && {
            transform: "scale(2)",
            bgcolor: "info.main",
          }),
        }}
      />
    </ListItemIconStyle>
  );
}

// ----------------------------------------------------------------------

interface ArrowIconProps {
  open: boolean;
}

export function ArrowIcon({ open }: ArrowIconProps): JSX.Element {
  return (
    <>
      {open ? (
        <KeyboardArrowDownOutlinedIcon sx={{ width: 16, height: 16, ml: 1 }} />
      ) : (
        <KeyboardArrowRightOutlinedIcon sx={{ width: 16, height: 16, ml: 1 }} />
      )}
    </>
  );
}
