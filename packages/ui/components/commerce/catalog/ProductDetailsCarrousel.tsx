import { useState, useRef, useEffect } from "react";
import Image from "next/image";
// @mui
import type { SxProps, Theme } from "@mui/material";
import {
  Box,
  Hidden,
  IconButton,
  Typography,
  alpha,
  styled,
  useTheme,
} from "@mui/material";
import Slider from "react-slick";
import ArrowRight from "@mui/icons-material/ArrowRight";
//
import type { SupplierProductType } from "../../../domain";
import { generateCloudinaryVersion } from "../../../utils";

// ----------------------------------------------------------------------

const IMAGE_CDN = "https://res.cloudinary.com/neutro-mx/image/upload/v1/";
const THUMB_SIZE = 64;

const RootStyle = styled("div")(({ theme }) => ({
  "& .slick-slide": {
    float: theme.direction === "rtl" ? "right" : "left",
    "&:focus": { outline: "none" },
  },
}));

const ArrowStyle = styled(IconButton)(({ theme }) => ({
  padding: 2,
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
  opacity: 0.48,
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.common.white,
  "&:hover": { opacity: 1 },
}));

// ----------------------------------------------------------------------

interface CarouselArrowIndexProps {
  index: number;
  onNext: () => void;
  onPrevious: () => void;
  total: number;
  sx?: SxProps;
}

function CarouselArrowIndex({
  index,
  total,
  onNext,
  onPrevious,
  ...other
}: CarouselArrowIndexProps): JSX.Element {
  const theme = useTheme();

  const isRTL = theme.direction === "rtl";

  return (
    <RootStyle {...other}>
      <ArrowStyle size="small" onClick={onPrevious}>
        <ArrowRight
          sx={{
            width: 20,
            height: 20,
            transform: " scaleX(-1)",
            ...(isRTL && { transform: " scaleX(1)" }),
          }}
        />
      </ArrowStyle>

      <Typography variant="subtitle1" align="center">
        {index + 1} / {total}
      </Typography>

      <ArrowStyle size="small" onClick={onNext}>
        <ArrowRight
          sx={{
            width: 20,
            height: 20,
            ...(isRTL && { transform: " scaleX(-1)" }),
          }}
        />
      </ArrowStyle>
    </RootStyle>
  );
}

// ----------------------------------------------------------------------

interface ProductDetailsCarouselProps {
  product: SupplierProductType;
  defaultIconPath: string;
}

export function ProductDetailsCarousel({
  product,
  defaultIconPath,
}: ProductDetailsCarouselProps): JSX.Element {
  // const [openLightbox, setOpenLightbox] = useState(false);
  // const [selectedImage, setSelectedImage] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nav1, setNav1] = useState<Slider>();
  const [nav2, setNav2] = useState<Slider>();
  const slider1 = useRef<Slider>(null);
  const slider2 = useRef<Slider>(null);

  const imagesLightbox =
    product.images && product.images.length > 0
      ? product.images.map(
          (img) => `${IMAGE_CDN.replace("/v1/", generateCloudinaryVersion())}${img}`
        )
      : [defaultIconPath];

  const settings1 = {
    dots: false,
    arrows: false,
    slidesToShow: 1,
    draggable: false,
    slidesToScroll: 1,
    adaptiveHeight: true,
    beforeChange: (_current: number, next: number) => {
      setCurrentIndex(next);
    },
  };

  const settings2 = {
    dots: false,
    arrows: false,
    centerMode: true,
    swipeToSlide: true,
    focusOnSelect: true,
    variableWidth: false,
    centerPadding: "0px",
    slidesToShow: imagesLightbox.length,
  };

  // hook - on mount
  useEffect(() => {
    if (slider1.current) {
      setNav1(slider1.current);
    }
    if (slider2.current) {
      setNav2(slider2.current);
    }
  }, []);

  const handlePrevious = (): void => {
    slider2.current?.slickPrev();
  };

  const handleNext = (): void => {
    slider2.current?.slickNext();
  };

  return (
    <RootStyle
      sx={{ width: { md: "400px", xs: "320px" }, ml: { md: 0, xs: 1.5 } }}
    >
      <Box sx={{ p: 0 }}>
        <Box
          sx={{
            zIndex: 0,
            borderRadius: 2,
            overflow: "hidden",
            position: "relative",
            mb: 2,
          }}
        >
          <Slider {...settings1} ref={slider1} asNavFor={nav2}>
            {imagesLightbox.map((img) => (
              <Box key={img}>
                {/* Desktop */}
                <Hidden mdDown>
                  <Image
                    key={img}
                    alt={product.productDescription}
                    src={img}
                    width={400}
                    height={400}
                    style={{ cursor: "zoom-in" }}
                  />
                </Hidden>
                {/* Mobile */}
                <Hidden mdUp>
                  <Image
                    key={img}
                    alt={product.productDescription}
                    src={img}
                    width={320}
                    height={320}
                    style={{ cursor: "zoom-in" }}
                  />
                </Hidden>
              </Box>
            ))}
          </Slider>
        </Box>
        {/* Picking arrows */}
        <CarouselArrowIndex
          index={currentIndex}
          total={imagesLightbox.length}
          onNext={handleNext}
          onPrevious={handlePrevious}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        />
      </Box>

      {/* Slider */}
      <Box sx={{ width: "100%", overflowX: "scroll" }}>
        <Box
          sx={{
            my: 3,
            mx: "auto",
            "& .slick-current .isActive": { opacity: 1 },
            ...(imagesLightbox.length === 1 && { maxWidth: THUMB_SIZE + 16 }),
            ...(imagesLightbox.length === 2 && {
              maxWidth: THUMB_SIZE * 2 + 32,
            }),
            ...(imagesLightbox.length === 3 && {
              maxWidth: THUMB_SIZE * 3 + 48,
            }),
            ...(imagesLightbox.length === 4 && {
              maxWidth: THUMB_SIZE * 3 + 48,
            }),
            ...(imagesLightbox.length >= 5 && { maxWidth: THUMB_SIZE * 6 }),
            ...(imagesLightbox.length > 2 && {
              position: "relative",
              "&:before, &:after": {
                top: 0,
                zIndex: 9,
                content: "''",
                height: "100%",
                position: "absolute",
                width: (THUMB_SIZE * 2) / 3,
                backgroundImage: (theme) =>
                  `linear-gradient(to left, ${alpha(
                    theme.palette.background.paper,
                    0
                  )} 0%, ${theme.palette.background.paper} 100%)`,
              },
              "&:after": { right: 0, transform: "scaleX(-1)" },
            }),
          }}
        >
          <Slider {...settings2} ref={slider2} asNavFor={nav1}>
            {imagesLightbox.map((img, index) => (
              <Box
                key={img}
                sx={{
                  px: 0.75,
                  borderRadius: 1.5,
                  cursor: "pointer",
                  ...(currentIndex === index && {
                    border: (theme: Theme) =>
                      `solid 3px ${theme.palette.primary.main}`,
                  }),
                }}
              >
                <Image
                  alt={`${product.productDescription} - ${index}`}
                  src={img}
                  width={THUMB_SIZE}
                  height={THUMB_SIZE}
                />
              </Box>
            ))}
          </Slider>
        </Box>
      </Box>
    </RootStyle>
  );
}
