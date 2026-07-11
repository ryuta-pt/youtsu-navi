import { useState } from "react";
import {
  flow,
  START_NODE,
  validateFlow,
  type NodeId,
} from "./data/flow";
import { StartScreen } from "./components/StartScreen";
import { ChecklistScreen } from "./components/ChecklistScreen";
import { QuestionScreen } from "./components/QuestionScreen";
import { ResultScreen } from "./components/ResultScreen";
import { ReferralScreen } from "./components/ReferralScreen";
import { Footer } from "./components/Footer";

if (import.meta.env.DEV) {
  const errors = validateFlow();
  if (errors.length > 0) {
    // 開発時のみ: 分岐の参照ミスを検出
    console.error("[flow.ts 整合性エラー]", errors);
  }
}

export default function App() {
  // 画面遷移の履歴スタック（空 = トップ画面）。回答はメモリ上のみ。
  const [stack, setStack] = useState<NodeId[]>([]);

  const currentId = stack.length > 0 ? stack[stack.length - 1] : null;
  const node = currentId ? flow[currentId] : null;

  const go = (id: NodeId) => {
    setStack((s) => [...s, id]);
    window.scrollTo(0, 0);
  };
  const back = () => {
    setStack((s) => s.slice(0, -1));
    window.scrollTo(0, 0);
  };
  const restart = () => {
    setStack([]);
    window.scrollTo(0, 0);
  };

  return (
    <div className="app">
      <main className="main">
        {node === null && <StartScreen onStart={() => go(START_NODE)} />}

        {node?.kind === "checklist" && (
          <ChecklistScreen key={node.id} node={node} onNext={go} onBack={back} onRestart={restart} />
        )}
        {node?.kind === "question" && (
          <QuestionScreen key={node.id} node={node} onNext={go} onBack={back} onRestart={restart} />
        )}
        {node?.kind === "result" && (
          <ResultScreen key={node.id} node={node} onBack={back} onRestart={restart} />
        )}
        {node?.kind === "referral" && (
          <ReferralScreen key={node.id} node={node} onBack={back} onRestart={restart} />
        )}
      </main>
      <Footer />
    </div>
  );
}
