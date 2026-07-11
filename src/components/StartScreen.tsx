import {
  APP_TITLE,
  SUPERVISOR_LABEL,
  START_NOTE,
  TIME_LABEL,
} from "../data/flow";

export function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="screen start-screen">
      <p className="time-badge">{TIME_LABEL}</p>
      <h1 className="app-title">{APP_TITLE}</h1>
      <p className="supervisor">{SUPERVISOR_LABEL}</p>

      <p className="start-lead">
        いくつかの質問に答えるだけで、あなたの腰痛タイプの目安と、
        今日からできるセルフケアの入口がわかります。
      </p>

      <div className="start-note">{START_NOTE}</div>

      <button className="btn btn-primary" onClick={onStart}>
        チェックをはじめる
      </button>
    </div>
  );
}
