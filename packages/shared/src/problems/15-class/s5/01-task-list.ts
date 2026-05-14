import type { Assignment } from "../../../types.js";
import { singleFile } from "../../_common.js";

export const s5Ch15TaskList: Assignment = {
  id: "S5-Ch15-01-task-list",
  stage: "S5",
  chapterId: "Ch15",
  sequence: 1,
  title: "Task と TaskList の 2 class でタスクリストを設計する",
  newConcept:
    "1 つの class に詰め込まず、 値 (`Task`) と集合 (`TaskList`) で責務を分ける。 集合側は `#tasks` を private に持ち、 ID 採番・追加・完了・抽出を担う。 状態遷移は Task 自身に委譲し、 抽出メソッドは内部配列のコピーを返して外から壊されないようにする",
  estimatedMinutes: 50,
  difficulty: 2,
  testKind: "function",
  lintPreset: "S5",
  description: `## やること

S5 (設計演習) の入口です。 S4 では \`class\` の基本形・継承・\`static\`・\`#privateField\` を 1 つの class 単位で扱いました。 S5 では **複数 class の連携** に踏み込みます。 ここでは **\`Task\` と \`TaskList\` の 2 つの class** でタスクリストを表現してください。

### Task

- \`constructor(id, title)\` で **\`#id\` / \`#title\` / \`#done\` (初期値 \`false\`)** を private フィールドに持つ。
- \`getId()\` / \`getTitle()\` / \`isDone()\` で読み出す (setter は作らない)。
- \`complete()\` で \`#done\` を \`true\` に、 \`reopen()\` で \`false\` に戻す。

### TaskList

- \`constructor()\` で **\`#tasks = []\`** と **\`#nextId = 1\`** を private に持つ。
- \`add(title)\`: \`#nextId\` を使って **\`Task\` を生成して内部配列に積み**、 生成した \`Task\` を **戻り値で返す**。 採番後に \`#nextId\` を 1 進める。
- \`completeById(id)\`: 該当 \`Task\` を見つけたら \`task.complete()\` を呼んで \`true\`、 見つからなければ \`false\` を返す (TaskList が直接 \`#done\` を触らず Task に委譲する)。
- \`pending()\` / \`completed()\`: それぞれ未完了 / 完了の Task を **新しい配列にコピーして** 返す (内部 \`#tasks\` の参照を直接返してはいけない)。
- \`count()\`: 全タスク数。

\`\`\`js
const list = new TaskList();
const t1 = list.add("買い物");        // → Task インスタンス
const t2 = list.add("洗濯");
t1.getId();                            // → 1
t2.getId();                            // → 2

list.count();                          // → 2
list.pending().length;                 // → 2

list.completeById(1);                  // → true
t1.isDone();                           // → true
list.pending().length;                 // → 1
list.completed().length;               // → 1

list.completeById(999);                // → false (存在しない)

// pending() の戻り値を push しても TaskList の内部は壊れない
list.pending().push("dummy");
list.count();                          // → 2 のまま
\`\`\`

## ポイント

### 「値」 と 「集合」 を別 class に分ける

\`Task\` は **1 件の情報の入れ物** (値オブジェクトに近い) で、 \`TaskList\` は **複数の Task を抱える集合** です。 1 つの class に \`tasks\` 配列と \`title\` を同居させると、 「これは 1 件のことを表すクラス? それとも全体?」 が読み手に伝わらなくなります。 役割を別 class に分けるのが設計の出発点です。

### 状態遷移は持ち主に委譲する

\`completeById(id)\` の中で \`task.#done = true\` のように直接書き換えるのは不可能 (private なので) ですし、 仮にできたとしても **状態の変え方が Task と TaskList の両方に散る** ことになります。 \`task.complete()\` を呼ぶことで、 「完了するとはどういうことか」 を Task 1 箇所にまとめられます。

### 「スナップショットを返す」 という規約

\`pending()\` が \`this.#tasks.filter(...)\` のように **新しい配列** を返せば、 呼び出し側がそれを push しても TaskList の内部状態は壊れません。 これは GUI 表示などで 「今のスナップショットがほしい」 ユースケースの定石です。

### ID 採番の責務は集合側に置く

\`Task\` 自身が ID を決めると、 「2 つの Task が同じ id を持たない」 という不変条件を担保できません。 採番は集合 (\`TaskList\`) 側で **\`#nextId\`** を private に持って一括管理します。

### 守るべき設計

- **\`Task\` と \`TaskList\` の 2 つの class** を定義する。 entryPoints も両方を指定します。
- \`#id\` / \`#title\` / \`#done\` / \`#tasks\` / \`#nextId\` を **private フィールド** で持つ。
- \`var\` / \`==\` / \`!=\` は使わない。
`,
  starterFiles: singleFile(`// Task と TaskList の 2 つのクラスを定義してください
class Task {
  // #id / #title / #done を private フィールドで持つ
  // getId() / getTitle() / isDone() / complete() / reopen() を実装する
}

class TaskList {
  // #tasks = []; と #nextId = 1; を private で持つ
  // add(title) → Task を返す
  // completeById(id) → true / false
  // pending() / completed() → 新しい配列を返す
  // count() → number
}
`),
  entryPoints: ["Task", "TaskList"],
  demoCall: `const list = new TaskList(); const t = list.add("買い物"); list.completeById(t.getId()); console.log(list.completed().length);`,
  tests: [
    {
      name: "Task と TaskList の両方が class として定義されている",
      code: `typeof Task === "function" && typeof TaskList === "function"`,
    },
    {
      name: "新しい TaskList の count は 0",
      code: `new TaskList().count() === 0`,
    },
    {
      name: "add は Task インスタンスを返し count が増える",
      code: `(() => { const l = new TaskList(); const t = l.add("a"); return (t instanceof Task) && l.count() === 1; })()`,
    },
    {
      name: "add で採番される id は 1, 2, 3, ... と進む",
      code: `(() => { const l = new TaskList(); const a = l.add("x"); const b = l.add("y"); const c = l.add("z"); return a.getId() === 1 && b.getId() === 2 && c.getId() === 3; })()`,
    },
    {
      name: "Task は最初 isDone() === false",
      code: `(() => { const l = new TaskList(); const t = l.add("a"); return t.isDone() === false; })()`,
    },
    {
      name: "completeById は存在する Task を完了して true を返す",
      code: `(() => { const l = new TaskList(); const t = l.add("a"); const ok = l.completeById(t.getId()); return ok === true && t.isDone() === true; })()`,
    },
    {
      name: "completeById は存在しない id に対して false を返す",
      code: `(() => { const l = new TaskList(); l.add("a"); return l.completeById(999) === false; })()`,
    },
    {
      name: "pending() / completed() が完了状態で正しく振り分けられる",
      code: `(() => { const l = new TaskList(); l.add("a"); const b = l.add("b"); l.add("c"); l.completeById(b.getId()); return l.pending().length === 2 && l.completed().length === 1; })()`,
    },
    {
      name: "pending() の戻り値を変更しても TaskList の内部は壊れない (スナップショット)",
      code: `(() => { const l = new TaskList(); l.add("a"); const snap = l.pending(); snap.push("dummy"); snap.length = 0; return l.count() === 1 && l.pending().length === 1; })()`,
    },
    {
      name: "Task#reopen() で完了済みを未完了に戻せる",
      code: `(() => { const l = new TaskList(); const t = l.add("a"); l.completeById(t.getId()); t.reopen(); return t.isDone() === false && l.pending().length === 1; })()`,
    },
    {
      name: "private フィールドは外から見えない (tasks / nextId / done プロパティは無い)",
      code: `(() => { const l = new TaskList(); const t = l.add("a"); return !("tasks" in l) && !("nextId" in l) && !("done" in t) && !("id" in t); })()`,
    },
  ],
  hints: [
    "Task の中で #id; #title; #done; を宣言してから constructor で代入します。 #done の初期値は false です。",
    "TaskList の add は const t = new Task(this.#nextId, title); this.#tasks.push(t); this.#nextId += 1; return t; という順番で書くと自然です。",
    "pending() は return this.#tasks.filter((t) => !t.isDone()); のように filter を使うと、 自動的に新しい配列 (= スナップショット) になります。",
    "解答例:\n```js\nclass Task {\n  #id;\n  #title;\n  #done;\n  constructor(id, title) {\n    this.#id = id;\n    this.#title = title;\n    this.#done = false;\n  }\n  getId() { return this.#id; }\n  getTitle() { return this.#title; }\n  isDone() { return this.#done; }\n  complete() { this.#done = true; }\n  reopen() { this.#done = false; }\n}\n\nclass TaskList {\n  #tasks = [];\n  #nextId = 1;\n  add(title) {\n    const t = new Task(this.#nextId, title);\n    this.#tasks.push(t);\n    this.#nextId += 1;\n    return t;\n  }\n  completeById(id) {\n    const t = this.#tasks.find((x) => x.getId() === id);\n    if (t === undefined) return false;\n    t.complete();\n    return true;\n  }\n  pending() { return this.#tasks.filter((t) => !t.isDone()); }\n  completed() { return this.#tasks.filter((t) => t.isDone()); }\n  count() { return this.#tasks.length; }\n}\n```",
  ],
  staticAnalysis: {
    ast: {
      required: [
        {
          kind: "node",
          nodeType: "ClassDeclaration",
          label: "Task / TaskList を class で定義する",
        },
        {
          kind: "node",
          nodeType: "ClassPrivateProperty",
          label: "#id / #title / #done / #tasks などを private フィールドで宣言する",
        },
        {
          kind: "node",
          nodeType: "NewExpression",
          label: "TaskList#add の中で new Task(...) を呼ぶ",
        },
        {
          kind: "node",
          nodeType: "ReturnStatement",
          label: "add / completeById / pending / completed / count で return する",
        },
      ],
      forbidden: [
        { kind: "var", label: "var を使わない" },
        { kind: "loose-eq", label: "== / != を使わない" },
      ],
    },
  },
  solution: `class Task {
  #id;
  #title;
  #done;
  constructor(id, title) {
    this.#id = id;
    this.#title = title;
    this.#done = false;
  }
  getId() { return this.#id; }
  getTitle() { return this.#title; }
  isDone() { return this.#done; }
  complete() { this.#done = true; }
  reopen() { this.#done = false; }
}

class TaskList {
  #tasks = [];
  #nextId = 1;
  add(title) {
    const t = new Task(this.#nextId, title);
    this.#tasks.push(t);
    this.#nextId += 1;
    return t;
  }
  completeById(id) {
    const t = this.#tasks.find((x) => x.getId() === id);
    if (t === undefined) return false;
    t.complete();
    return true;
  }
  pending() { return this.#tasks.filter((t) => !t.isDone()); }
  completed() { return this.#tasks.filter((t) => t.isDone()); }
  count() { return this.#tasks.length; }
}
`,
  badSolutions: [
    {
      code: `class TaskList {
  #tasks = [];
  #nextId = 1;
  add(title) {
    const t = { id: this.#nextId, title, done: false };
    this.#tasks.push(t);
    this.#nextId += 1;
    return t;
  }
  completeById(id) {
    const t = this.#tasks.find((x) => x.id === id);
    if (t === undefined) return false;
    t.done = true;
    return true;
  }
  pending() { return this.#tasks.filter((t) => !t.done); }
  completed() { return this.#tasks.filter((t) => t.done); }
  count() { return this.#tasks.length; }
}
`,
      description:
        "Task class を作らず、 TaskList の中で素のオブジェクト { id, title, done } を直接管理してしまっている。 「値」 と 「集合」 の責務を分ける S5 の意図に反し、 entryPoints の Task が見つからないためテスト 1 (Task が class) でも失敗する。",
    },
    {
      code: `class Task {
  #id; #title; #done;
  constructor(id, title) { this.#id = id; this.#title = title; this.#done = false; }
  getId() { return this.#id; }
  getTitle() { return this.#title; }
  isDone() { return this.#done; }
  complete() { this.#done = true; }
  reopen() { this.#done = false; }
}
class TaskList {
  #tasks = [];
  #nextId = 1;
  add(title) {
    const t = new Task(this.#nextId, title);
    this.#tasks.push(t);
    this.#nextId += 1;
    return t;
  }
  completeById(id) {
    const t = this.#tasks.find((x) => x.getId() === id);
    if (t === undefined) return false;
    t.complete();
    return true;
  }
  pending() { return this.#tasks; }
  completed() { return this.#tasks.filter((t) => t.isDone()); }
  count() { return this.#tasks.length; }
}
`,
      description:
        "pending() が内部配列 #tasks の参照をそのまま返してしまっている。 呼び出し側で push したり length を 0 にしたりすると TaskList の中身が壊れる。 「スナップショットを返す」 テストで失敗する。",
    },
    {
      code: `class Task {
  id; title; done;
  constructor(id, title) { this.id = id; this.title = title; this.done = false; }
  getId() { return this.id; }
  getTitle() { return this.title; }
  isDone() { return this.done; }
  complete() { this.done = true; }
  reopen() { this.done = false; }
}
class TaskList {
  tasks = [];
  nextId = 1;
  add(title) {
    const t = new Task(this.nextId, title);
    this.tasks.push(t);
    this.nextId += 1;
    return t;
  }
  completeById(id) {
    const t = this.tasks.find((x) => x.getId() === id);
    if (t === undefined) return false;
    t.complete();
    return true;
  }
  pending() { return this.tasks.filter((t) => !t.isDone()); }
  completed() { return this.tasks.filter((t) => t.isDone()); }
  count() { return this.tasks.length; }
}
`,
      description:
        "全フィールドを公開プロパティで宣言してしまっており、 #privateField を 1 つも使っていない。 AST required の ClassPrivateProperty 違反 + 「private フィールドは外から見えない」 テストで \"tasks\" in l などが true になって失敗する。",
    },
  ],
  mdnSections: [
    {
      heading: "クラスを使用する",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Using_classes",
      pageTitle: "クラスを使用する",
    },
    {
      heading: "プライベートクラス機能",
      pageUrl:
        "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Classes/Private_properties",
      pageTitle: "プライベートクラス機能",
    },
  ],
};
