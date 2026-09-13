import { IconType } from "@/components/Icons";
import { elementLabels } from "@/lib/catalog";

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
          <span
            key={element}
            className="inline-flex items-center gap-1"
            title={label}
          >
            <IconType element={element} className="text-[16px]" title={label} />
            {withLabels ? (
              <span>{label}</span>
            ) : (
              <span className="sr-only">{label}</span>
            )}
          </span>
        );
      })}
    </span>
  );
}
