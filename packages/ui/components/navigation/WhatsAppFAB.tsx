import { Fab, type SxProps } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

interface WhatsAppFABProps {
  positionObject?: SxProps;
  active: boolean;
  sendTo: string;
}

export function WhatsAppFAB({
  positionObject = { bottom: 16, right: 16 },
  active,
  sendTo,
}: WhatsAppFABProps): JSX.Element {
  const WA_CTA = `https://api.whatsapp.com/send?phone=${sendTo}&text=Hola,%20me%20gustaría%20solicitar%20mas%20información%20de%20sus%20productos.`;

  return (
    <Fab
      sx={{
        ...positionObject,
        position: "fixed",
        backgroundColor: "#23D366",
        visibility: active ? "visible" : "hidden",
      }}
      aria-label="whatsapp-soporte"
      onClick={() => {
        window.open(WA_CTA, "_blank", "noopener,noreferrer");
      }}
    >
      <WhatsAppIcon fontSize="large" sx={{ color: "common.white" }} />
    </Fab>
  );
}
