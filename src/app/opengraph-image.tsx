import { USER } from "@/features/portfolio/data/user";
import {
  OG_IMAGE_CONTENT_TYPE,
  OG_IMAGE_SIZE,
  renderOgImage,
} from "@/lib/og-image";

export const alt = `${USER.displayName} – ${USER.jobTitle}`;
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    title: USER.displayName,
    description: `${USER.jobTitle}. ${USER.bio}`,
  });
}
