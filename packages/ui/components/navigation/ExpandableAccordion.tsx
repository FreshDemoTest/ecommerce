import type { SxProps } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";

interface ExpandableAccordionProps {
  summary: React.ReactNode;
  children: React.ReactNode;
  sx?: SxProps;
}

export function ExpandableAccordion({
  summary,
  children,
  sx,
}: ExpandableAccordionProps): JSX.Element {
  return (
    <Accordion sx={{ mb: 2, py: 1, ...sx }}>
      <AccordionSummary expandIcon={<ExpandMore />}>{summary}</AccordionSummary>

      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}
