import type { ErrorTypesInterface } from "../types";

type LanguageErrorMapInterface = Record<string, ErrorTypesInterface>;

export const languageErrorMap: LanguageErrorMapInterface = {
  es_MX: {
    CART_NO_ASSIGNED_UNIT:
      "Por favor escoge tu dirección, para confirmar la disponibilidad de los productos en tu zona.",
    CART_ISSUES_CREATNG_ORDER:
      "Ha ocurrido un error, no hemos podido crear tu orden.",
    SELLER_INFO_NOT_AVAILABLE:
      "Ha ocurrido un error, no hemos podido cargar la información del negocio.",
    SELLER_UNIT_NOT_FOUND:
      "No hemos encontrado el CEDIS para distribuirte, por favor intenta con otra dirección.",
    USER_INFO_NOT_AVAILABLE:
      "Ha ocurrido un error, no hemos podido cargar tu información.",
    USER_ISSUES_CREATING_ADDRESS:
      "Ha ocurrido un error, no hemos podido guardar tu dirección.",
    USER_ISSUES_SETTING_DEFAULT_ADDRESS:
      "Ha ocurrido un error, no hemos podido guardar tu dirección como predeterminada.",
    CATALOG_NOT_AVAILABLE:
      "Ha ocurrido un error, no hemos podido cargar el catálogo de productos.",
    AUTHOS_ERROR_CREATING_SESSION:
      "Ha ocurrido un error, no hemos podido crear tu sesión.",
    AUTHOS_ERROR_UPDATING_SESSION:
      "Ha ocurrido un error, no hemos podido actualizar tu sesión.",
    AUTHOS_ERROR_DECODE_JWT:
      "Ha ocurrido un error, no hemos podido leer tu sesión.",
    AUTHOS_ERROR_TABLE_NOT_FOUND:
      "Ha ocurrido un error, no hemos podido encontrar este negocio.",
    AUTHOS_ERROR_INVALID_SESSION: "Tu sesión ha expirado.",
    AUTHOS_ERROR_EMAIL_ALREADY_REGISTERED: "Este correo ya está registrado.",
    AUTHOS_ERROR_CREATING_ECOMM_USER:
      "Ha ocurrido un error, no hemos podido crear tu usuario.",
    AUTHOS_ERROR_ELEMENT_NOT_FOUND:
      "Ese correo electrónico parece no estar registrado.",
    AUTHOS_ERROR_WRONG_PASSWORD: "Contraseña incorrecta.",
    AUTHOS_ERROR_CREATING_RESTORE:
      "Ha ocurrido un error, no hemos podido crear tu restauración.",
    AUTHOS_ERROR_INVALID_RESTORE:
      "Ha ocurrido un error, no hemos podido encontrar esta restauración.",
    AUTHOS_ERROR_USER_ALREADY_LOGGED: "Ya has iniciado sesión.",
    AUTHOS_ERROR:
      "Ha ocurrido un error de autenticación, por favor intenta más tarde.",
    SUPPLIER_PRODUCT_ID_IS_EMPTY: "ID del producto está vacío.",
  },
};

export const genericErrorResponseMap = {
  es_MX: "Ha ocurrido un error, por favor intenta más tarde.",
} as Record<string, string>;
