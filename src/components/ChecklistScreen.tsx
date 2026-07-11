import { useState } from "react";
import type { ChecklistNode, NodeId } from "../data/flow";
import { ProgressBar } from "./ProgressBar";
import { NavButtons } from "./NavButtons";

export function ChecklistScreen({
  node,
  onNext,
  onBack,
  onRestart,
}: {
  node: ChecklistNode;
  onNext: (id: NodeId) => void;
  onBack: () => void;
  onRestart: () => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (optionId: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(optionId)) {
        next.delete(optionId);
        return next;
      }
      // 「あてはまるものはない」と他項目は同時選択できない（排他）
      if (optionId === node.noneOptionId) {
        return new Set([node.noneOptionId]);
      }
      next.delete(node.noneOptionId);
      next.add(optionId);
      return next;
    });
  };

  const submit = () => {
    const chosen = node.options.filter((o) => selected.has(o.id));
    if (chosen.some((o) => o.isUrgent)) return onNext(node.nextIfUrgent);
    if (chosen.some((o) => o.isDanger)) return onNext(node.nextIfDanger);
    onNext(node.nextIfNone);
  };

  return (
    <div className="screen">
      <ProgressBar current={node.progress.current} total={node.progress.total} />
      <h2 className="question">{node.question}</h2>

      <div className="options">
        {node.options.map((o) => (
          <button
            key={o.id}
            className={`btn btn-check ${selected.has(o.id) ? "is-selected" : ""}`}
            aria-pressed={selected.has(o.id)}
            onClick={() => toggle(o.id)}
          >
            <span className="checkbox" aria-hidden="true">
              {selected.has(o.id) ? "✓" : ""}
            </span>
            <span className="btn-label">{o.label}</span>
          </button>
        ))}
      </div>

      <button
        className="btn btn-primary"
        disabled={selected.size === 0}
        onClick={submit}
      >
        次へ
      </button>

      <NavButtons onBack={onBack} onRestart={onRestart} />
    </div>
  );
}
