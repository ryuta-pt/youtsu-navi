import type { NodeId, QuestionNode } from "../data/flow";
import { ProgressBar } from "./ProgressBar";
import { NavButtons } from "./NavButtons";

export function QuestionScreen({
  node,
  onNext,
  onBack,
  onRestart,
}: {
  node: QuestionNode;
  onNext: (id: NodeId) => void;
  onBack: () => void;
  onRestart: () => void;
}) {
  return (
    <div className="screen">
      <ProgressBar current={node.progress.current} total={node.progress.total} />
      <h2 className="question">{node.question}</h2>

      <div className="options">
        {node.options.map((o, i) => (
          <button key={i} className="btn btn-option" onClick={() => onNext(o.next)}>
            <span className="btn-label">{o.label}</span>
            {o.sublabel && <span className="btn-sublabel">{o.sublabel}</span>}
          </button>
        ))}
      </div>

      <NavButtons onBack={onBack} onRestart={onRestart} />
    </div>
  );
}
