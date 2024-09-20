import { Box, Grid } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

interface BannerProps {
  src: string;
  alt: string;
  href?: string;
}

export function Banner({ src, alt, href }: BannerProps): JSX.Element {
  return (
    <Grid container>
      <Grid item xs={12} md={12}>
        <Link href={href || "#"}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: 0,
              pb: { xs: "30%", md: "25%" },
            }}
          >
            <Image
              src={src}
              alt={alt}
              fill
              priority
              quality={100}
            />
          </Box>
        </Link>
      </Grid>
    </Grid>
  );
}
