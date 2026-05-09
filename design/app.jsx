/* global React, ReactDOM */
const { useState, useMemo, useEffect } = React;

// ─── Mock data (mirrors @jsreview/shared/assignments structure) ──────
const TOPICS = [
  {
    id: "fundamentals",
    label: "JavaScript の基礎",
    description: "変数宣言・演算子・型変換まわりの落とし穴を踏みつぶす。",
    mdnUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide",
  },
  {
    id: "control-flow",
    label: "条件分岐とループ",
    description: "if / switch / for / while をきちんと書けるようになる。",
    mdnUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Control_flow_and_error_handling",
  },
  {
    id: "arrays",
    label: "配列操作",
    description: "map / filter / reduce を使い分け、forEach に逃げない。",
    mdnUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array",
  },
  {
    id: "functions",
    label: "関数とスコープ",
    description: "クロージャ・this・アロー関数を腑に落とす。",
    mdnUrl: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Functions",
  },
];

const ASSIGNMENTS = [
  { id: "a1",  topicId: "fundamentals",  title: "var を const / let に置き換える", difficulty: 1 },
  { id: "a2",  topicId: "fundamentals",  title: "== を === に直して型強制を防ぐ", difficulty: 1 },
  { id: "a3",  topicId: "fundamentals",  title: "数値と文字列の暗黙変換に気づく", difficulty: 2 },
  { id: "a4",  topicId: "control-flow",  title: "if 文を早期 return に整理する", difficulty: 1 },
  { id: "a5",  topicId: "control-flow",  title: "ネストした for を flatMap に書き換え", difficulty: 2 },
  { id: "a6",  topicId: "control-flow",  title: "while(true) の脱出条件を実装する", difficulty: 3 },
  { id: "a7",  topicId: "arrays",        title: "合計を reduce で実装する", difficulty: 1 },
  { id: "a8",  topicId: "arrays",        title: "配列を一意化する (Set 利用)", difficulty: 2 },
  { id: "a9",  topicId: "arrays",        title: "オブジェクト配列を groupBy する", difficulty: 3 },
  { id: "a10", topicId: "functions",     title: "アロー関数で this を保持する", difficulty: 2 },
  { id: "a11", topicId: "functions",     title: "クロージャでカウンタを実装する", difficulty: 2 },
  { id: "a12", topicId: "functions",     title: "高階関数を引数に取る関数を書く", difficulty: 3 },
];

const CLEARED_DEFAULT = new Set(["a1", "a2", "a4", "a7"]);

const ASSIGNMENT_BODY = {
  default: {
    h2: "配列の合計を reduce で実装する",
    body: [
      ["p", "次の関数 ", ["code", "sum(numbers)"], " を完成させてください。引数 ", ["code", "numbers"], " は数値の配列です。空配列が渡された場合は ", ["code", "0"], " を返してください。"],
      ["h3", "要件"],
      ["ul",
        ["li", ["code", "Array.prototype.reduce"], " を使うこと"],
        ["li", "ループ構文 (", ["code", "for"], " / ", ["code", "while"], ") は使わないこと"],
        ["li", "副作用を持たない純粋な関数にすること"],
      ],
      ["h3", "入出力例"],
      ["pre",
        "sum([])           // → 0\nsum([1, 2, 3])    // → 6\nsum([10, -3, 5])  // → 12\n",
      ],
      ["h3", "採点ルール"],
      ["table",
        [["観点", "配点", "判定方法"]],
        [
          ["テスト通過率", "60点", "サーバ側 isolated-vm"],
          ["AST 解析", "30点", "クライアント側"],
          ["ESLint", "10点", "クライアント側"],
        ],
      ],
    ],
  },
};

// ─── Atoms ──────────────────────────────────────────────────────────
function BrandMark() {
  return (
    <span className="brand-mark" aria-label="Acial Design">
      <span className="a-grad">A</span>cial Design
    </span>
  );
}

function StatusBadge({ status }) {
  if (status === "cleared") {
    return <span className="card-status card-status-cleared">✓ Cleared</span>;
  }
  return <span className="card-status card-status-uncleared">未クリア</span>;
}

function DifficultyStars({ value }) {
  return (
    <span className="card-difficulty" title={`難易度 ${value}`}>
      {"★".repeat(value)}
      <span className="card-difficulty-dim">{"★".repeat(3 - value)}</span>
    </span>
  );
}

// ─── Select Page ─────────────────────────────────────────────────────
function SelectPage({ clearedSet, onOpenAssignment }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [query, setQuery] = useState("");

  const summary = useMemo(() => {
    let cleared = 0;
    for (const a of ASSIGNMENTS) if (clearedSet.has(a.id)) cleared++;
    return { total: ASSIGNMENTS.length, cleared, uncleared: ASSIGNMENTS.length - cleared };
  }, [clearedSet]);

  const numbers = useMemo(
    () => new Map(ASSIGNMENTS.map((a, i) => [a.id, i + 1])),
    []
  );

  const groups = useMemo(() => {
    const norm = query.trim().toLowerCase();
    return TOPICS.map((t) => {
      const items = ASSIGNMENTS.filter((a) => a.topicId === t.id).filter((a) => {
        if (difficultyFilter !== "all" && a.difficulty !== difficultyFilter) return false;
        const cleared = clearedSet.has(a.id);
        if (statusFilter === "cleared" && !cleared) return false;
        if (statusFilter === "uncleared" && cleared) return false;
        if (norm && !`${a.title} ${t.label}`.toLowerCase().includes(norm)) return false;
        return true;
      });
      return { topic: t, items };
    }).filter((g) => g.items.length > 0);
  }, [clearedSet, statusFilter, difficultyFilter, query]);

  const hasActive = statusFilter !== "all" || difficultyFilter !== "all" || query !== "";

  return (
    <div className="app">
      <header className="header">
        <div className="header-title">
          <BrandMark />
          <span className="brand-divider" />
          <h1>JS自動コードレビュー <span className="header-tag">Prototype</span></h1>
        </div>
      </header>

      <main className="select-main">
        <section className="select-summary">
          <div className="summary-headline">
            <span className="eyebrow">Sports Life Hack · Engineering</span>
            <h2>
              アスリートのための<span className="grad">JavaScript</span>演習
            </h2>
            <p className="summary-sub">
              MDN の章立てに沿った全 {summary.total} 問。実行は安全な isolated-vm、
              静的解析はブラウザの中。コードを書いて、測って、もう一歩前へ。
            </p>
          </div>
          <dl className="summary-stats">
            <div className="stat-cleared">
              <dt>Cleared</dt>
              <dd><strong>{summary.cleared}</strong><span className="summary-suffix"> / {summary.total}</span></dd>
            </div>
            <div>
              <dt>Uncleared</dt>
              <dd><strong>{summary.uncleared}</strong></dd>
            </div>
            <div>
              <dt>Topics</dt>
              <dd><strong>{TOPICS.length}</strong></dd>
            </div>
          </dl>
        </section>

        <section className="select-filters" aria-label="絞り込み">
          <fieldset className="filter-group">
            <legend className="sr-only">状態で絞り込み</legend>
            {[
              { id: "all", label: "すべて" },
              { id: "uncleared", label: "未クリア" },
              { id: "cleared", label: "クリア済み" },
            ].map((f) => (
              <label key={f.id} className={`chip${statusFilter === f.id ? " is-active" : ""}`}>
                <input type="radio" name="s" className="sr-only"
                  checked={statusFilter === f.id} onChange={() => setStatusFilter(f.id)} />
                {f.label}
              </label>
            ))}
          </fieldset>
          <fieldset className="filter-group">
            <legend className="sr-only">難易度で絞り込み</legend>
            {[
              { id: "all", label: "難易度すべて" },
              { id: 1, label: "★" },
              { id: 2, label: "★★" },
              { id: 3, label: "★★★" },
            ].map((f) => (
              <label key={String(f.id)} className={`chip${difficultyFilter === f.id ? " is-active" : ""}`}>
                <input type="radio" name="d" className="sr-only"
                  checked={difficultyFilter === f.id} onChange={() => setDifficultyFilter(f.id)} />
                {f.label}
              </label>
            ))}
          </fieldset>
          <div className="filter-search">
            <input
              type="search"
              className="search-input"
              placeholder="課題名・トピックを検索..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {hasActive && (
              <button className="btn-link" onClick={() => { setStatusFilter("all"); setDifficultyFilter("all"); setQuery(""); }}>
                条件をクリア
              </button>
            )}
          </div>
        </section>

        {groups.length === 0 ? (
          <p className="empty-state">条件に合う課題がありません。フィルタを変更してください。</p>
        ) : (
          groups.map(({ topic, items }) => {
            const clearedCount = items.reduce((n, a) => clearedSet.has(a.id) ? n + 1 : n, 0);
            const allDone = clearedCount === items.length;
            return (
              <section key={topic.id} className="topic-section">
                <header className="topic-section-header">
                  <div className="topic-section-titles">
                    <h3>{topic.label}</h3>
                    {topic.description && <p className="topic-section-desc">{topic.description}</p>}
                  </div>
                  <div className="topic-section-meta">
                    <span className={`topic-section-progress${allDone ? " is-complete" : ""}`}>
                      {clearedCount}/{items.length}
                    </span>
                    <a className="topic-mdn-link" href={topic.mdnUrl} target="_blank" rel="noreferrer">MDN ↗</a>
                  </div>
                </header>
                <ul className="card-grid">
                  {items.map((a) => {
                    const cleared = clearedSet.has(a.id);
                    return (
                      <li key={a.id}>
                        <a
                          href={`#/problems/${a.id}`}
                          className={`assignment-card status-${cleared ? "cleared" : "uncleared"}`}
                          onClick={(e) => { e.preventDefault(); onOpenAssignment(a.id); }}
                        >
                          <div className="card-top">
                            <span className="card-num">#{String(numbers.get(a.id)).padStart(2, "0")}</span>
                            <StatusBadge status={cleared ? "cleared" : "uncleared"} />
                          </div>
                          <div className="card-title">{a.title}</div>
                          <div className="card-bottom">
                            <DifficultyStars value={a.difficulty} />
                            <span className="card-cta">解く <span className="arrow">→</span></span>
                          </div>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })
        )}
      </main>
    </div>
  );
}

// ─── Practice Page ───────────────────────────────────────────────────
function renderNode(n, key) {
  if (typeof n === "string") return n;
  const [tag, ...rest] = n;
  if (tag === "ul") {
    return <ul key={key}>{rest.map((c, i) => renderNode(c, i))}</ul>;
  }
  if (tag === "table") {
    const [head, body] = rest;
    return (
      <table key={key}>
        <thead><tr>{head[0].map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
        <tbody>
          {body.map((row, ri) => (
            <tr key={ri}>{row.map((c, ci) => <td key={ci}>{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    );
  }
  if (tag === "pre") {
    return <pre key={key}><code>{rest[0]}</code></pre>;
  }
  const Tag = tag;
  return <Tag key={key}>{rest.map((c, i) =>
    typeof c === "string" ? c : <React.Fragment key={i}>{renderNode(c, i)}</React.Fragment>
  )}</Tag>;
}

function CodeMirrorMock() {
  // intentionally has a `var` and `==` with red wavy underline like an ESLint mark
  const lines = [
    [["com", "// 配列の合計を reduce で求める"]],
    [["kw", "function "], ["fn", "sum"], "(numbers) {"],
    ["  ", ["kw", "return"], " numbers.", ["fn", "reduce"], "((acc, n) => acc + n, ", ["num", "0"], ");"],
    ["}"],
    [""],
    [["com", "// 動作確認"]],
    [["kw", "const"], " result ", "= ", ["fn", "sum"], "([", ["num", "1"], ", ", ["num", "2"], ", ", ["num", "3"], "]);"],
    [["kw", "var"], " ok ", ["underline-err", "=="], " ", ["num", "6"], ";  ", ["com", "// ESLint: prefer-const, eqeqeq"]],
    ["console.", ["fn", "log"], "(", ["str", "\"sum\""], ", result, ok);"],
  ];
  return (
    <div className="cm-mock" role="textbox" aria-readonly="true">
      {lines.map((parts, i) => (
        <div key={i}>
          <span className="ln">{i + 1}</span>
          {parts.map((p, j) => {
            if (typeof p === "string") return <span key={j}>{p}</span>;
            const [cls, txt] = p;
            return <span key={j} className={cls}>{txt}</span>;
          })}
          {"\n"}
        </div>
      ))}
    </div>
  );
}

function PracticePage({ assignmentId, clearedSet, onBack }) {
  const a = ASSIGNMENTS.find((x) => x.id === assignmentId) || ASSIGNMENTS[0];
  const topic = TOPICS.find((t) => t.id === a.topicId);
  const cleared = clearedSet.has(a.id);
  const body = ASSIGNMENT_BODY.default;

  return (
    <div className="app">
      <header className="header">
        <div className="header-title">
          <a href="#/" className="back-link" onClick={(e) => { e.preventDefault(); onBack(); }}>
            ← 問題一覧
          </a>
          <span className="brand-divider" />
          <BrandMark />
          <span className="brand-divider" />
          <h1>JS自動コードレビュー <span className="header-tag">Prototype</span></h1>
        </div>
        <div className="header-controls">
          <span className={`clear-status${cleared ? " is-cleared" : ""}`}>
            {cleared ? "クリア済み" : "未クリア"}
          </span>
          <button className="btn">リセット</button>
        </div>
      </header>

      <div className="body-practice">
        <aside className="left-pane">
          <div className="assignment-description">
            {topic && (
              <span className="assignment-topic-tag">
                <a href={topic.mdnUrl} target="_blank" rel="noreferrer">{topic.label}</a>
                {topic.description ? ` — ${topic.description}` : null}
              </span>
            )}
            <h2>{a.title}</h2>
            {body.body.map((node, i) => (
              <React.Fragment key={i}>{renderNode(node, i)}</React.Fragment>
            ))}
          </div>
        </aside>

        <section className="right-pane">
          <div className="editor-wrap">
            <CodeMirrorMock />
          </div>
          <div className="run-bar">
            <span className="run-bar-meta">
              <span className="architecture-tag client">Client · ESLint + AST</span>
              <span style={{display:"inline-block", width:8}} />
              <span className="architecture-tag server">Server · isolated-vm</span>
            </span>
            <button className="btn-primary">▶ 採点を実行</button>
          </div>
        </section>
      </div>
    </div>
  );
}

// ─── Root ────────────────────────────────────────────────────────────
function App() {
  const [route, setRoute] = useState(() => parseHash());
  const [clearedSet] = useState(() => new Set(CLEARED_DEFAULT));

  function parseHash() {
    const h = window.location.hash || "#/";
    const m = h.match(/^#\/problems\/([a-z0-9-]+)/i);
    if (m) return { name: "practice", id: m[1] };
    return { name: "select" };
  }

  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  function open(id) { window.location.hash = `#/problems/${id}`; }
  function back() { window.location.hash = "#/"; }

  return route.name === "practice"
    ? <PracticePage assignmentId={route.id} clearedSet={clearedSet} onBack={back} />
    : <SelectPage clearedSet={clearedSet} onOpenAssignment={open} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
