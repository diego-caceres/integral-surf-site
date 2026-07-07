import type { ReactNode } from "react";
import { renderParagraphs } from "@/lib/text";

interface AlternatingSectionProps {
  title: string;
  description: string;
  /** Fully-styled media element (image, slider, etc.) — this component only
   * adds the responsive order classes around it, not its own sizing. */
  media: ReactNode;
  /** When true, media renders first on desktop / text first on mobile —
   * the standard "every other row" layout used by About and Fundamentos. */
  reverse?: boolean;
}

/**
 * The two-column text+media layout repeated for every About instructor and
 * every Fundamentos section, alternating sides every other row. Previously
 * duplicated (with the exact same paragraph-splitting logic) in both pages.
 */
export default function AlternatingSection({
  title,
  description,
  media,
  reverse = false,
}: AlternatingSectionProps) {
  const textBlock = (
    <div className={reverse ? "space-y-6 order-1 md:order-2" : "space-y-6"}>
      <h2 className="text-3xl md:text-4xl font-[Eckmannpsych] text-primary">
        {title}
      </h2>
      <p className="text-lg text-textPrimary leading-relaxed">
        {renderParagraphs(description)}
      </p>
    </div>
  );

  const mediaBlock = reverse ? (
    <div className="order-2 md:order-1">{media}</div>
  ) : (
    media
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      {reverse ? (
        <>
          {mediaBlock}
          {textBlock}
        </>
      ) : (
        <>
          {textBlock}
          {mediaBlock}
        </>
      )}
    </div>
  );
}
