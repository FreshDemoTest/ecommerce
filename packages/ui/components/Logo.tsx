import Image from "next/image";
import type { LogoProps } from "../domain";

export function Logo({
  src,
  width = 40,
  height = 40,
  sx = {},
  ...other
}: LogoProps): JSX.Element {
  const bWidth = width;
  const bHeight = height;

  return (
    <div style={{ ...sx, width: bWidth, height: bHeight }} {...other}>
      <Image
        src={src}
        alt="logo"
        width={width}
        height={height}
        loading="lazy"
        quality={100}
      />
    </div>
  );
}
