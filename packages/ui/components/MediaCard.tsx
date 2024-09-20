import Image from "next/image";
import MuiCard from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export function MediaCard({
  heading,
  text,
  src = "https://source.unsplash.com/random",
  alt = "Random image",
}: {
  heading: string;
  text: string;
  src?: string;
  alt?: string;
}): JSX.Element {
  return (
    <MuiCard>
      <Image
        alt={alt}
        src={src}
        width={640}
        height={480}
        style={{
          maxWidth: "100%",
          height: "200px",
          objectFit: "cover",
        }}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {heading}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {text}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="info">
          Share
        </Button>
        <Button size="small" color="primary">
          Learn More
        </Button>
      </CardActions>
    </MuiCard>
  );
}
