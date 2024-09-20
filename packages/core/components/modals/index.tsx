import { CommerceCartModal } from "../commerce/cart/CommerceCartModal";

interface CoreModalsProps {
  cartModalProps: {
    checkoutUrl: string;
    defaultIconPath?: string;
  };
  children: React.ReactNode;
}

function CoreModals({
  cartModalProps,
  children,
}: CoreModalsProps): JSX.Element {
  return (
    <>
      <CommerceCartModal {...cartModalProps} />
      {children}
    </>
  );
}

// modals
export { CoreModals };
