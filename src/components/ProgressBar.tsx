export function ProgressBar({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const pct = Math.min(100, Math.round((current / total) * 100));
  return (
    <div className="progress">
      <div className="progress-label">
        {current}/{total}
      </div>
      <div className="progress-track" role="progressbar" aria-valuenow={pct}>
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
