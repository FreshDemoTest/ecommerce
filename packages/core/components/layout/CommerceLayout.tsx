/* eslint-disable @typescript-eslint/unbound-method */
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Footer, TopNavBar, WhatsAppFAB } from "ui";
import type { CommerceCTACopiesType, CommerceConfigType } from "../..";
import { useCart, useClientInfo } from "../../providers/hooks";

// ------------------------------------------------------------

const baseRedirectTo = "/catalog/list";

interface CommerceLayoutProps {
  config: CommerceConfigType;
  copy: CommerceCTACopiesType;
  additionalLinks?: {
    href: string;
    label: string;
  }[];
  additionalMenuItems?: {
    withAuth: boolean;
    icon: string;
    label: string;
    link: string;
  }[];
}

export function CommerceTopNavBarLayout(
  props: CommerceLayoutProps
): JSX.Element | null {
  const { logoPath: logoSrc, commerceDisplay, sellerName } = props.config;
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const { searchPlaceholder } = props.copy;
  const { handleCartClick, cartCount } = useCart();
  const { isAuthenticated, user, logout } = useClientInfo();
  const [searchTerm, setSearchTerm] = useState<string>("");

  // do not show some elements of top bar depending the type of commerce display
  const showSearchBar =
    commerceDisplay === "closed-with-catalog" ||
    commerceDisplay === "open" ||
    isAuthenticated;
  const showCartIcon = commerceDisplay === "open" || isAuthenticated;

  // search
  function handleCatalogSearch(term: string): void {
    // fetch params
    const params = new URLSearchParams(searchParams);
    // delete all params except to page, size and search
    [...params.keys()].forEach((key: string) => {
      if (!["page", "size", "search"].includes(key)) {
        params.delete(key);
      }
    });
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    replace(`${baseRedirectTo}?${params.toString()}`);
    setSearchTerm(term);
  }

  function handleLogout(): void {
    const _logout = async (): Promise<void> => {
      await logout();
      window.location.reload();
    };
    void _logout();
  }

  const authedUser = {
    ...(user || {}),
    isAuthenticated,
  };

  return (
    <TopNavBar
      logoSrc={logoSrc}
      sellerName={sellerName}
      user={authedUser}
      searchPlaceholder={searchPlaceholder}
      searchValue={searchTerm}
      onChangeSearch={handleCatalogSearch}
      cartClick={handleCartClick}
      cartItems={cartCount}
      showSearchBar={showSearchBar}
      showCartIcon={showCartIcon}
      logoutClick={handleLogout}
      additionalMenuItems={props.additionalMenuItems}
    />
  );
}

export function CommerceFooterLayout(
  props: CommerceLayoutProps
): JSX.Element | null {
  const { logoPath: logoSrc, sellerName } = props.config;
  const { supportContact } = props.copy.footer;

  return (
    <>
      <WhatsAppFAB
        active={supportContact.isPhoneWA}
        sendTo={supportContact.phone}
      />
      <Footer
        logoSrc={logoSrc}
        sellerName={sellerName}
        {...props.copy.footer}
        additionalLinks={props.additionalLinks}
      />
    </>
  );
}
