import type { Assignment } from "../../types.js";
import { COMMON_LINT_RULES } from "../_common.js";

export const todoClass: Assignment = {
  id: "todo-class",
  topicId: "classes-basics",
  title: "Todo クラスで完了状態を管理する",
  difficulty: 2,
  description: `## Todo クラスで完了状態を管理する

\`{ id, title }\` を受け取り Todo を表現する **\`Todo\` クラス** を実装してください。

- コンストラクタ: \`new Todo({ id, title })\` で \`id\`, \`title\` を保存し、\`done\` を \`false\` に初期化
- \`complete()\`: \`done\` を \`true\` にする
- \`reopen()\`: \`done\` を \`false\` に戻す
- \`label()\`: \`done\` なら \`'[x] {title}'\`、そうでなければ \`'[ ] {title}'\`

### 入出力例

\`\`\`js
const t = new Todo({ id: 1, title: '買い物' });
t.id          // → 1
t.title       // → '買い物'
t.done        // → false
t.label()     // → '[ ] 買い物'

t.complete();
t.label()     // → '[x] 買い物'

t.reopen();
t.label()     // → '[ ] 買い物'
\`\`\`

### 制約

- **\`class\` 構文** を使う
- コンストラクタ引数は **オブジェクト分割代入** で受ける: \`constructor({ id, title })\`
- \`label()\` は **テンプレートリテラル** で組み立てる
- \`var\` は使わない
`,
  starterCode: `class Todo {
  constructor({ id, title }) {
    this.id = id;
    this.title = title;
    this.done = false;
  }

  complete() {}
  reopen() {}
  label() { return ''; }
}
`,
  solution: "class Todo {\n  constructor({ id, title }) {\n    this.id = id;\n    this.title = title;\n    this.done = false;\n  }\n  complete() { this.done = true; }\n  reopen() { this.done = false; }\n  label() {\n    return `${this.done ? '[x]' : '[ ]'} ${this.title}`;\n  }\n}\n",
  entryPoints: ["Todo"],
  tests: [
    {
      name: "初期状態",
      code: "(() => { const t = new Todo({id:1,title:'買い物'}); return t.id === 1 && t.title === '買い物' && t.done === false; })()",
    },
    {
      name: "未完了 label",
      code: "new Todo({id:1,title:'買い物'}).label() === '[ ] 買い物'",
    },
    {
      name: "complete",
      code: "(() => { const t = new Todo({id:1,title:'掃除'}); t.complete(); return t.done === true; })()",
    },
    {
      name: "完了 label",
      code: "(() => { const t = new Todo({id:1,title:'掃除'}); t.complete(); return t.label() === '[x] 掃除'; })()",
    },
    {
      name: "reopen",
      code: "(() => { const t = new Todo({id:1,title:'A'}); t.complete(); t.reopen(); return t.done === false && t.label() === '[ ] A'; })()",
    },
    {
      name: "instanceof",
      code: "new Todo({id:1,title:'A'}) instanceof Todo",
    },
  ],
  eslint: { rules: { ...COMMON_LINT_RULES } },
  ast: {
    required: [
      {
        kind: "node",
        nodeType: "ClassDeclaration",
        label: "class 構文を使う",
      },
      {
        kind: "node",
        nodeType: "ObjectPattern",
        label: "constructor で分割代入を使う",
      },
      {
        kind: "node",
        nodeType: "TemplateLiteral",
        label: "テンプレートリテラルを使う",
      },
    ],
    forbidden: [{ kind: "var", label: "var は使わない" }],
  },
};
