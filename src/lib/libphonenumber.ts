import type { MetadataJson } from "libphonenumber-js/core";
import { formatIncompletePhoneNumber as _formatIncompletePhoneNumber } from "libphonenumber-js/core";
import metadataJson from "@/assets/libphonenumber.metadata.json";

const metadata = metadataJson as MetadataJson;

/**
 * Formats an incomplete phone number string according to the metadata provided (currently IN and VN).
 *
 * Uses `libphonenumber-js`'s `formatIncompletePhoneNumber` function with custom metadata.
 *
 * @param phone - The phone number string to format (may be incomplete).
 * @returns The formatted phone number string.
 *
 * @remarks
 * - Only India (IN) and Viet Nam (VN) metadata are included. To add more countries, update the custom metadata file.
 * - This function is useful for formatting user input as they type a phone number.
 *
 * @see https://www.npmjs.com/package/libphonenumber-js#customizing-metadata
 */
export function formatIncompletePhoneNumber(phone: string) {
  return _formatIncompletePhoneNumber(phone, metadata);
}
