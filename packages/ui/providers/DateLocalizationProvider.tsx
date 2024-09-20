"use client";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";

export function DateLocalizationProvider({
  locale,
  children,
}: {
  locale: any;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      localeText={{ start: "Selecciona una fecha" }}
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      adapterLocale={locale}
    >
      {children}
    </LocalizationProvider>
  );
}
