import type { Assignment } from "../../../types.js";

export const s5Ch16DependentChain: Assignment = {
  id: "S5-Ch16-01-dependent-chain",
  stage: "S5",
  chapterId: "Ch16",
  sequence: 1,
  title: "依存関係のある 3 ステップを順に await する",
  newConcept:
    "前のステップの解決値を次のステップの入力に使う非同期チェーン。 並列化できない理由を体感する",
  estimatedMinutes: 50,
  difficulty: 2,
  testKind: "function",
  description: `## やること

ユーザー ID から **ユーザー → チーム → チームリーダー** の順にデータを辿る async 関数 \`loadUserProfile\` を実装してください。 各 fetch 関数は引数として受け取り、 結果を \`{ user, team, lead }\` の形で返します。

\`\`\`ts
async function loadUserProfile(userId, fetchUser, fetchTeam, fetchTeamLead)
// fetchUser(userId)        → Promise<{ id, teamId }>
// fetchTeam(teamId)        → Promise<{ id, leadId }>
// fetchTeamLead(leadId)    → Promise<{ id, name }>
\`\`\`

\`\`\`js
const fetchUser = (id) => Promise.resolve({ id, teamId: "t1" });
const fetchTeam = (id) => Promise.resolve({ id, leadId: "u9" });
const fetchTeamLead = (id) => Promise.resolve({ id, name: "Alice" });

await loadUserProfile("u1", fetchUser, fetchTeam, fetchTeamLead);
// → {
//     user: { id: "u1", teamId: "t1" },
//     team: { id: "t1", leadId: "u9" },
//     lead: { id: "u9", name: "Alice" },
//   }
\`\`\`

## ポイント

- これは **設計演習 (S5)** の最初の問題です。 「複数の非同期処理をどう組むか」 が今回の主題。
- 各ステップは **前のステップの解決値が無いと呼び出せない** ので、 \`Promise.all\` で並列化はできません。 「並列化しても速くならない、 順次 await が唯一の正解」 という形を手で書いて覚えます。
- 一つ前の S4-04 \`Promise.all\` は **独立な Promise を並列に待つ** ためのものでした。 「依存しているか」 を見極めることで、 並列 vs 直列の選び方が判断できます。

## ヒント

- AST で **async 関数** / **AwaitExpression** / **ReturnStatement** を必須。 **\`Promise.all\` / \`Promise.allSettled\` / \`.then(...)\` は forbidden** にしています (依存チェーンでは使い道がないため)。
- 3 つの await を順番に書き、 それぞれの返り値を変数に受けてから次に渡します。
`,
  starterCode: `// async function を使い、 fetchUser → fetchTeam → fetchTeamLead の順に
// 前の結果の id を次の引数に渡して await する
function loadUserProfile(userId, fetchUser, fetchTeam, fetchTeamLead) {
  // ここに実装する
}
`,
  entryPoints: ["loadUserProfile"],
  demoCall: `(async () => {
  const fetchUser = (id) => Promise.resolve({ id, teamId: "t1" });
  const fetchTeam = (id) => Promise.resolve({ id, leadId: "u9" });
  const fetchTeamLead = (id) => Promise.resolve({ id, name: "Alice" });
  console.log(JSON.stringify(await loadUserProfile("u1", fetchUser, fetchTeam, fetchTeamLead)));
})();`,
  tests: [
    {
      name: "3 ステップの結果が { user, team, lead } として返る",
      code: `(async () => {
        const fetchUser = (id) => Promise.resolve({ id, teamId: "t1" });
        const fetchTeam = (id) => Promise.resolve({ id, leadId: "u9" });
        const fetchTeamLead = (id) => Promise.resolve({ id, name: "Alice" });
        const r = await loadUserProfile("u1", fetchUser, fetchTeam, fetchTeamLead);
        return JSON.stringify(r) === JSON.stringify({
          user: { id: "u1", teamId: "t1" },
          team: { id: "t1", leadId: "u9" },
          lead: { id: "u9", name: "Alice" },
        });
      })()`,
    },
    {
      name: "呼び出し順は fetchUser → fetchTeam → fetchTeamLead",
      code: `(async () => {
        const calls = [];
        const fetchUser = (id) => { calls.push("user"); return Promise.resolve({ id, teamId: "t1" }); };
        const fetchTeam = (id) => { calls.push("team"); return Promise.resolve({ id, leadId: "u9" }); };
        const fetchTeamLead = (id) => { calls.push("lead"); return Promise.resolve({ id, name: "L" }); };
        await loadUserProfile("u1", fetchUser, fetchTeam, fetchTeamLead);
        return JSON.stringify(calls) === JSON.stringify(["user", "team", "lead"]);
      })()`,
    },
    {
      name: "fetchTeam は user.teamId を、 fetchTeamLead は team.leadId を受け取る",
      code: `(async () => {
        const received = { team: null, lead: null };
        const fetchUser = (id) => Promise.resolve({ id, teamId: "T-77" });
        const fetchTeam = (id) => { received.team = id; return Promise.resolve({ id, leadId: "L-88" }); };
        const fetchTeamLead = (id) => { received.lead = id; return Promise.resolve({ id, name: "X" }); };
        await loadUserProfile("u1", fetchUser, fetchTeam, fetchTeamLead);
        return received.team === "T-77" && received.lead === "L-88";
      })()`,
    },
    {
      name: "fetchUser が reject すると全体が reject する",
      code: `(async () => {
        const fetchUser = () => Promise.reject(new Error("user-fail"));
        const fetchTeam = () => Promise.resolve({ id: "t", leadId: "l" });
        const fetchTeamLead = () => Promise.resolve({ id: "l", name: "X" });
        try {
          await loadUserProfile("u1", fetchUser, fetchTeam, fetchTeamLead);
          return false;
        } catch (e) {
          return e instanceof Error && e.message === "user-fail";
        }
      })()`,
    },
    {
      name: "fetchTeam が reject すると fetchTeamLead は呼ばれない",
      code: `(async () => {
        let leadCalled = false;
        const fetchUser = (id) => Promise.resolve({ id, teamId: "t1" });
        const fetchTeam = () => Promise.reject(new Error("team-fail"));
        const fetchTeamLead = () => { leadCalled = true; return Promise.resolve({ id: "l", name: "X" }); };
        try {
          await loadUserProfile("u1", fetchUser, fetchTeam, fetchTeamLead);
          return false;
        } catch (e) {
          return e instanceof Error && e.message === "team-fail" && leadCalled === false;
        }
      })()`,
    },
    {
      name: "戻り値は Promise",
      code: `loadUserProfile(
        "u1",
        () => Promise.resolve({ id: "u1", teamId: "t1" }),
        () => Promise.resolve({ id: "t1", leadId: "l" }),
        () => Promise.resolve({ id: "l", name: "X" }),
      ) instanceof Promise`,
    },
    {
      name: "別の userId / teamId / leadId でも正しく辿る",
      code: `(async () => {
        const fetchUser = (id) => Promise.resolve({ id, teamId: id + "-t" });
        const fetchTeam = (id) => Promise.resolve({ id, leadId: id + "-l" });
        const fetchTeamLead = (id) => Promise.resolve({ id, name: id.toUpperCase() });
        const r = await loadUserProfile("u42", fetchUser, fetchTeam, fetchTeamLead);
        return r.user.teamId === "u42-t"
          && r.team.leadId === "u42-t-l"
          && r.lead.name === "U42-T-L";
      })()`,
    },
  ],
  hints: [
    "const user = await fetchUser(userId); const team = await fetchTeam(user.teamId); const lead = await fetchTeamLead(team.leadId); return { user, team, lead };",
    "解答例:\n```js\nasync function loadUserProfile(userId, fetchUser, fetchTeam, fetchTeamLead) {\n  const user = await fetchUser(userId);\n  const team = await fetchTeam(user.teamId);\n  const lead = await fetchTeamLead(team.leadId);\n  return { user, team, lead };\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        { kind: "async-fn", label: "async 関数で書く" },
        {
          kind: "node",
          nodeType: "AwaitExpression",
          label: "await で前のステップの結果を取り出す",
        },
        {
          kind: "node",
          nodeType: "ReturnStatement",
          label: "return で { user, team, lead } を返す",
        },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
        {
          kind: "method",
          name: "then",
          label: ".then ではなく await を使う",
        },
        {
          kind: "method",
          name: "all",
          label:
            "依存チェーンでは Promise.all は使えない (前のステップの結果が無いと次を呼べないため)",
        },
        {
          kind: "method",
          name: "allSettled",
          label:
            "依存チェーンでは Promise.allSettled も使い道がない (順次 await で書く)",
        },
      ],
    },
  },
  solution: `async function loadUserProfile(userId, fetchUser, fetchTeam, fetchTeamLead) {
  const user = await fetchUser(userId);
  const team = await fetchTeam(user.teamId);
  const lead = await fetchTeamLead(team.leadId);
  return { user, team, lead };
}
`,
  badSolutions: [
    {
      code: `function loadUserProfile(userId, fetchUser, fetchTeam, fetchTeamLead) {
  return fetchUser(userId)
    .then((user) => fetchTeam(user.teamId).then((team) => fetchTeamLead(team.leadId).then((lead) => ({ user, team, lead }))));
}
`,
      description:
        ".then チェーンで書いている (AST forbidden 違反 + async-fn / AwaitExpression required 違反)",
    },
    {
      code: `async function loadUserProfile(userId, fetchUser, fetchTeam, fetchTeamLead) {
  const [user, team, lead] = await Promise.all([
    fetchUser(userId),
    fetchTeam(userId),
    fetchTeamLead(userId),
  ]);
  return { user, team, lead };
}
`,
      description:
        "Promise.all で並列化しているが、 fetchTeam / fetchTeamLead が userId を受け取っており依存関係が無視されている (AST forbidden 違反 + 「team は user.teamId を受け取る」 テスト失敗)",
    },
    {
      code: `async function loadUserProfile(userId, fetchUser, fetchTeam, fetchTeamLead) {
  const user = await fetchUser(userId);
  const team = await fetchTeam(user.teamId);
  const lead = await fetchTeamLead(team.leadId);
  return lead;
}
`,
      description:
        "lead だけを返してしまっており、 { user, team, lead } の形になっていない (テスト失敗)",
    },
  ],
  mdnSections: [
    {
      heading: "await",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/await",
      pageTitle: "await",
    },
    {
      heading: "Promise を使う",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Using_promises",
      pageTitle: "Promise を使う",
    },
  ],
};
