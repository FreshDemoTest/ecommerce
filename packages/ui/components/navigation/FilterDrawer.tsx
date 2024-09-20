"use client";

import { useState } from "react";
import {
  List,
  Collapse,
  Box,
  Button,
  IconButton,
  useTheme,
  Typography,
} from "@mui/material";
import type { SxProps } from "@mui/material";
import FilterIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import { MenuPopover } from "../MenuPopover";
import { FilterItemRoot, FilterItemSub } from "./FilterItem";
import type { SubNavOptions } from "./FilterItem";

// ----------------------------------------------------------------------

function getActive(listPath: string, categ: string): boolean {
  const sparams = new URLSearchParams(listPath.split("?").reverse()[0]);
  const _search = (sparams.get("search") || "").replaceAll("+", " ");
  if (!_search) {
    return false;
  } else if (_search === categ) {
    return true;
  }
  return false;
}

// ----------------------------------------------------------------------

interface FilterListRootProps {
  currentCateg: string;
  isCollapse: boolean;
  list: {
    title: string;
    path: string;
    children?: SubNavOptions[];
  };
}

function FilterListRoot({
  currentCateg,
  list,
  isCollapse,
}: FilterListRootProps): JSX.Element {
  const active = getActive(list.path, currentCateg);
  const activeSub = list.children
    ? list.children
        .map((c) => getActive(c.path, currentCateg))
        .reduce((a, b) => a || b, false)
    : false;
  const activeSubSub = list.children
    ? list.children
        .flatMap((c) => c.children || [])
        .map((c) => getActive(c.path, currentCateg))
        .reduce((a, b) => a || b, false)
    : false;

  const [open, setOpen] = useState(active || activeSub || activeSubSub);

  const hasChildren = list.children;

  if (hasChildren) {
    return (
      <>
        <FilterItemRoot
          item={list}
          isCollapse={isCollapse}
          active={active || activeSub || activeSubSub}
          open={open}
          onOpen={() => {
            setOpen(!open);
          }}
        />

        {!isCollapse && (
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {(list.children || []).map((item) => (
                <NavListSub
                  key={item.title + item.path}
                  currentCateg={currentCateg}
                  list={item}
                />
              ))}
            </List>
          </Collapse>
        )}
      </>
    );
  }

  return <FilterItemRoot item={list} active={active} isCollapse={isCollapse} />;
}

// ----------------------------------------------------------------------

interface NavListSubProps {
  currentCateg: string;
  list: SubNavOptions;
}

function NavListSub({ currentCateg, list }: NavListSubProps): JSX.Element {
  const active = getActive(list.path, currentCateg);
  const activeSub = list.children
    ? list.children
        .map((c) => getActive(c.path, currentCateg))
        .reduce((a, b) => a || b, false)
    : false;

  const [open, setOpen] = useState(active || activeSub);

  const hasChildren = Boolean(list.children);

  if (hasChildren) {
    return (
      <>
        <FilterItemSub
          item={list}
          onOpen={() => {
            setOpen(!open);
          }}
          open={open}
          active={active || activeSub}
        />

        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 3 }}>
            {(list.children || []).map((item) => (
              <FilterItemSub
                key={item.title + item.path}
                item={item}
                active={getActive(item.path, currentCateg)}
              />
            ))}
          </List>
        </Collapse>
      </>
    );
  }

  return <FilterItemSub item={list} active={active || activeSub} />;
}

// ----------------------------------------------------------------------

/**
 * Data input example
 * const menuElements = [
    {
      title: "Categoría 1",
      path: `/catalog/list?search=${urlFormat("Categoría 1", "+")}`,
      children: [
        {
          title: "Subcategoría 1",
          path: `/catalog/list?search=${urlFormat("Subcategoría 1", "+")}`,
          children: [
            {
              title: "Subcategoría 1.1",
              path: `/catalog/list?search=${urlFormat(
                "Subcategoría 1.1",
                "+"
              )}`,
            },
            {
              title: "Subcategoría 1.2",
              path: `/catalog/list?search=${urlFormat(
                "Subcategoría 1.2",
                "+"
              )}`,
            },
            {
              title: "Subcategoría 1.3",
              path: `/catalog/list?search=${urlFormat(
                "Subcategoría 1.3",
                "+"
              )}`,
            },
          ],
        },
      ],
    },
    {
      title: "Categoría 2",
      path: `/catalog/list?search=${urlFormat("Categoría 2", "+")}`,
      children: [
        {
          title: "Subcategoría 2",
          path: `/catalog/list?search=${urlFormat("Subcategoría 2", "+")}`,
        },
      ],
    },
  ];
 */
export interface FilterDrawerProps {
  currentCateg: string;
  navOptions: {
    title: string;
    path: string;
    children?: SubNavOptions[];
  }[];
  isCollapse?: boolean;
  sx?: SxProps;
}

export function DesktopFilterDrawer({
  currentCateg,
  navOptions,
  isCollapse = false,
  sx,
}: FilterDrawerProps): JSX.Element {
  return (
    <Box sx={sx}>
      <List disablePadding>
        {navOptions.map((list) => (
          <FilterListRoot
            currentCateg={currentCateg}
            key={list.title + list.path}
            list={list}
            isCollapse={isCollapse}
          />
        ))}
      </List>
    </Box>
  );
}

export function MobileFilterDrawer({
  currentCateg,
  navOptions,
  isCollapse = false,
  sx,
  btnSx,
  withIcon = true,
  btnMsg = "Ver Filtros",
  alignBtn = "flex-end",
  btnType = "text",
  dialogTitleMsg = "Filtros",
  transitionStart = "right",
}: FilterDrawerProps & {
  btnSx?: SxProps;
  withIcon?: boolean;
  btnMsg?: string;
  alignBtn?: "flex-end" | "flex-start";
  btnType?: "contained" | "outlined" | "text";
  dialogTitleMsg?: string;
  transitionStart?: "left" | "right";
}): JSX.Element {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", justifyContent: alignBtn }}>
      <Button
        variant={btnType}
        onClick={() => {
          setOpen(true);
        }}
        sx={{
          mr: 2,
          ...btnSx,
        }}
        endIcon={withIcon ? <FilterIcon /> : null}
      >
        {btnMsg}
      </Button>

      <MenuPopover
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        transitionStart={transitionStart}
        sx={{
          "& .MuiDialog-paper": {
            overflowY: "visible",
            marginTop: "0vh",
            marginRight: "4vw",
            width: "20vw",
            maxHeight: "90vh",
            minHeight: "40vh",
            [theme.breakpoints.down("md")]: {
              width: "85vw",
            },
          },
        }}
      >
        <Box sx={{ m: 0, pl: 2, pt: 1, pr: 2, mb: 2.5 }}>
          <Typography sx={{ mt: 2, ...theme.typography.h6 }}>
            {dialogTitleMsg}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={() => {
              setOpen(false);
            }}
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
        <Box sx={{ pl: 3, overflowY: "scroll" }}>
          <DesktopFilterDrawer
            currentCateg={currentCateg}
            navOptions={navOptions}
            isCollapse={isCollapse}
            sx={sx}
          />
        </Box>
      </MenuPopover>
    </Box>
  );
}
