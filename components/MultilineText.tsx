import { Fragment, type ReactNode } from "react";

export function MultilineText({
  text,
  className,
  boldSegments,
}: {
  text: string;
  className?: string;
  boldSegments?: string[];
}) {
  const blocks = text.split("\u2028");

  return (
    <span className={className}>
      {blocks.map((block, blockIndex) => {
        const lines = block.split("\n");
        return (
          <Fragment key={blockIndex}>
            {blockIndex > 0 ? <br /> : null}
            {lines.map((line, lineIndex) => {
              const content = renderLine(line, boldSegments);
              return (
                <Fragment key={lineIndex}>
                  {lineIndex > 0 ? <br /> : null}
                  {content}
                </Fragment>
              );
            })}
          </Fragment>
        );
      })}
    </span>
  );
}

function renderLine(line: string, boldSegments?: string[]): ReactNode {
  if (!boldSegments?.length) return line;

  for (const segment of boldSegments) {
    if (line.startsWith(segment)) {
      return (
        <>
          <span className="font-semibold">{segment}</span>
          {line.slice(segment.length)}
        </>
      );
    }
  }

  return line;
}
