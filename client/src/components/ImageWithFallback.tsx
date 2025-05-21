import { useState } from "react";
import PlaceholderImage from "./PlaceholderImage";

const ImageWithFallback = ({
  src,
  alt,
  className,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return <PlaceholderImage />;
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className={className}
      {...props}
    />
  );
};

export default ImageWithFallback;
