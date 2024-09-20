export interface SessionTokenResult {
  sessionToken: string;
  expiration: Date;
  status: boolean;
  msg?: string;
}

export interface ClientType {
  id?: string;
  businessName: string;
  businessType: string;
  email: string;
  phoneNumber?: string;
  website?: string;
  active?: boolean;
}

export interface UserType {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  deleted?: boolean;
}

export interface ZipCodeType {
  value: string;
  label: string;
  estate: string;
  city?: string;
}
interface CompressedZipCodeType {
  v: string;
  l: string;
  e: string;
  c?: string;
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const zipCodes = require("./zipcodes.json") as CompressedZipCodeType[];

export const estatesMx = zipCodes
  .map((v) => v.e)
  .reduce((acc: string[], val: string) => {
    if (!acc.includes(val)) {
      acc.push(val);
    }
    return acc;
  }, []);

export interface BranchType {
  id?: string;
  branchName: string;
  branchCategory?: string;
  street?: string;
  externalNum?: string;
  internalNum?: string;
  neighborhood?: string;
  city?: string;
  estate?: string;
  country?: string;
  zipCode?: string;
  deleted?: boolean;
  fullAddress?: string;
  tags?: {
    id: string;
    tagKey: string;
    tagValue: string;
  }[];
}

export interface BranchInvoiceInfoType {
  taxId?: string;
  fiscalRegime?: string;
  taxName?: string;
  taxAddress?: string;
  cfdiUse?: string;
  taxZipCode?: string;
  invoiceEmail?: string;
}

export type BranchStateType = BranchType & BranchInvoiceInfoType;

const _fiscalRegimes = {
  601: "General de Ley Personas Morales",
  603: "Personas Morales con Fines no Lucrativos",
  605: "Sueldos y salarios e ingresos asimilados a salarios",
  606: "Régimen de Arrendamiento",
  607: "Enajenación de bienes",
  608: "Demás ingresos",
  610: "Residentes en el Extranjero sin Establecimiento Permanente en México",
  612: "Régimen de Actividades Empresariales y Profesionales",
  614: "Intereses",
  615: "Obtención de premio",
  616: "Sin obligaciones fiscales",
  620: "Sociedades Cooperativas de Producción que optan por diferir sus ingresos",
  621: "Régimen de Incorporación Fiscal",
  622: "Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras",
  623: "Opcional para Grupos de Sociedades",
  624: "Coordinados",
  625: "Régimen de Actividades Empresariales con ingresos a través de Plataformas Tecnológicas",
  626: "Régimen Simplificado de Confianza",
};

export const FiscalRegimes = Object.entries(_fiscalRegimes).map((v) => ({
  value: v[0],
  label: v[1],
}));

const _cfdiUses = {
  G01: "Adquisición de mercancías",
  G02: "Devoluciones, descuentos o bonificaciones",
  G03: "Gastos en general",
  I01: "Construcciones",
  I02: "Mobilario y equipo de oficina por inversiones",
  I03: "Equipo de transporte",
  I04: "Equipo de computo y accesorios",
  I05: "Dados, troqueles, moldes, matrices y herramental",
  I06: "Comunicaciones telefónicas",
  I07: "Comunicaciones satelitales",
  I08: "Otra maquinaria y equipo",
  D01: "Honorarios médicos, dentales y gastos hospitalarios.",
  D02: "Gastos médicos por incapacidad o discapacidad",
  D03: "Gastos funerales.",
  D04: "Donativos.",
  D05: "Intereses reales efectivamente pagados por créditos hipotecarios (casa habitación).",
  D06: "Aportaciones voluntarias al SAR.",
  D07: "Primas por seguros de gastos médicos.",
  D08: "Gastos de transportación escolar obligatoria.",
  D09: "Depósitos en cuentas para el ahorro, primas que tengan como base planes de pensiones.",
  D10: "Pagos por servicios educativos (colegiaturas)",
  S01: "Sin efectos fiscales.",
  CP01: "Pagos",
  CN01: "Nómina",
};

export const CfdiUses = Object.entries(_cfdiUses).map((v) => ({
  value: v[0],
  label: v[1],
}));

// -- Context Variable Definitions

// Client State
export interface ClientInfoState {
  apiURL: string;
  isInitialized: boolean;
  isAuthenticated: boolean;
  sellerId?: string;
  token?: string;
  user?: UserType;
  client?: ClientType;
  addresses: BranchStateType[];
  defaultAddress?: BranchStateType;
  language: string;
  loading: boolean;
  error?: string;
}

export interface ClientInfoActions {
  initialize: () => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    urlForEmail: string,
    phoneNumber?: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getSessionToken: (refresh?: boolean) => Promise<void>;
  sendResetPasswordCode: (email: string, resetUrl: string) => Promise<boolean>;
  resetPasswordWithCode: (
    newPassword: string,
    resetCode: string
  ) => Promise<boolean>;
  fetchUserInfo: () => Promise<void>;
  addAddress: (address: BranchStateType) => Promise<void>;
  editAddress: (address: BranchStateType) => Promise<void>;
  setDefaultAddress: (addressId: string) => void;
  changeLanguage: (language: string) => Promise<void>;
}
