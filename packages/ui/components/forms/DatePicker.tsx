"use client";

import {
  LocalizationProvider,
  StaticDatePicker as MuiStaticDatePicker,
  DatePicker as MuiDatePicker,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

interface StaticDatePickerProps {
  locale: any;
  onChange: (value: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (date: Date) => boolean;
  dateValue?: Date;
  label?: string;
}

export function StaticDatePicker({
  locale,
  onChange,
  minDate,
  maxDate,
  isDateDisabled,
  dateValue,
}: StaticDatePickerProps): JSX.Element {
  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={locale}>
      <MuiStaticDatePicker
        minDate={minDate}
        maxDate={maxDate}
        shouldDisableDate={isDateDisabled}
        openTo="day"
        value={dateValue}
        onChange={(e) => {
          onChange(e);
        }}
        slotProps={{
          actionBar: {
            actions: [],
          },
        }}
      />
    </LocalizationProvider>
  );
}

export function InlineDatePicker({
  locale,
  onChange,
  minDate,
  maxDate,
  isDateDisabled,
  dateValue,
  label,
}: StaticDatePickerProps): JSX.Element {
  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={locale}>
      <MuiDatePicker
        label={label}
        minDate={minDate}
        maxDate={maxDate}
        shouldDisableDate={isDateDisabled}
        openTo="day"
        value={dateValue}
        onChange={(e) => {
          onChange(e);
        }}
      />
    </LocalizationProvider>
  );
}
