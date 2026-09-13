import { elementColor, elementLabels } from "@/lib/catalog";

export function ElementDots({
  elements,
  withLabels = false,
}: {
  elements: string[];
  withLabels?: boolean;
}) {
  if (elements.length === 0) return null;

  return (
    <span className="inline-flex items-center gap-1.5">
      {elements.map((element) => {
        const label = elementLabels[element] ?? element;
        return (
          <span key={element} className="inline-flex items-center gap-1" title={label}>
            <span
              aria-hidden
              className="h-[7px] w-[7px] rounded-full"
              style={{ backgroundColor: elementColor(element) }}
            />
            {withLabels ? <span>{label}</span> : <span className="sr-only">{label}</span>}
          </span>
        );
      })}
    </span>
  );
}
