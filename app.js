const students = [
  {
    id: "older",
    name: "MIA",
    grade: "9",
    profile: "将要上高一，进入 Frisco ISD Liberty High School",
    focus: ["7th Grade", "8th Grade", "9th Grade"],
  },
  {
    id: "younger",
    name: "EVA",
    grade: "8",
    profile: "将要上初二，进入 8th Grade",
    focus: ["7th Grade", "8th Grade", "9th Grade"],
  },
];

const subjects = {
  "7": [
    { id: "math7", label: "7th Grade Math", standard: "TEKS Grade 7 Math" },
    { id: "rla7", label: "7th Grade RLA", standard: "TEKS Grade 7 RLA" },
    { id: "science7", label: "7th Grade Science", standard: "TEKS Grade 7 Science" },
    { id: "preAlgebra", label: "Pre-Algebra Foundations", standard: "Algebra readiness" },
  ],
  "8": [
    { id: "math8", label: "8th Grade Math", standard: "TEKS Grade 8 Math" },
    { id: "rla8", label: "8th Grade RLA", standard: "TEKS Grade 8 RLA" },
    { id: "science8", label: "8th Grade Science", standard: "TEKS Grade 8 Science" },
    { id: "algebraReady", label: "Algebra I Readiness", standard: "Algebra readiness" },
  ],
  "9": [
    { id: "english1", label: "English I", standard: "STAAR EOC English I" },
    { id: "algebra1", label: "Algebra I", standard: "STAAR EOC Algebra I" },
    { id: "geometry", label: "Geometry", standard: "TEKS Geometry" },
    { id: "biology", label: "Biology", standard: "STAAR EOC Biology" },
  ],
};

const diagnostics = {
  math7: {
    prompt: "一个商品原价 80 美元，打 25% 折扣。学生在计算折后价前，应该先求什么？",
    standard: "Grade 7 Math: Proportional Reasoning",
    difficulty: "基础到中等",
    answers: ["折扣金额", "商品颜色", "税前收据长度", "最大公因数"],
    skills: [
      ["比例与百分比", 62],
      ["有理数运算", 58],
      ["文字题建模", 45],
      ["单位率", 69],
    ],
  },
  rla7: {
    prompt: "阅读小说片段时，如果要判断人物动机，学生应该重点找什么？",
    standard: "Grade 7 RLA: Character Analysis",
    difficulty: "中等",
    answers: ["人物的行动、语言和内心变化", "段落数量", "字体大小", "文章标题长度"],
    skills: [
      ["人物分析", 60],
      ["文本证据", 52],
      ["主题推断", 48],
      ["词汇语境", 66],
    ],
  },
  science7: {
    prompt: "比较两个生态系统时，学生应该先关注哪些组成部分？",
    standard: "Grade 7 Science: Ecosystems",
    difficulty: "中等",
    answers: ["生物因素、非生物因素和能量流动", "地图颜色", "标题字体", "页码"],
    skills: [
      ["生态系统组成", 64],
      ["食物网与能量", 50],
      ["科学图表", 57],
      ["变量识别", 46],
    ],
  },
  preAlgebra: {
    prompt: "把文字句子 “一个数的 3 倍再加 4” 写成代数式，第一步应确认什么？",
    standard: "Pre-Algebra: Expressions",
    difficulty: "基础",
    answers: ["未知数代表什么", "答案一定是 4", "必须画圆", "只能用除法"],
    skills: [
      ["代数表达式", 55],
      ["整数和分数运算", 67],
      ["方程准备", 49],
      ["文字转符号", 43],
    ],
  },
  english1: {
    prompt: "阅读一段文章后，学生需要判断作者如何通过证据支持中心观点。最好的第一步是什么？",
    standard: "English I: Reading + Evidence",
    difficulty: "中等",
    answers: ["直接选择最长的答案", "先找中心观点，再圈出证据", "只看第一段", "跳过文章看选项"],
    skills: [
      ["识别中心观点", 72],
      ["引用文本证据", 58],
      ["分析作者意图", 46],
      ["写作修订", 63],
    ],
  },
  algebra1: {
    prompt: "一个线性函数经过点 (2, 7) 和 (5, 16)。在求函数表达式前，学生应该先求什么？",
    standard: "Algebra I: Linear Functions",
    difficulty: "中等",
    answers: ["斜率", "y 轴截距", "平方根", "最大值"],
    skills: [
      ["斜率与变化率", 64],
      ["线性方程建模", 52],
      ["解一元一次方程", 78],
      ["函数图像解释", 49],
    ],
  },
  geometry: {
    prompt: "证明两个三角形全等时，学生应该先检查哪些信息已经给出？",
    standard: "Geometry: Congruence",
    difficulty: "中等",
    answers: ["边和角的对应关系", "图形颜色", "面积公式", "坐标轴刻度"],
    skills: [
      ["全等判定", 54],
      ["角关系", 68],
      ["证明书写", 43],
      ["几何词汇", 73],
    ],
  },
  biology: {
    prompt: "如果一个细胞能量不足，最应该先复习哪个细胞结构和过程？",
    standard: "Biology: Cells and Energy",
    difficulty: "中等",
    answers: ["线粒体与细胞呼吸", "细胞壁颜色", "染色体数量", "生态系统层级"],
    skills: [
      ["细胞结构功能", 61],
      ["能量转化", 47],
      ["遗传基础", 55],
      ["科学图表分析", 69],
    ],
  },
  math8: {
    prompt: "一个比例关系可以写成 y = 3x。图像上最关键的特征是什么？",
    standard: "Grade 8 Math: Proportionality",
    difficulty: "基础到中等",
    answers: ["经过原点且斜率为 3", "永远是曲线", "不能用表格表示", "没有单位率"],
    skills: [
      ["比例关系", 70],
      ["斜率概念", 56],
      ["多步文字题", 44],
      ["数据图表", 66],
    ],
  },
  rla8: {
    prompt: "比较两篇文章观点时，学生应该先找什么？",
    standard: "Grade 8 RLA: Compare Texts",
    difficulty: "中等",
    answers: ["每篇文章的主张和证据", "文章长度", "图片数量", "最后一个句子"],
    skills: [
      ["主题与主张", 67],
      ["证据比较", 51],
      ["词汇语境", 62],
      ["短文写作", 48],
    ],
  },
  science8: {
    prompt: "判断实验结论是否可靠时，学生应该优先检查什么？",
    standard: "Grade 8 Science: Investigation",
    difficulty: "中等",
    answers: ["变量控制和数据是否支持结论", "标题是否好看", "实验是否很短", "是否用了彩色图表"],
    skills: [
      ["实验设计", 53],
      ["变量控制", 46],
      ["数据解释", 58],
      ["科学词汇", 71],
    ],
  },
  algebraReady: {
    prompt: "解 3x + 5 = 20 时，学生第一步应该做什么？",
    standard: "Algebra Readiness: Equations",
    difficulty: "基础",
    answers: ["两边同时减 5", "两边同时加 5", "直接除以 20", "把 x 改成 0"],
    skills: [
      ["整数运算", 76],
      ["方程逆运算", 57],
      ["函数准备", 50],
      ["文字题翻译", 42],
    ],
  },
};

let state = {
  studentId: "older",
  grade: "9",
  subject: "english1",
  selectedAnswer: null,
  selectedAnswers: {},
  currentQuestion: 0,
  cloudQuestions: {},
  cloudLoading: false,
  chatHistory: [],
  reportReady: false,
  records: [],
};

const $ = (id) => document.getElementById(id);
const storageKey = "family-learning-coach";
const supabaseConfig = {
  url: "https://olyehadsblazpyxhsryn.supabase.co",
  key: "sb_publishable_5-n_a32xrCbk9O4UtLB0eg_-XXr9L6c",
};

function loadSavedData() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && Array.isArray(saved.records)) {
      state.records = saved.records;
    }
  } catch {
    state.records = [];
  }
}

function saveData() {
  localStorage.setItem(
    storageKey,
    JSON.stringify({
      records: state.records,
      lastUpdated: new Date().toISOString(),
    })
  );
}

async function supabaseRequest(path, options = {}) {
  const response = await fetch(`${supabaseConfig.url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: supabaseConfig.key,
      Authorization: `Bearer ${supabaseConfig.key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Supabase request failed: ${response.status}`);
  }

  return response.status === 204 ? null : response.json();
}

async function findSupabaseRecord(table, filter) {
  const query = new URLSearchParams({
    select: "id",
    limit: "1",
    ...filter,
  });
  const rows = await supabaseRequest(`${table}?${query.toString()}`, {
    headers: { Prefer: "" },
  });
  return rows[0] || null;
}

async function saveReportToCloud(record, goal) {
  $("cloudStatus").textContent = "云端同步中";
  const student = await findSupabaseRecord("students", { display_name: `eq.${record.student}` });
  const subject = await findSupabaseRecord("subjects", { title: `eq.${record.subject}` });

  if (!student || !subject) {
    throw new Error("Supabase 缺少学生或学科资料");
  }

  const [session] = await supabaseRequest("diagnostic_sessions", {
    method: "POST",
    body: JSON.stringify({
      student_id: student.id,
      subject_id: subject.id,
      goal,
      overall_score: record.score,
      summary: `Weak points: ${record.weak.join(", ") || "none"}`,
    }),
  });

  await supabaseRequest("learning_activities", {
    method: "POST",
    body: JSON.stringify({
      student_id: student.id,
      subject_id: subject.id,
      activity_type: "diagnostic",
      minutes_spent: 20,
      notes: `Diagnostic session ${session.id}; next: ${record.next.join(", ")}`,
    }),
  });

  $("cloudStatus").textContent = "云端已同步";
}

function activeStudent() {
  return students.find((student) => student.id === state.studentId);
}

function activeSubject() {
  return subjects[state.grade].find((subject) => subject.id === state.subject);
}

function activeDiagnostic() {
  return diagnostics[state.subject];
}

function activeQuestions() {
  if (state.cloudQuestions[state.subject]?.length) return state.cloudQuestions[state.subject];
  const diagnostic = activeDiagnostic();
  if (diagnostic.questions) return diagnostic.questions;
  const strongest = diagnostic.skills.reduce((best, skill) => (skill[1] > best[1] ? skill : best), diagnostic.skills[0]);
  const weakest = diagnostic.skills.reduce((low, skill) => (skill[1] < low[1] ? skill : low), diagnostic.skills[0]);
  return [
    {
      prompt: diagnostic.prompt,
      standard: diagnostic.standard,
      difficulty: diagnostic.difficulty,
      answers: diagnostic.answers,
      correct: 1,
      skill: diagnostic.skills[0][0],
    },
    {
      prompt: `如果要提高“${weakest[0]}”，学生最应该先做哪件事？`,
      standard: diagnostic.standard,
      difficulty: "基础",
      answers: ["先解释题目在问什么，再找已知条件", "直接猜一个看起来最长的答案", "跳过所有不熟悉的词", "只看选项不看题干"],
      correct: 0,
      skill: weakest[0],
    },
    {
      prompt: `完成一道 ${activeSubject().label} 题后，哪种总结最能帮助长期掌握？`,
      standard: diagnostic.standard,
      difficulty: "中等",
      answers: [
        `写出本题用到的知识点，并说明它和“${strongest[0]}”或“${weakest[0]}”的关系`,
        "只记住答案字母",
        "把错题删掉，避免再看到",
        "只说这题太难，不分析原因",
      ],
      correct: 0,
      skill: weakest[0],
    },
  ];
}

function normalizeDifficulty(difficulty) {
  if (difficulty === "foundation") return "基础";
  if (difficulty === "advanced") return "进阶";
  return "中等";
}

async function loadCloudQuestions() {
  const subject = activeSubject();
  if (!subject || state.cloudQuestions[state.subject]) return;
  state.cloudLoading = true;
  $("cloudStatus").textContent = "正在读取云端题库";

  try {
    const subjectRows = await supabaseRequest(
      `subjects?${new URLSearchParams({ select: "id", title: `eq.${subject.label}`, limit: "1" }).toString()}`,
      { headers: { Prefer: "" } }
    );
    if (!subjectRows.length) return;

    const questionRows = await supabaseRequest(
      `questions?${new URLSearchParams({
        select: "id,prompt,difficulty,explanation,coach_hint_1,coach_hint_2,knowledge_point_id",
        subject_id: `eq.${subjectRows[0].id}`,
        order: "created_at.asc",
      }).toString()}`,
      { headers: { Prefer: "" } }
    );
    if (!questionRows.length) return;

    const questionIds = questionRows.map((question) => question.id);
    const optionRows = await supabaseRequest(
      `question_options?${new URLSearchParams({
        select: "question_id,option_text,is_correct",
        question_id: `in.(${questionIds.join(",")})`,
        order: "label.asc",
      }).toString()}`,
      { headers: { Prefer: "" } }
    );

    state.cloudQuestions[state.subject] = questionRows.map((question) => {
      const options = optionRows.filter((option) => option.question_id === question.id);
      const correct = options.findIndex((option) => option.is_correct);
      return {
        prompt: question.prompt,
        standard: subject.standard,
        difficulty: normalizeDifficulty(question.difficulty),
        answers: options.map((option) => option.option_text),
        correct: Math.max(0, correct),
        skill: activeDiagnostic().skills[0][0],
        explanation: question.explanation,
        coachHints: [question.coach_hint_1, question.coach_hint_2].filter(Boolean),
      };
    });

    $("cloudStatus").textContent = "云端题库已载入";
    renderDiagnostic();
  } catch (error) {
    console.error(error);
    $("cloudStatus").textContent = "云端题库读取失败";
  } finally {
    state.cloudLoading = false;
  }
}

function renderStudents() {
  $("studentList").innerHTML = students
    .map(
      (student) => `
        <button class="student-button ${student.id === state.studentId ? "active" : ""}" data-student="${student.id}">
          <strong>${student.name}</strong>
          <span>${student.profile}</span>
        </button>
      `
    )
    .join("");
}

function renderSelectors() {
  $("gradeSelect").innerHTML = [
    ["7", "7th Grade"],
    ["8", "8th Grade"],
    ["9", "9th Grade"],
  ]
    .map(([value, label]) => `<option value="${value}" ${value === state.grade ? "selected" : ""}>${label}</option>`)
    .join("");

  $("subjectSelect").innerHTML = subjects[state.grade]
    .map((subject) => `<option value="${subject.id}" ${subject.id === state.subject ? "selected" : ""}>${subject.label}</option>`)
    .join("");
}

function renderDiagnostic() {
  const student = activeStudent();
  const subject = activeSubject();
  const diagnostic = activeDiagnostic();
  const questions = activeQuestions();
  const question = questions[state.currentQuestion] || questions[0];

  $("diagnosticTitle").textContent = `${student.name} · ${subject.label} 诊断`;
  $("standardTag").textContent = question.standard;
  $("difficultyTag").textContent = question.difficulty;
  $("questionProgress").textContent = `${state.currentQuestion + 1} / ${questions.length}`;
  $("questionPrompt").textContent = question.prompt;
  $("dailySuggestion").textContent = `${student.name} 今天建议完成 ${subject.label} 诊断，并用 20 分钟复习最低掌握度的知识点。${state.cloudQuestions[state.subject]?.length ? " 当前使用云端题库。" : " 当前使用本地示例题。"}`;

  $("answerGrid").innerHTML = question.answers
    .map(
      (answer, index) => `
        <button class="answer-option ${state.selectedAnswers[state.currentQuestion] === index ? "selected" : ""}" data-answer-index="${index}">
          ${answer}
        </button>
      `
    )
    .join("");

  $("prevQuestion").disabled = state.currentQuestion === 0;
  $("nextQuestion").disabled = state.currentQuestion === questions.length - 1;

  $("knowledgeGrid").innerHTML = diagnostic.skills
    .map(([skill, score]) => {
      const level = score >= 70 ? "high" : score >= 55 ? "mid" : "low";
      return `
        <div class="skill-card ${level}">
          <strong>${skill}</strong>
          <p>${score}% 掌握</p>
          <div class="progress"><span style="width:${score}%"></span></div>
        </div>
      `;
    })
    .join("");
}

function buildReport() {
  const diagnostic = activeDiagnostic();
  const student = activeStudent();
  const subject = activeSubject();
  const questions = activeQuestions();
  const answered = questions.filter((_, index) => state.selectedAnswers[index] !== undefined);
  const correctCount = questions.filter((question, index) => state.selectedAnswers[index] === question.correct).length;
  const completionBoost = Math.round((correctCount / questions.length) * 20);
  const unansweredPenalty = (questions.length - answered.length) * 5;
  const adjustedSkills = diagnostic.skills.map(([skill, score]) => [
    skill,
    Math.max(20, Math.min(95, score + completionBoost - unansweredPenalty)),
  ]);
  const scores = adjustedSkills.map((skill) => skill[1]);
  const average = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  const weak = adjustedSkills.filter((skill) => skill[1] < 60);
  const plan = weak.length ? weak : adjustedSkills.slice(0, 2);

  state.reportReady = true;
  const record = {
    id: crypto.randomUUID(),
    date: new Date().toLocaleString("zh-CN", { dateStyle: "medium", timeStyle: "short" }),
    student: student.name,
    grade: state.grade,
    subject: subject.label,
    score: average,
    weak: weak.map(([skill]) => skill),
    next: plan.map(([skill]) => skill),
    answered: answered.length,
    correct: correctCount,
  };
  state.records.unshift(record);
  state.records = state.records.slice(0, 20);
  saveData();
  $("reportStatus").textContent = "已生成";
  $("overallScore").textContent = `${average}%`;
  $("overallNote").textContent = average >= 70 ? "基础不错，可以进入预习和拔高。" : "建议先补关键薄弱点，再进入新内容。";
  $("weaknessList").innerHTML = weak
    .map(([skill, score]) => `<li><strong>${skill}</strong>：当前 ${score}%，建议用讲解 + 变式题巩固。</li>`)
    .join("");
  $("studyPlan").innerHTML = plan
    .map(([skill], index) => `<li>第 ${index + 1} 天：学习 ${skill}，完成 8 道练习题，并用自己的话总结方法。</li>`)
    .join("");

  renderEmail(average, weak, plan);
  renderActivity();
  renderCoach();
  switchView("report");
  saveReportToCloud(record, $("goalSelect").value).catch((error) => {
    console.error(error);
    $("cloudStatus").textContent = "云端同步失败";
  });
}

function renderCoach() {
  const diagnostic = activeDiagnostic();
  state.chatHistory = [
    {
      role: "coach",
      text: "我们先不急着选答案。请你先说说：这道题真正问的是什么？",
    },
    {
      role: "coach",
      text: activeQuestions()[state.currentQuestion]?.prompt || diagnostic.prompt,
    },
  ];
  $("chatWindow").innerHTML = `
    ${state.chatHistory.map((message) => `<div class="message ${message.role}">${message.text}</div>`).join("")}
  `;
}

function appendChat(role, text) {
  state.chatHistory.push({ role, text });
  $("chatWindow").insertAdjacentHTML("beforeend", `<div class="message ${role}">${text}</div>`);
  $("chatWindow").scrollTop = $("chatWindow").scrollHeight;
}

async function askAiCoach(studentReply) {
  const payload = {
    studentName: activeStudent().name,
    grade: state.grade,
    subject: activeSubject().label,
    question: activeQuestions()[state.currentQuestion]?.prompt,
    studentReply,
    history: state.chatHistory,
  };

  const response = await fetch("/api/coach", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("AI coach request failed");
  return response.json();
}

function renderEmail(average = "--", weak = [], plan = []) {
  const student = activeStudent();
  const subject = activeSubject();
  const weakText = weak.length ? weak.map(([skill]) => skill).join("、") : "等待诊断生成";
  const planText = plan.length ? plan.map(([skill]) => skill).join("、") : "完成诊断后自动生成";

  $("emailPreview").innerHTML = `
    <p><strong>主题：</strong>${student.name} 今日学习报告 - ${subject.label}</p>
    <p>今天完成了 ${subject.label} 的诊断练习，当前综合掌握度为 <strong>${average}</strong>。</p>
    <p><strong>主要薄弱点：</strong>${weakText}</p>
    <p><strong>明日建议：</strong>${planText}</p>
    <p>辅导方式将继续采用提问引导：先让孩子解释题意，再提示关键概念，最后让孩子自己完成答案和总结。</p>
  `;
}

function renderActivity() {
  if (!state.records.length) {
    $("activityList").innerHTML = "<li>还没有学习记录。完成一次诊断后会自动保存。</li>";
    return;
  }

  $("activityList").innerHTML = state.records
    .map(
      (record) => `
        <li>
          <strong>${record.date} · ${record.student} · ${record.subject}</strong><br />
          掌握度 ${record.score}%；题目 ${record.correct ?? "--"} / ${record.answered ?? "--"}；薄弱点：${record.weak.length ? record.weak.join("、") : "暂无明显薄弱点"}。
        </li>
      `
    )
    .join("");
}

function switchView(viewName) {
  document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.view === viewName));
  document.querySelectorAll(".view").forEach((view) => view.classList.remove("active"));
  $(`${viewName}View`).classList.add("active");
}

function bindEvents() {
  $("studentList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-student]");
    if (!button) return;
    state.studentId = button.dataset.student;
    state.grade = activeStudent().grade;
    state.subject = subjects[state.grade][0].id;
    state.selectedAnswer = null;
    state.selectedAnswers = {};
    state.currentQuestion = 0;
    state.reportReady = false;
    saveData();
    renderAll();
    loadCloudQuestions();
  });

  $("gradeSelect").addEventListener("change", (event) => {
    state.grade = event.target.value;
    state.subject = subjects[state.grade][0].id;
    state.selectedAnswer = null;
    state.selectedAnswers = {};
    state.currentQuestion = 0;
    state.reportReady = false;
    saveData();
    renderAll();
    loadCloudQuestions();
  });

  $("subjectSelect").addEventListener("change", (event) => {
    state.subject = event.target.value;
    state.selectedAnswer = null;
    state.selectedAnswers = {};
    state.currentQuestion = 0;
    state.reportReady = false;
    saveData();
    renderAll();
    loadCloudQuestions();
  });

  $("answerGrid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-answer-index]");
    if (!button) return;
    state.selectedAnswers[state.currentQuestion] = Number(button.dataset.answerIndex);
    saveData();
    renderDiagnostic();
  });

  $("prevQuestion").addEventListener("click", () => {
    state.currentQuestion = Math.max(0, state.currentQuestion - 1);
    renderDiagnostic();
  });

  $("nextQuestion").addEventListener("click", () => {
    state.currentQuestion = Math.min(activeQuestions().length - 1, state.currentQuestion + 1);
    renderDiagnostic();
  });

  $("runDiagnostic").addEventListener("click", buildReport);

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => switchView(tab.dataset.view));
  });

  $("chatForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = $("studentReply");
    const reply = input.value.trim();
    if (!reply) return;
    appendChat("student", reply);
    input.value = "";
    appendChat("coach", "我在看你的思路...");

    askAiCoach(reply)
      .then((data) => {
        state.chatHistory.pop();
        $("chatWindow").lastElementChild.remove();
        appendChat("coach", data.reply);
      })
      .catch(() => {
        state.chatHistory.pop();
        $("chatWindow").lastElementChild.remove();
        appendChat("coach", "很好。现在请你找一个关键词或已知条件。它能帮助你排除哪个选项？先说明理由，再考虑答案。");
      });
  });

  $("copyDigest").addEventListener("click", async () => {
    const text = $("emailPreview").innerText;
    await navigator.clipboard.writeText(text);
    $("copyDigest").textContent = "已复制";
    setTimeout(() => ($("copyDigest").textContent = "复制日报内容"), 1200);
  });
}

function renderAll() {
  renderStudents();
  renderSelectors();
  renderDiagnostic();
  renderEmail();
  renderCoach();
  $("reportStatus").textContent = state.reportReady ? "已生成" : "等待诊断";
  $("overallScore").textContent = state.reportReady ? $("overallScore").textContent : "--";
  $("overallNote").textContent = state.reportReady ? $("overallNote").textContent : "完成诊断后生成";
  $("weaknessList").innerHTML = state.reportReady ? $("weaknessList").innerHTML : "<li>完成诊断后显示薄弱点。</li>";
  $("studyPlan").innerHTML = state.reportReady ? $("studyPlan").innerHTML : "<li>完成诊断后生成 7 天学习方案。</li>";
  $("cloudStatus").textContent = "云端未同步";
  renderActivity();
}

loadSavedData();
bindEvents();
renderAll();
loadCloudQuestions();
