import { Fragment, type ReactNode } from "react";

/**
 * Splits admin-authored plain text into paragraph nodes, joined with <br/>.
 *
 * The About/Fundamentos admin forms are plain <textarea>s, so pressing Enter
 * stores a real newline character. The previous implementation split on the
 * literal 4-character string "\\n\\n" (a leftover from an earlier authoring
 * format) — checked against the live data, that string never actually
 * appears in about_instructors.description (which uses real single
 * newlines) and only partially appears in some fundamentos_sections rows,
 * so the old split was a silent no-op for most content. This normalizes any
 * leftover literal "\n" sequences to real newlines first, then splits on
 * one or more real newlines.
 */
export function renderParagraphs(text: string): ReactNode {
  const segments = text
    .replace(/\\n/g, "\n")
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return segments.map((segment, index) => (
    <Fragment key={index}>
      {segment}
      {index < segments.length - 1 && <br />}
    </Fragment>
  ));
}
