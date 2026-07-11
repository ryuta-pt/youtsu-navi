export function NavButtons({
  onBack,
  onRestart,
}: {
  onBack: () => void;
  onRestart: () => void;
}) {
  return (
    <div className="nav-buttons">
      <button className="btn-text" onClick={onBack}>
        ← 戻る
      </button>
      <button className="btn-text" onClick={onRestart}>
        ↺ 最初からやり直す
      </button>
    </div>
  );
}
