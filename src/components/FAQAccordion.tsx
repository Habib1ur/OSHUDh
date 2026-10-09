import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQAccordionProps {
  items: { question: string; answer: string }[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={item.question}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
            >
              <span className="font-medium text-slate-800">
                {item.question}
              </span>
              <ChevronDown
                className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen && (
              <p className="border-t border-slate-200 px-4 py-3 text-sm text-slate-600">
                {item.answer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
