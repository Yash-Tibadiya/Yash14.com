import { USER } from "@/features/portfolio/data/user";
import {
  OG_IMAGE_CONTENT_TYPE,
  OG_IMAGE_SIZE,
  renderOgImage,
} from "@/lib/og-image";

export const alt = `${USER.displayName} Brand Guidelines`;
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    title: "Brand Guidelines",
    description: `Mark, logotype, clear space, and color of the ${USER.displayName} visual identity.`,
  });
}
