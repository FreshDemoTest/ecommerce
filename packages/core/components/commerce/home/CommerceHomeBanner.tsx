"use client";

import { redirect } from "next/navigation";
import { Banner } from "ui";
import { type CommerceProductDisplay, type BannerType } from "../../..";
import { useClientInfo } from "../../../providers/hooks";

interface CommerceHomeBannerProps {
  bannerSrc: BannerType | BannerType[];
  commerceDisplay: CommerceProductDisplay;
  loginLink: string;
}

export function CommerceHomeBanner(
  props: CommerceHomeBannerProps
): JSX.Element {
  const { isAuthenticated } = useClientInfo();

  // if commerceDisplay is closed, and not logged in redirect to Login
  if (props.commerceDisplay === "closed" && !isAuthenticated) {
    redirect(props.loginLink);
  }

  // [TODO] For now bannerSrc does not support an array of images
  const banner =
    props.bannerSrc instanceof Array ? props.bannerSrc[0] : props.bannerSrc;
  return (
    <Banner
      src={banner?.path || "/assets/banner.png"} // [TODO] add date validation
      alt={banner?.alt || "ECommerce"}
      href={banner?.href}
    />
  );
}
