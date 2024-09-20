// material
import { forwardRef } from "react";
import { Dialog, Slide } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { SxProps } from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";

// ----------------------------------------------------------------------

const deskModalWidth = "25vw";
const mobileModalWidth = "85vw";

const FromRightTransition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const FromLeftTransition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="right" ref={ref} {...props} />;
});

// ----------------------------------------------------------------------

interface MenuPopoverProps {
  open: boolean;
  onClose: () => void;
  children: any;
  sx?: SxProps;
  transitionStart?: "left" | "right";
  other?: any[];
}

export function MenuPopover({
  open,
  onClose,
  children,
  sx,
  transitionStart = "right",
  ...other
}: MenuPopoverProps): JSX.Element {
  const theme = useTheme();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={
        transitionStart === "right" ? FromRightTransition : FromLeftTransition
      }
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: transitionStart === "right" ? "flex-end" : "flex-start",
        padding: 0,
        "& .MuiDialog-paper": {
          overflowY: "visible",
          margin: 0,
          borderRadius: 0,
          width: deskModalWidth,
          maxHeight: "100vh",
          height: "100vh",
          [theme.breakpoints.down("md")]: {
            width: mobileModalWidth,
          },
        },
        ...sx,
      }}
      {...other}
    >
      {children}
    </Dialog>
  );
}
