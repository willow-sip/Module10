interface Props {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const BASE_PATH = '/Module10';

export default function StaticImage({ src, alt, width, height, ...props }: Props) {
  const normalizedSrc = src.startsWith('/') ? src.slice(1) : src;
  const fixedSrc = `${BASE_PATH}/${normalizedSrc}`;

  return <img src={fixedSrc} alt={alt} width={width} height={height} {...props} />;
}
