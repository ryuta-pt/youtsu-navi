import type { ReferralNode } from "../data/flow";
import { NavButtons } from "./NavButtons";

export function ReferralScreen({
  node,
  onBack,
  onRestart,
}: {
  node: ReferralNode;
  onBack: () => void;
  onRestart: () => void;
}) {
  return (
    <div className={`screen referral-screen ${node.urgency === "urgent" ? "is-urgent" : ""}`}>
      <p className="referral-badge">
        {node.urgency === "urgent" ? "早めの受診をおすすめします" : "受診のご案内"}
      </p>
      <h2 className="referral-title">{node.title}</h2>

      {node.lead.split("\n").map(
        (line, i) =>
          line.trim() !== "" && (
            <p key={i} className="referral-text">
              {line}
            </p>
          )
      )}

      <div className="department-box">
        <span className="department-label">受診先の目安</span>
        <span className="department-name">{node.department}</span>
      </div>

      {node.extraSigns && (
        <section className="card">
          <h3 className="card-title">こんなサインがあれば、より受診をおすすめします</h3>
          <ul className="sign-list">
            {node.extraSigns.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>
      )}

      {node.note && <p className="referral-note">{node.note}</p>}

      <NavButtons onBack={onBack} onRestart={onRestart} />
    </div>
  );
}
