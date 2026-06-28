import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { USER } from "@/features/portfolio/data/user";

import { FlipSentences } from "./flip-sentences";
import { PronounceMyName } from "./pronounce-my-name";
import { VerifiedIcon } from "./verified-icon";
import { YTMarkIsometric } from "./yt-mark-isometric";

export function ProfileHeader() {
  return (
    <div className="screen-line-bottom grid grid-cols-[auto_1fr] grid-rows-[1fr_auto] overflow-y-clip border-x border-line">
      <figure className="relative col-span-2 p-2 sm:col-span-1 sm:col-start-2 sm:p-4">
        <YTMarkIsometric />
        <figcaption className="absolute right-2 bottom-2 sm:right-4">
          <Tooltip>
            <TooltipTrigger asChild={true}>
              <span className="group text-zinc-400 select-none dark:text-zinc-700 hover:text-zinc-600 dark:hover:text-zinc-500">
                <span className="font-mono text-xs leading-none">FIG_001</span>
                <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-zinc-400 dark:bg-zinc-700"></span>
              </span>
            </TooltipTrigger>
            <TooltipContent>Click YT mark</TooltipContent>
          </Tooltip>
        </figcaption>
      </figure>

      <div className="flex flex-col sm:row-span-2 sm:row-start-1">
        <div className="screen-line-top mt-auto shrink-0 border-r border-line">
          <div className="mx-0.5 my-0.75 flex">
            <div className="pointer-events-none relative size-30 rounded-full min-[24rem]:size-32 sm:size-40">
              <img
                className="size-full rounded-full object-cover select-none"
                src={USER.avatar}
                alt={USER.displayName}
                fetchPriority="high"
              />
              <div
                className="pointer-events-none absolute inset-0 rounded-full inset-ring-1 inset-ring-foreground/10"
                aria-hidden
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="mt-auto border-t border-line">
          <div className="flex items-center gap-2 pl-4">
            <h1 className="-translate-y-px text-xl sm:text-3xl font-semibold tracking-tight">
              {USER.displayName}
            </h1>

            <VerifiedIcon
              className="size-4.5 select-none text-blue-600"
              aria-hidden
            />

            {USER.namePronunciationUrl && (
              <PronounceMyName
                namePronunciationUrl={USER.namePronunciationUrl}
              />
            )}
          </div>

          <FlipSentences className="h-12.5 border-t border-line py-1 pl-4 sm:h-9">
            {USER.flipSentences}
          </FlipSentences>
        </div>
      </div>
    </div>
  );
}
