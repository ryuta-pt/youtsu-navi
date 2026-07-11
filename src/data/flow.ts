// =============================================================
// 腰痛セルフチェック・ナビ フローデータ
//
// ★ このファイルが「質問・分岐・結果・受診案内」のすべてです。
//    文言の修正はこのファイルだけを編集してください。
//    （文章中の改行は \n で表現します）
// =============================================================

export type NodeId = string;

/** Step0: 危険サインの確認（複数選択） */
export type ChecklistNode = {
  kind: "checklist";
  id: NodeId;
  progress: { current: number; total: number };
  question: string;
  options: {
    id: string;
    label: string;
    /** true → 受診案内（出口A）へ */
    isDanger: boolean;
    /** true → 緊急版の出口Aへ（当日〜翌日の受診を強調） */
    isUrgent?: boolean;
  }[];
  /** 「あてはまるものはない」の選択肢id（他と同時選択できない排他扱い） */
  noneOptionId: string;
  nextIfNone: NodeId;
  nextIfDanger: NodeId;
  nextIfUrgent: NodeId;
};

/** 単一選択の質問 */
export type QuestionNode = {
  kind: "question";
  id: NodeId;
  progress: { current: number; total: number };
  question: string;
  options: { label: string; sublabel?: string; next: NodeId }[];
};

/** 結果（タイプの目安） */
export type ResultNode = {
  kind: "result";
  id: NodeId;
  /** 画面では「◯◯の可能性があります」と表示されます */
  typeName: string;
  /** 仕組みの解説（3行程度・監修者が差し替えてください） */
  mechanism: string;
  /** 今日からできるセルフケア1つ（監修者が差し替えてください） */
  selfCare: string;
  /** note詳細ガイドのURL（未公開のものはプレースホルダーのまま） */
  guideUrl: string;
};

/** 受診案内（出口A/B/C） */
export type ReferralNode = {
  kind: "referral";
  id: NodeId;
  urgency: "normal" | "urgent";
  title: string;
  lead: string;
  /** 受診先の目安 */
  department: string;
  /** 補強サイン（出口Cで使用） */
  extraSigns?: string[];
  note?: string;
};

export type FlowNode = ChecklistNode | QuestionNode | ResultNode | ReferralNode;

// ------------------- 共通の定数（編集しやすいようここに集約） -------------------

export const APP_TITLE = "腰痛タイプ別セルフチェック・ナビ";
export const SUPERVISOR_LABEL = "理学療法士（臨床10年目）監修";
export const START_NOTE = "このチェックは病気の診断ではありません";
export const TIME_LABEL = "約1分でわかる";

export const DISCLAIMER =
  "本ツールは教育目的のセルフチェックであり、医学的診断ではありません。症状が続く場合は医療機関にご相談ください";

export const RESULT_FOOTNOTE =
  "2週間セルフケアを続けても変化がない場合は、医療機関の受診をおすすめします";

/** メンバーシップ（結果ページの小さめCTA） */
export const MEMBERSHIP_LABEL = "痛みの根本解決ラボ（月500円・有料記事読み放題）";
export const MEMBERSHIP_URL = "https://note.com/pt_ryuta/membership";

/** noteプロフィール（ガイド未公開時のフォールバック） */
export const NOTE_PROFILE_URL = "https://note.com/pt_ryuta";

// noteガイドURL（未公開の記事は {NOTE_GUIDE_URL_x} のまま。公開後に差し替え）
const NOTE_GUIDE_URL_1 = "https://note.com/pt_ryuta/n/n74f213bccb69"; // 坐骨神経痛
const NOTE_GUIDE_URL_2 = "https://note.com/pt_ryuta/n/n43bb1e57562a"; // 脊柱管狭窄症
const NOTE_GUIDE_URL_3 = "{NOTE_GUIDE_URL_3}"; // 寝起きの腰痛（ID56 公開後に差し替え）
const NOTE_GUIDE_URL_4 = "https://note.com/pt_ryuta/n/n79ff949872f4"; // デスクワークで体が壊れる前に
const NOTE_GUIDE_URL_5 = "{NOTE_GUIDE_URL_5}"; // 反り腰（ID63 公開後に差し替え）
const NOTE_GUIDE_URL_6 = "https://note.com/pt_ryuta/n/nb94e01b1e579"; // ぎっくり腰
const NOTE_GUIDE_URL_7 = "{NOTE_GUIDE_URL_7}"; // 慢性腰痛4週間プログラム（ID57 公開後に差し替え）

export const START_NODE: NodeId = "step0";

// ------------------------------- フロー本体 -------------------------------

export const flow: Record<NodeId, FlowNode> = {
  // ========== Step 0: 危険サインの確認 ==========
  step0: {
    kind: "checklist",
    id: "step0",
    progress: { current: 1, total: 4 },
    question: "次にあてはまるものはありますか？（複数選択可）",
    options: [
      {
        id: "night_pain",
        label:
          "安静にしていても痛みが強くなってきている（夜、寝ていても痛い）",
        isDanger: true,
      },
      { id: "fever", label: "発熱がある", isDanger: true },
      {
        id: "bladder",
        label:
          "おしっこ・便が出にくい、または漏れてしまう。肛門周囲の感覚がおかしい（鈍い、感じにくい）",
        isDanger: true,
        isUrgent: true,
      },
      {
        id: "weakness",
        label: "脚の力がどんどん入らなくなってきている",
        isDanger: true,
      },
      {
        id: "trauma",
        label: "最近、転倒・尻もちなど強くぶつけた（特に60歳以上）",
        isDanger: true,
      },
      {
        id: "cancer",
        label: "がんの治療中・治療歴があり、最近腰痛が始まった",
        isDanger: true,
      },
      { id: "none", label: "あてはまるものはない", isDanger: false },
    ],
    noneOptionId: "none",
    nextIfNone: "q1",
    nextIfDanger: "exitA",
    nextIfUrgent: "exitA_urgent",
  },

  // ========== Q1 ==========
  q1: {
    kind: "question",
    id: "q1",
    progress: { current: 2, total: 4 },
    question: "お尻や脚に、しびれや痛みはありますか？",
    options: [
      { label: "あり", next: "q2" },
      { label: "なし", next: "q3" },
    ],
  },

  // ========== 神経系ルート ==========
  q2: {
    kind: "question",
    id: "q2",
    progress: { current: 3, total: 4 },
    question: "症状の出方は、どちらに近いですか？",
    options: [
      {
        label: "前かがみや座りっぱなしで悪化する",
        sublabel: "片脚に電気が走るような痛み",
        next: "r1",
      },
      {
        label: "歩くと脚がしびれて、少し休むとまた歩ける",
        next: "q2b",
      },
      { label: "どちらとも言えない", next: "exitB" },
    ],
  },

  q2b: {
    kind: "question",
    id: "q2b",
    progress: { current: 4, total: 4 },
    question: "歩いてしびれ・痛みが出たとき、どうすると楽になりますか？",
    options: [
      {
        label: "前かがみで休む・座ると楽になる",
        sublabel: "腰を反らすと嫌な感じ。自転車なら長く漕げる",
        next: "r2",
      },
      {
        label: "姿勢に関係なく、立ち止まるだけで治まる",
        sublabel: "ふくらはぎが締め付けられるように痛む",
        next: "exitC",
      },
    ],
  },

  // ========== 腰部ルート ==========
  q3: {
    kind: "question",
    id: "q3",
    progress: { current: 3, total: 4 },
    question: "痛みが一番つらいのはいつですか？",
    options: [
      {
        label: "朝起きた直後",
        sublabel: "動いているうちに楽になる",
        next: "r3",
      },
      { label: "長く座った後・立ち上がる瞬間", next: "r4" },
      { label: "体を反らした時・立ち仕事の後", next: "r5" },
      { label: "数日前にギクッとやった", next: "r6" },
      {
        label: "いつも重だるい",
        sublabel: "3ヶ月〜半年以上続いている",
        next: "r7",
      },
    ],
  },

  // ========== 結果 1〜7 ==========
  r1: {
    kind: "result",
    id: "r1",
    typeName: "坐骨神経痛タイプ（椎間板性）",
    mechanism:
      "腰の骨の間にあるクッション（椎間板）に負担がかかり、お尻から脚へ向かう神経が刺激されている可能性があります。\n前かがみ・長時間の座位は椎間板への圧力を高めるため、症状が出やすくなります。\n多くの場合、姿勢と動作の見直しで神経への刺激を減らしていけます。",
    selfCare:
      "【今日からできること】30分に1回は席を立ち、立った状態で腰に手を当てて軽く上体を起こす動きを10回。しびれが脚へ広がる動きは避け、腰側へ引いていく感覚を目安にしてください。",
    guideUrl: NOTE_GUIDE_URL_1,
  },

  r2: {
    kind: "result",
    id: "r2",
    typeName: "脊柱管狭窄タイプ",
    mechanism:
      "背骨の中の神経の通り道（脊柱管）が加齢変化などで狭くなり、歩行時に神経への血流が不足しやすくなっている可能性があります。\n前かがみになると通り道が広がるため、休むと楽になるのが特徴です。\n進行をゆるやかにするには、腰を反らしすぎない姿勢づくりと、続けられる運動が大切です。",
    selfCare:
      "【今日からできること】仰向けで両膝を胸に近づけて30秒キープ×3回。腰の後ろがゆるむ感覚を目安に、朝と寝る前に行ってみてください。",
    guideUrl: NOTE_GUIDE_URL_2,
  },

  r3: {
    kind: "result",
    id: "r3",
    typeName: "寝起き腰痛タイプ",
    mechanism:
      "睡眠中は体をあまり動かさないため、腰まわりの筋肉や関節が硬くこわばりやすくなります。\n寝具が合っていない・寝返りが少ないことも、朝だけ痛む腰痛の一因です。\n起き上がる前のひと手間で、朝の痛みは変えられます。",
    selfCare:
      "【今日からできること】起き上がる前にベッドの中で、両膝を立てて左右にゆっくり10回倒す→膝を抱えて30秒。それから横向き経由で起き上がってみてください。",
    guideUrl: NOTE_GUIDE_URL_3,
  },

  r4: {
    kind: "result",
    id: "r4",
    typeName: "座りすぎ・前かがみ負荷タイプ",
    mechanism:
      "長時間の座位では、腰のクッション（椎間板）に立位より大きな圧力がかかり続けます。\nさらに股関節の前が縮み、立ち上がる瞬間に腰へ急な負担が集中します。\n「座り続けない仕組み」を作ることが、一番の対策になります。",
    selfCare:
      "【今日からできること】30分に1回立ち上がり、立ったまま腰に手を当てて軽く上体を起こす×10秒。タイマーをセットして「座りっぱなしを切る」ことから始めてください。",
    guideUrl: NOTE_GUIDE_URL_4,
  },

  r5: {
    kind: "result",
    id: "r5",
    typeName: "反り腰・伸展負荷タイプ",
    mechanism:
      "骨盤が前に傾いて腰が反りすぎると、腰の後ろ側の関節に体重が乗り続けます。\n立ち仕事や反らす動作で痛むのは、この関節への負担が増えるためです。\n縮んだ股関節の前をゆるめ、お腹の支えを取り戻すことが改善の軸になります。",
    selfCare:
      "【今日からできること】片膝立ちになり、骨盤を立てたまま体重を前へ移して股関節の前を60秒伸ばす（左右）。立ち仕事の方は、片足を低い台に乗せる習慣も有効です。",
    guideUrl: NOTE_GUIDE_URL_5,
  },

  r6: {
    kind: "result",
    id: "r6",
    typeName: "急性腰痛（ぎっくり腰）タイプ",
    mechanism:
      "急な動作などで腰の筋肉・関節に負担がかかり、強い痛みと防御的なこわばりが出ている状態と考えられます。\n多くは数日〜2週間で回復に向かいますが、初期の過ごし方で回復スピードが変わります。\n「完全に寝て安静」より「痛くない範囲で動く」ほうが回復が早いことがわかっています。",
    selfCare:
      "【今日からできること】痛む動作だけを避けて、できる日常動作は続けてください。ズキズキと熱を持つ感じが強い初日は、痛む場所を15分ほど冷やすのも一案です。",
    guideUrl: NOTE_GUIDE_URL_6,
  },

  r7: {
    kind: "result",
    id: "r7",
    typeName: "慢性腰痛タイプ",
    mechanism:
      "3ヶ月以上続く腰痛は、組織の傷そのものより「筋力・姿勢・生活習慣・痛みへの不安」が絡み合って維持されていることが多いとされています。\n動かさないほど筋肉が弱り、さらに痛みやすくなる悪循環が起きがちです。\n順番を踏んだ運動で、この悪循環は断ち切れます。",
    selfCare:
      "【今日からできること】仰向けで膝を立て、息を吐きながら下腹を薄く凹ませて10秒キープ×10回（ドローイン）。「痛みがあっても、できる運動はある」が最初の一歩です。",
    guideUrl: NOTE_GUIDE_URL_7,
  },

  // ========== 出口A/B/C: 受診案内 ==========
  exitA: {
    kind: "referral",
    id: "exitA",
    urgency: "normal",
    title: "医療機関の受診をおすすめします",
    lead:
      "チェックいただいた項目は、セルフケアの対象外です。自己判断でのセルフケアは行わず、医療機関（整形外科）を受診してください。\n\n受診の際は、選択した症状（いつから・どんな時に）をそのまま医師に伝えてください。",
    department: "整形外科",
  },

  exitA_urgent: {
    kind: "referral",
    id: "exitA_urgent",
    urgency: "urgent",
    title: "できるだけ早い受診をおすすめします",
    lead:
      "排尿・排便の異常や肛門周囲の感覚の変化は、急いで対応すべき神経の圧迫が起きている可能性があるサインです。\n\nセルフケアの対象外です。できるだけ早く（当日〜翌日）、医療機関を受診してください。夜間・休日の場合は救急相談窓口（#7119など）への相談も検討してください。",
    department: "整形外科（救急対応のある医療機関）",
  },

  exitB: {
    kind: "referral",
    id: "exitB",
    urgency: "normal",
    title: "タイプの判定が難しいケースです",
    lead:
      "いただいた回答からは、タイプの判定が難しいケースです。あてはまらない症状の組み合わせには、専門的な評価が役立ちます。\n\n整形外科の受診をおすすめします。",
    department: "整形外科",
  },

  exitC: {
    kind: "referral",
    id: "exitC",
    urgency: "normal",
    title: "血管の血流が原因の可能性があります",
    lead:
      "「姿勢に関係なく、立ち止まるだけで治まる」しびれ・痛みは、腰ではなく脚の血管の血流が原因の可能性があります。\n\nその場合、腰のセルフケアでは対応できません。循環器内科または血管外科の受診をおすすめします。",
    department: "循環器内科または血管外科",
    extraSigns: [
      "足先が冷たい",
      "皮膚の色が悪い",
      "足の傷が治りにくい",
    ],
    note: "特に喫煙歴・糖尿病のある方は早めの受診をおすすめします",
  },
};

// ------------------- 開発時のフロー整合性チェック -------------------

/** 参照先ノードがすべて存在するか検証（開発時のみ使用） */
export function validateFlow(): string[] {
  const errors: string[] = [];
  const ids = new Set(Object.keys(flow));
  const check = (from: string, to: NodeId) => {
    if (!ids.has(to)) errors.push(`${from} → 存在しないノード '${to}'`);
  };
  for (const node of Object.values(flow)) {
    if (node.kind === "checklist") {
      check(node.id, node.nextIfNone);
      check(node.id, node.nextIfDanger);
      check(node.id, node.nextIfUrgent);
    } else if (node.kind === "question") {
      node.options.forEach((o) => check(node.id, o.next));
    }
  }
  if (!ids.has(START_NODE)) errors.push(`START_NODE '${START_NODE}' が存在しません`);
  return errors;
}
