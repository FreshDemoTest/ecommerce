const PATHS = {
  home: {
    root: "/",
    tyc: "/terminos-y-condiciones",
    privacy: "/aviso-de-privacidad",
    about: "/about",
  },
  auth: {
    login: "/login",
    signup: "/signup",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
  },
  catalog: {
    list: "/catalog/list",
    product: "/catalog/product/:id",
  },
  checkout: {
    root: "/checkout?step=products",
    delivery: "/checkout?step=delivery",
    payment: "/checkout?step=payment",
  },
  orden: {
    details: "/orden/:id",
    history: "/ordenes",
  },
  user: {
    profile: "/user/profile",
  },
};

export default PATHS;
