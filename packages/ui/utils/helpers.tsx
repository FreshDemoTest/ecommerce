export function fQuantity(value: number, decimalPlaces = 2): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  })
    .format(value)
    .replace("MX$", "");
}

export const fCurrency = (value: number | undefined): string => {
  if (!value) {
    return "-";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "MXN",
  })
    .format(value)
    .replace("MX$", "$");
};

export const fNoCentsCurrency = (value: number | undefined): string => {
  if (!value) {
    return "-";
  }
  return (
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "MXN",
    })
      .format(value)
      .replace("MX$", "$")
      .split(".")[0] || "-"
  );
};

export function fPercent(number: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
  }).format(number / 100);
}

export function fPercentDec(perNum: number): string {
  return `${perNum.toFixed(2)}%`;
}

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replaceAll(",", "")
    .replaceAll(".", "")
    .replaceAll("/", "")
    .replaceAll("(", "")
    .replaceAll(")", "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function urlFormat(text: string, spaceReplacer = "-"): string {
  if (spaceReplacer === "+") {
    // formatting for search
    return text
      .toLowerCase()
      .replaceAll(" ", spaceReplacer)
      .replaceAll("%", "")
      .replaceAll("/", "");
  }
  // formatting for url
  return normalizeText(text)
    .replaceAll(" ", spaceReplacer)
    .replaceAll("%", "")
    .replaceAll("%", "")
    .replaceAll("/", "")
    .replaceAll("&", "");
}

export function generateCloudinaryVersion(): string {
  const currentDate = new Date();
  // Convert to YYYYMMDDHH format
  const formattedDate = currentDate.toISOString().slice(0, 10).replace(/-/g, "");
  const minuteDec = currentDate.getMinutes().toString().padStart(2, "0")[0];
  const cloudinaryVersion = `/v${formattedDate}${currentDate.getHours()}${minuteDec}/`;
  return cloudinaryVersion;
}

// format helpers
export const fISODate = (value: Date | string | undefined): string => {
  if (!value) {
    return "-";
  }
  const dhs = new Date(value);
  dhs.setHours(0, 0, 0, 0);
  const _tmp = dhs.toISOString().split("T")[0];
  return _tmp || "-";
};

export const fDateTime = (value: Date | string | undefined): string => {
  if (!value) {
    return "-";
  }
  const dhs = new Date(value);
  let _hr = dhs.getHours() - 6;
  if (_hr < 0) _hr += 24;
  let sHr = `${_hr}`;
  if (_hr < 10) {
    sHr = `0${_hr}`;
  }
  // set timezone
  const hrs = ` ${sHr}:${dhs.getMinutes()}`;
  dhs.setHours(0, 0, 0, 0);
  const _tmp = dhs.toISOString().split("T")[0] + hrs;
  return _tmp;
};

export function decodeFile(tmp: {
  content: string;
  mimetype: string;
  filename: string;
}): File {
  const contentDecoded = window.atob(tmp.content);
  const byteArray = new Uint8Array(contentDecoded.length);

  for (let i = 0; i < contentDecoded.length; i++) {
    byteArray[i] = contentDecoded.charCodeAt(i);
  }

  const blob = new Blob([byteArray], { type: tmp.mimetype });
  const file = new File([blob], tmp.filename);

  return file;
}

export const createBlobURI = (file: File): string => {
  const blob = new Blob([file], { type: file.type });
  const url = window.URL.createObjectURL(blob);
  return url;
};
