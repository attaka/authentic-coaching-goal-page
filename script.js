const defaults = {
  domain: "仕事・事業",
  current: "今の仕事の範囲で評価を上げる",
  want: "言語と思考を拡張する学習ツールを世界中の人が使える形にする",
  world: "人が自分の可能性を狭く見積もらず、学びたい瞬間に自由に深く学べる",
  wantScore: 8,
  outsideScore: 7,
  socialScore: 6,
  vividScore: 5,
};

const fields = {
  domain: document.querySelector("#domain"),
  current: document.querySelector("#current"),
  want: document.querySelector("#want"),
  world: document.querySelector("#world"),
  wantScore: document.querySelector("#want-score"),
  outsideScore: document.querySelector("#outside-score"),
  socialScore: document.querySelector("#social-score"),
  vividScore: document.querySelector("#vivid-score"),
};

const scoreNode = document.querySelector("#score");
const captionNode = document.querySelector("#score-caption");
const draftNode = document.querySelector("#draft-goal");
const questionList = document.querySelector("#next-questions");
const cueNode = document.querySelector("#daily-cue");

function readState() {
  return {
    domain: fields.domain.value,
    current: fields.current.value.trim(),
    want: fields.want.value.trim(),
    world: fields.world.value.trim(),
    wantScore: Number(fields.wantScore.value),
    outsideScore: Number(fields.outsideScore.value),
    socialScore: Number(fields.socialScore.value),
    vividScore: Number(fields.vividScore.value),
  };
}

function scoreGoal(state) {
  return Math.round(
    state.wantScore * 0.3 +
      state.outsideScore * 0.3 +
      state.socialScore * 0.2 +
      state.vividScore * 0.2,
  );
}

function generateGoal(event) {
  if (event) event.preventDefault();
  const state = readState();
  const score = scoreGoal(state);
  const currentAnchor = state.current || "現在の延長線";
  const want = state.want || "まだ言葉になっていないwant-to";
  const world = state.world || "それが当たり前になった世界";

  scoreNode.textContent = `${score}/10`;
  captionNode.textContent = score >= 8
    ? "現状の外側に向かう力が強い候補です。臨場感をさらに上げましょう。"
    : score >= 6
      ? "良い仮ゴールです。現状の外側と社会性をもう少し膨らませられます。"
      : "まだ現状寄りかもしれません。安全な延長線から少し離してみましょう。";

  draftNode.textContent =
    `${state.domain}において、私は「${currentAnchor}」に収まらず、` +
    `「${want}」を実現する。結果として「${world}」が自然な現実になる。`;

  const questions = [
    `これが本当にwant-toなら、誰に止められても残る衝動はどこにありますか？`,
    `このゴールが実現した未来の自分にとって、今日の当たり前は何ですか？`,
    `現状の延長線に戻そうとする声は、誰の評価や過去の記憶に由来していますか？`,
    `このゴールが他者や社会に広がると、誰の自由が増えますか？`,
  ];
  questionList.innerHTML = questions.map((question) => `<li>${escapeHtml(question)}</li>`).join("");

  cueNode.textContent =
    `今日の観察: 「${want.slice(0, 34)}」がすでに実現している人なら、` +
    `次の30分で何を調べ、誰に会い、何をやめるかを1つだけ書く。`;
}

function resetForm() {
  fields.domain.value = defaults.domain;
  fields.current.value = defaults.current;
  fields.want.value = defaults.want;
  fields.world.value = defaults.world;
  fields.wantScore.value = defaults.wantScore;
  fields.outsideScore.value = defaults.outsideScore;
  fields.socialScore.value = defaults.socialScore;
  fields.vividScore.value = defaults.vividScore;
  generateGoal();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function drawField() {
  const canvas = document.querySelector("#field-canvas");
  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(rect.width * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, rect.width, rect.height);
  ctx.fillStyle = "#f5f1e8";
  ctx.fillRect(0, 0, rect.width, rect.height);

  const centerX = rect.width * 0.72;
  const centerY = rect.height * 0.26;
  for (let i = 0; i < 8; i += 1) {
    ctx.beginPath();
    ctx.strokeStyle = i % 2 === 0 ? "rgba(18,108,114,.16)" : "rgba(195,74,48,.12)";
    ctx.lineWidth = 1.2;
    ctx.arc(centerX, centerY, 90 + i * 70, 0, Math.PI * 2);
    ctx.stroke();
  }

  const nodes = [
    [0.16, 0.28, "want-to"],
    [0.34, 0.48, "outside"],
    [0.58, 0.38, "future self"],
    [0.78, 0.62, "world"],
    [0.26, 0.76, "daily cue"],
  ];
  ctx.lineWidth = 2;
  for (let i = 0; i < nodes.length - 1; i += 1) {
    const [ax, ay] = nodes[i];
    const [bx, by] = nodes[i + 1];
    ctx.strokeStyle = "rgba(18,108,114,.28)";
    ctx.beginPath();
    ctx.moveTo(ax * rect.width, ay * rect.height);
    ctx.lineTo(bx * rect.width, by * rect.height);
    ctx.stroke();
  }
  for (const [x, y, label] of nodes) {
    ctx.fillStyle = label === "outside" ? "#c34a30" : "#126c72";
    ctx.beginPath();
    ctx.arc(x * rect.width, y * rect.height, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(21,23,24,.64)";
    ctx.font = "700 12px system-ui";
    ctx.fillText(label, x * rect.width + 12, y * rect.height + 4);
  }
}

document.querySelector("#goal-form").addEventListener("submit", generateGoal);
document.querySelector("#reset-form").addEventListener("click", resetForm);
Object.values(fields).forEach((field) => field.addEventListener("input", generateGoal));
window.addEventListener("resize", drawField);

resetForm();
drawField();

