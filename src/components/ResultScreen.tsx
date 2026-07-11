import {
  MEMBERSHIP_LABEL,
  MEMBERSHIP_URL,
  NOTE_PROFILE_URL,
  RESULT_FOOTNOTE,
  type ResultNode,
} from "../data/flow";
import { NavButtons } from "./NavButtons";

export function ResultScreen({
  node,
  onBack,
  onRestart,
}: {
  node: ResultNode;
  onBack: () => void;
  onRestart: () => void;
}) {
  // ガイドURLが未設定（プレースホルダーのまま）の場合はnoteトップへ誘導
  const guideReady = !node.guideUrl.includes("{");
  const guideHref = guideReady ? node.guideUrl : NOTE_PROFILE_URL;
  const guideLabel = guideReady
    ? "詳しいセルフケアガイドを読む（note）"
    : "関連記事を読む（note）";

  return (
    <div className="screen result-screen">
      <p className="result-badge">あなたのタイプの目安</p>
      <h2 className="result-title">
        {node.typeName}
        <span className="result-suffix">の可能性があります</span>
      </h2>

      <section className="card">
        <h3 className="card-title">どうして痛むの？</h3>
        {node.mechanism.split("\n").map((line, i) => (
          <p key={i} className="card-text">
            {line}
          </p>
        ))}
      </section>

      <section className="card">
        <h3 className="card-title">今日からできるセルフケア</h3>
        {node.selfCare.split("\n").map((line, i) => (
          <p key={i} className="card-text">
            {line}
          </p>
        ))}
      </section>

      <a className="btn btn-primary btn-link" href={guideHref} target="_blank" rel="noopener noreferrer">
        {guideLabel}
      </a>

      <a className="membership-cta" href={MEMBERSHIP_URL} target="_blank" rel="noopener noreferrer">
        {MEMBERSHIP_LABEL} →
      </a>

      <p className="footnote">{RESULT_FOOTNOTE}</p>

      <NavButtons onBack={onBack} onRestart={onRestart} />
    </div>
  );
}
