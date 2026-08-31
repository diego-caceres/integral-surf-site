import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { renderParagraphs } from "./text";

// renderParagraphs returns React nodes, so we render them into a container
// and inspect the resulting DOM rather than comparing strings directly.
function renderInto(text: string) {
  const { container } = render(<div>{renderParagraphs(text)}</div>);
  return container;
}

describe("renderParagraphs", () => {
  it("renders a single line with no <br> when there's no newline", () => {
    const container = renderInto("Just one line.");
    expect(container.textContent).toBe("Just one line.");
    expect(container.querySelectorAll("br")).toHaveLength(0);
  });

  it("splits on real newlines and inserts <br> between segments, but not after the last", () => {
    const container = renderInto("Line one.\nLine two.\nLine three.");
    expect(container.textContent).toBe("Line one.Line two.Line three.");
    expect(container.querySelectorAll("br")).toHaveLength(2);
  });

  // Regression guard: the previous implementation split on the literal
  // string "\\n\\n" (backslash-n-backslash-n), which the live
  // about_instructors data never actually contains — it uses real single
  // newlines — so the old split silently never fired for most content.
  it("treats consecutive real newlines (blank lines) as a single break, not empty segments", () => {
    const container = renderInto("Paragraph one.\n\nParagraph two.");
    expect(container.querySelectorAll("br")).toHaveLength(1);
    expect(container.textContent).toBe("Paragraph one.Paragraph two.");
  });

  it("normalizes legacy literal backslash-n sequences to real line breaks", () => {
    const container = renderInto("Old style.\\n\\nStill splits.");
    expect(container.querySelectorAll("br")).toHaveLength(1);
    expect(container.textContent).toBe("Old style.Still splits.");
  });

  it("returns nothing rendered for an empty string", () => {
    const container = renderInto("");
    expect(container.textContent).toBe("");
    expect(container.querySelectorAll("br")).toHaveLength(0);
  });

  it("trims whitespace around each segment", () => {
    const container = renderInto("  padded line one  \n  padded line two  ");
    expect(container.textContent).toBe("padded line onepadded line two");
  });
});
