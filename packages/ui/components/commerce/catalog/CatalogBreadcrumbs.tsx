import { Breadcrumbs, useTheme } from "@mui/material";
import Link from "next/link";

interface SectionProps {
  name: string;
  url: string;
  children?: SectionProps;
}

interface BreadcrumbsProps {
  catalogUrl?: string;
  section?: SectionProps;
}

export function CatalogBreadcrumbs({
  catalogUrl = "/catalog/list",
  section,
}: BreadcrumbsProps): JSX.Element {
  const theme = useTheme();

  const textColor = theme.palette.primary.dark;
  return (
    <Breadcrumbs
      separator={
        <span
          style={{
            color: textColor,
            fontWeight: theme.typography.fontWeightBold,
          }}
        >
          {`>`}
        </span>
      }
      sx={{
        px: 2,
        color: textColor,
        borderRadius: "4px",
      }}
      aria-label="catalog-breadcrumb"
    >
      <Link
        href={catalogUrl}
        style={{
          fontWeight: theme.typography.fontWeightMedium,
          color: textColor,
          textTransform: "capitalize",
        }}
      >
        Catálogo
      </Link>
      {section ? (
        <Link
          href={section.url}
          style={{
            textDecoration: "underline",
            color: textColor,
            textTransform: "capitalize",
          }}
        >
          {section.name}
        </Link>
      ) : null}
      {section?.children ? (
        <Link
          href={section.children.url}
          style={{
            textDecoration: "underline",
            color: textColor,
            textTransform: "capitalize",
          }}
        >
          {section.children.name}
        </Link>
      ) : null}
    </Breadcrumbs>
  );
}
