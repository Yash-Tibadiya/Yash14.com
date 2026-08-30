"use client";

import { useId } from "react";
import { toast } from "sonner";
import { PhoneIcon } from "lucide-react";
import { trackEvent } from "@/lib/events";
import { useHotkeys } from "react-hotkeys-hook";
import { useIsClient } from "@/hooks/use-is-client";
import { useTiks } from "@rexa-developer/tiks/react";
import { CopyButton } from "@/components/copy-button";
import { copyToClipboardWithEvent } from "@/utils/copy";
import { RevealEncodedTextScript } from "./reveal-encoded-text";
import { decodePhoneNumber, formatPhoneNumber } from "@/utils/string";
import {
  IntroItem,
  IntroItemContent,
  IntroItemIcon,
  IntroItemLink,
} from "./intro-item";

type PhoneItemProps = {
  phoneNumberB64: string;
};

export function PhoneItem({ phoneNumberB64 }: PhoneItemProps) {
  const id = useId();
  const isClient = useIsClient();
  const phoneNumberDecoded = decodePhoneNumber(phoneNumberB64);
  const phoneNumberFormatted = formatPhoneNumber(phoneNumberDecoded);

  const { success } = useTiks();

  useHotkeys("shift+p", () => {
    copyToClipboardWithEvent(phoneNumberDecoded, {
      name: "copy_phone_number",
      properties: {
        method: "keyboard",
        key: "shift+p",
      },
    });
    success();
    toast.success("Phone number copied");
  });

  return (
    <IntroItem className="group">
      <IntroItemIcon>
        <PhoneIcon />
      </IntroItemIcon>

      <IntroItemContent className="flex">
        <IntroItemLink
          id={id}
          href={isClient ? `tel:${phoneNumberDecoded}` : ""}
          suppressHydrationWarning
        >
          {isClient ? phoneNumberFormatted : ""}
        </IntroItemLink>
      </IntroItemContent>

      <div className="-translate-x-3 translate-y-px opacity-0 transition-opacity ease-out group-hover:opacity-100">
        <CopyButton
          className="rounded-md border-none text-muted-foreground [&_svg:not([class*='size-'])]:size-4"
          variant="ghost"
          size="icon-xs"
          text={() => phoneNumberDecoded}
          onCopySuccess={() => {
            trackEvent({
              name: "copy_phone_number",
              properties: {
                method: "button",
              },
            });
          }}
        />
      </div>

      <RevealEncodedTextScript id={id} textB64={btoa(phoneNumberFormatted)} />
    </IntroItem>
  );
}
