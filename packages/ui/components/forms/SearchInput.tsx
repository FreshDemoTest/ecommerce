"use client";

import { useEffect, useState } from "react";
// material
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { debounce } from "@mui/material";

interface OptionType {
  label: string;
  value: string;
  estate?: any;
}

interface SearchInputProps {
  options: OptionType[];
  label: string;
  onSelectOption: (option: OptionType) => void;
  defaultValue?: OptionType | undefined;
  fieldProps?: any;
  fullWidth?: boolean;
  searchOnLabel?: boolean;
  displayLabelFn?: (option: OptionType | string) => string;
  initialSize?: number;
}

export function SearchInput({
  options,
  label,
  onSelectOption,
  defaultValue,
  fieldProps = {},
  fullWidth = true,
  searchOnLabel = false,
  displayLabelFn = (option: OptionType | string) => {
    if (typeof option === "string") {
      return option;
    } else if (!searchOnLabel) {
      return option.value;
    }
    return `${option.value} - ${option.label}`;
  },
  initialSize = 20,
}: SearchInputProps): JSX.Element {
  const [searchValue, setSearchValue] = useState<OptionType | undefined>(
    defaultValue
  );
  const [inputValue, setInputValue] = useState("");
  const [lOptions, setLOptions] = useState<OptionType[]>([]);

  const handleOptions = (opts: OptionType[]): void => {
    if (searchOnLabel) {
      setLOptions(
        opts.sort((a, b) => (a.label > b.label ? 1 : -1)).slice(0, initialSize)
      );
    } else {
      setLOptions(
        opts.sort((a, b) => (a.value > b.value ? 1 : -1)).slice(0, initialSize)
      );
    }
  };

  // hook - update options based on search
  useEffect(() => {
    debounce(() => {
      if (inputValue.length === 0 && searchValue) {
        // update options to be rendered with first 20 elements if empty
        const _opts = options.slice(0, initialSize);
        handleOptions(_opts.concat(defaultValue ? [defaultValue] : []));
      } else if (inputValue.length > 0) {
        const filteredOptions = options.filter((option) => {
          return (
            option.value.toLowerCase().includes(inputValue.toLowerCase()) ||
            (searchOnLabel &&
              option.label.toLowerCase().includes(inputValue.toLowerCase()))
          );
        });
        handleOptions(filteredOptions);
      } else if (lOptions.length === 0) {
        // update options to be rendered with first 20 elements if empty
        const _opts = options.slice(0, initialSize);
        handleOptions(_opts.concat(defaultValue ? [defaultValue] : []));
      }
    }, 800)();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, options]);

  // hook - update value based on fieldProps
  useEffect(() => {
    if (searchValue) {
      onSelectOption(searchValue);
      // set LOption to value
      handleOptions([searchValue]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  return (
    <Autocomplete
      id={`search-text-input-${label.toLowerCase()}`}
      getOptionLabel={displayLabelFn}
      filterOptions={(x) => x}
      disableClearable
      includeInputInList
      filterSelectedOptions
      value={searchValue}
      fullWidth={fullWidth}
      noOptionsText="No hay resultados"
      options={lOptions}
      isOptionEqualToValue={(option, value) => {
        if (typeof value === "string") {
          if (typeof option === "string") {
            return option === value;
          }
          return option.value === value;
        } else if (typeof option === "string") {
          return option === value.value;
        }
        return option.value === value.value;
      }}
      onChange={(event: any, value: OptionType | string) => {
        if (typeof value !== "string") {
          if (value.label !== "No hay resultados") {
            setSearchValue(value);
          }
        }
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          {...fieldProps}
          InputProps={{
            ...params.InputProps,
            type: "search",
          }}
        />
      )}
    />
  );
}
