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

const accounts = [
  { id: "parent", role: "parent", label: "家长", description: "查看两个孩子报告，调整学习时间和计划" },
  { id: "mia", role: "student", studentId: "older", label: "MIA", description: "进入自己的今日任务" },
  { id: "eva", role: "student", studentId: "younger", label: "EVA", description: "进入自己的今日任务" },
];

const difficultyLevels = ["基础", "中等", "进阶", "挑战"];
const COACH_RESPONSE_TIMEOUT_MS = 2800;
const MASTERY_RESPONSE_TIMEOUT_MS = 3500;

const learningPathCatalog = {
  math: ["Number Sense", "Fractions", "Ratios & Proportions", "Linear Equations", "Geometry", "Functions", "Algebra I Foundation"],
  reading: ["Main Idea", "Supporting Details", "Inference", "Vocabulary in Context", "Author's Purpose", "Evidence-Based Questions"],
  writing: ["Sentence Structure", "Grammar", "Paragraph Writing", "Essay Structure", "Evidence Explanation", "Revision Strategy"],
  vocabulary: ["Academic Words", "Context Clues", "Word Parts", "Precise Language", "Multiple Meaning Words", "SAT Word Foundations"],
  sat: ["PSAT Reading Foundation", "PSAT Math Foundation", "Evidence Questions", "Linear Models", "Grammar in Context", "Short Response"],
};

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

const localQuestionBank = {
  math7: [
    {
      prompt: "A store sells 3 notebooks for $7.50. What is the unit price per notebook?",
      standard: "Grade 7 Math: Unit Rate",
      difficulty: "基础",
      answers: ["$2.50", "$4.50", "$7.50", "$22.50"],
      correct: 0,
      skill: "单位率",
      explanation: "Unit price means the cost for one item, so divide total cost by the number of items.",
      coachHints: ["What does 'per notebook' mean?", "Which operation changes 3 notebooks into 1 notebook?"],
    },
    {
      prompt: "A recipe uses 2 cups of flour for 5 servings. How many cups are needed for 15 servings?",
      standard: "Grade 7 Math: Proportional Reasoning",
      difficulty: "中等",
      answers: ["4 cups", "6 cups", "7 cups", "10 cups"],
      correct: 1,
      skill: "比例与百分比",
      explanation: "15 servings is 3 times 5 servings, so the flour amount is also multiplied by 3.",
      coachHints: ["How many groups of 5 are in 15?", "If servings triple, what should happen to the flour?"],
    },
    {
      prompt: "A bank account changes by -$18, then +$25. What is the net change?",
      standard: "Grade 7 Math: Rational Number Operations",
      difficulty: "基础",
      answers: ["-$43", "-$7", "+$7", "+$43"],
      correct: 2,
      skill: "有理数运算",
      explanation: "Combine the negative and positive changes: -18 + 25 = 7.",
      coachHints: ["Which change is bigger in size: 18 or 25?", "After paying back 18, how much of 25 is left?"],
    },
  ],
  rla7: [
    {
      prompt: "A character says one thing but does the opposite. What should you analyze first?",
      standard: "Grade 7 RLA: Character Analysis",
      difficulty: "中等",
      answers: ["The conflict between words and actions", "The number of paragraphs", "The page number", "The title font"],
      correct: 0,
      skill: "人物分析",
      explanation: "A contradiction between words and actions often reveals motivation or conflict.",
      coachHints: ["What changed between what the character said and what they did?", "What might that contradiction reveal?"],
    },
    {
      prompt: "Which evidence best supports a theme about perseverance?",
      standard: "Grade 7 RLA: Theme and Evidence",
      difficulty: "中等",
      answers: ["A character keeps practicing after repeated failures", "The setting is described in detail", "A chapter has many short sentences", "The story has three characters"],
      correct: 0,
      skill: "文本证据",
      explanation: "Theme evidence should connect directly to the lesson or message of the text.",
      coachHints: ["What does perseverance mean?", "Which choice shows someone not giving up?"],
    },
  ],
  science7: [
    {
      prompt: "In a food web, what would most likely happen if a major producer disappeared?",
      standard: "Grade 7 Science: Ecosystems",
      difficulty: "中等",
      answers: ["Some consumers would have less energy available", "All animals would immediately increase", "Water would stop evaporating", "Gravity would change"],
      correct: 0,
      skill: "食物网与能量",
      explanation: "Producers bring energy into many food webs, so consumers depend on them directly or indirectly.",
      coachHints: ["Where does energy usually enter a food web?", "Who depends on producers for food?"],
    },
    {
      prompt: "A student changes the amount of sunlight plants receive. What is the independent variable?",
      standard: "Grade 7 Science: Investigation",
      difficulty: "基础",
      answers: ["Amount of sunlight", "Plant height", "Type of graph", "Conclusion sentence"],
      correct: 0,
      skill: "变量识别",
      explanation: "The independent variable is what the student changes on purpose.",
      coachHints: ["What did the student intentionally change?", "Which variable is being tested?"],
    },
  ],
  preAlgebra: [
    {
      prompt: "Which expression represents 'five less than twice a number'?",
      standard: "Pre-Algebra: Expressions",
      difficulty: "基础",
      answers: ["2x - 5", "5 - 2x", "2(x - 5)", "x/2 - 5"],
      correct: 0,
      skill: "文字转符号",
      explanation: "Twice a number is 2x, and five less than that means subtract 5.",
      coachHints: ["What does 'twice a number' become?", "From what quantity are you subtracting 5?"],
    },
    {
      prompt: "Solve x/4 = 6. What operation isolates x?",
      standard: "Pre-Algebra: One-Step Equations",
      difficulty: "基础",
      answers: ["Multiply both sides by 4", "Divide both sides by 4", "Subtract 4", "Add 6"],
      correct: 0,
      skill: "方程准备",
      explanation: "The inverse of dividing by 4 is multiplying by 4.",
      coachHints: ["What is happening to x right now?", "What is the inverse operation?"],
    },
  ],
  math8: [
    {
      prompt: "A line passes through (0, 2) and (3, 8). What is its slope?",
      standard: "Grade 8 Math: Slope",
      difficulty: "中等",
      answers: ["2", "3", "6", "8"],
      correct: 0,
      skill: "斜率概念",
      explanation: "Slope is change in y divided by change in x: (8 - 2) / (3 - 0) = 2.",
      coachHints: ["What is the change in y?", "What is the change in x?"],
    },
    {
      prompt: "Which equation represents a proportional relationship?",
      standard: "Grade 8 Math: Proportional Relationships",
      difficulty: "基础",
      answers: ["y = 4x", "y = 4x + 1", "y = x - 4", "y = 4"],
      correct: 0,
      skill: "比例关系",
      explanation: "A proportional relationship has the form y = kx and passes through the origin.",
      coachHints: ["What form does a proportional equation usually have?", "Which choice has no added or subtracted constant?"],
    },
    {
      prompt: "A right triangle has legs 6 and 8. What is the hypotenuse?",
      standard: "Grade 8 Math: Pythagorean Theorem",
      difficulty: "中等",
      answers: ["10", "12", "14", "48"],
      correct: 0,
      skill: "多步文字题",
      explanation: "Use a^2 + b^2 = c^2: 36 + 64 = 100, so c = 10.",
      coachHints: ["Which formula connects the legs and hypotenuse?", "What is 6 squared plus 8 squared?"],
    },
  ],
  rla8: [
    {
      prompt: "When comparing two arguments, what should you compare first?",
      standard: "Grade 8 RLA: Compare Texts",
      difficulty: "中等",
      answers: ["Each author's claim and evidence", "The number of commas", "The article length only", "The publication year only"],
      correct: 0,
      skill: "证据比较",
      explanation: "Argument comparison starts with what each author claims and how they support it.",
      coachHints: ["What is each author trying to prove?", "What evidence does each author use?"],
    },
    {
      prompt: "Which sentence would be strongest in a short constructed response?",
      standard: "Grade 8 RLA: Written Response",
      difficulty: "中等",
      answers: ["The text shows this when the narrator says, 'I kept trying.'", "I just think it is true.", "The story is long.", "The author is probably nice."],
      correct: 0,
      skill: "短文写作",
      explanation: "A strong response uses a claim plus specific text evidence.",
      coachHints: ["Which choice points to exact text evidence?", "Which choice can be proven from the passage?"],
    },
  ],
  science8: [
    {
      prompt: "A graph shows temperature rising while gas particles move faster. What idea does this support?",
      standard: "Grade 8 Science: Matter and Energy",
      difficulty: "中等",
      answers: ["Temperature is related to particle motion", "Particles stop moving when heated", "Mass disappears", "Gravity gets weaker"],
      correct: 0,
      skill: "数据解释",
      explanation: "Higher temperature is connected to faster particle motion.",
      coachHints: ["What changes on the graph as temperature rises?", "What relationship is the graph showing?"],
    },
    {
      prompt: "Why should a controlled experiment change only one variable at a time?",
      standard: "Grade 8 Science: Experimental Design",
      difficulty: "基础",
      answers: ["So the cause of the result is clearer", "So the graph is colorful", "So the trial is shorter", "So no data is needed"],
      correct: 0,
      skill: "变量控制",
      explanation: "Changing one variable helps connect the result to a specific cause.",
      coachHints: ["If two things change at once, what becomes hard to know?", "What makes a conclusion reliable?"],
    },
  ],
  algebraReady: [
    {
      prompt: "Solve 2x - 7 = 15. What should you do first?",
      standard: "Algebra Readiness: Two-Step Equations",
      difficulty: "基础",
      answers: ["Add 7 to both sides", "Divide by 7", "Subtract 2", "Multiply by 15"],
      correct: 0,
      skill: "方程逆运算",
      explanation: "Undo subtraction before undoing multiplication.",
      coachHints: ["What operation is furthest from x?", "What inverse operation removes -7?"],
    },
    {
      prompt: "Which table shows a constant rate of change?",
      standard: "Algebra Readiness: Functions",
      difficulty: "中等",
      answers: ["x increases by 1 and y increases by 3 each time", "x increases by 1 and y changes by 2, 5, then 9", "x stays the same", "y has no pattern"],
      correct: 0,
      skill: "函数准备",
      explanation: "A constant rate means y changes by the same amount for equal changes in x.",
      coachHints: ["What does 'constant' mean?", "Which choice has the same y-change each step?"],
    },
  ],
  english1: [
    {
      prompt: "Before choosing evidence for an answer, what should you identify?",
      standard: "STAAR EOC English I",
      difficulty: "基础",
      answers: ["The longest sentence", "The central idea or claim", "The paragraph number", "The author name only"],
      correct: 1,
      skill: "识别中心观点",
      explanation: "Evidence should support a claim or central idea, so identify that idea first.",
      coachHints: ["What is the question asking you to prove?", "Which idea will the evidence need to support?"],
    },
    {
      prompt: "A question asks how the author creates a serious tone. What evidence is most useful?",
      standard: "English I: Author's Craft",
      difficulty: "中等",
      answers: ["Words with strong or formal connotations", "The page number", "The author's birthday", "The title length"],
      correct: 0,
      skill: "分析作者意图",
      explanation: "Tone is often created through word choice and connotation.",
      coachHints: ["What does 'tone' describe?", "Which choice focuses on word choice?"],
    },
    {
      prompt: "Which revision best improves clarity?",
      standard: "English I: Revision",
      difficulty: "中等",
      answers: ["Replace a vague pronoun with the specific noun", "Add three unrelated adjectives", "Remove all transitions", "Make every sentence longer"],
      correct: 0,
      skill: "写作修订",
      explanation: "Clear writing helps the reader know exactly who or what a sentence refers to.",
      coachHints: ["What makes a sentence confusing?", "How can a specific noun help the reader?"],
    },
    {
      prompt: "A passage repeats the phrase 'no one listened' three times. What should you analyze?",
      standard: "English I: Author's Craft",
      difficulty: "中等",
      answers: ["How repetition emphasizes a central idea", "How many letters are in the phrase", "Whether the phrase is at the end", "The author's full biography"],
      correct: 0,
      skill: "分析作者意图",
      explanation: "Repeated words or phrases often emphasize an idea, mood, or conflict.",
      coachHints: ["What feeling or idea does the repeated phrase create?", "Why would an author repeat the same words?"],
    },
    {
      prompt: "Which sentence best states a theme?",
      standard: "English I: Theme",
      difficulty: "基础",
      answers: ["Courage can grow when people face fear.", "The story takes place in spring.", "The main character is named Elena.", "The last paragraph is short."],
      correct: 0,
      skill: "识别中心观点",
      explanation: "A theme is a broad message about life or human experience, not just a plot detail.",
      coachHints: ["Which choice sounds like a lesson?", "Which answer goes beyond one detail from the story?"],
    },
    {
      prompt: "A student writes, 'The article is persuasive because it has facts.' What is the best next step?",
      standard: "English I: Text Evidence",
      difficulty: "中等",
      answers: ["Quote or paraphrase one specific fact from the article", "Repeat the same sentence", "Remove the claim", "Add an unrelated opinion"],
      correct: 0,
      skill: "引用文本证据",
      explanation: "A strong response supports a claim with specific evidence from the text.",
      coachHints: ["What exact evidence proves the claim?", "Can the reader find that support in the article?"],
    },
    {
      prompt: "Which transition best shows contrast?",
      standard: "English I: Revision",
      difficulty: "基础",
      answers: ["However", "For example", "In addition", "First"],
      correct: 0,
      skill: "写作修订",
      explanation: "However signals that the next idea contrasts with the previous idea.",
      coachHints: ["What does contrast mean?", "Which transition tells the reader the idea is changing direction?"],
    },
    {
      prompt: "A question asks for the author's primary purpose. Which answer type should you look for?",
      standard: "English I: Author's Purpose",
      difficulty: "基础",
      answers: ["To inform, persuade, entertain, or explain", "Only the longest paragraph", "A character's age", "A random detail from the footnote"],
      correct: 0,
      skill: "分析作者意图",
      explanation: "Author's purpose asks why the text was written.",
      coachHints: ["What does 'purpose' mean?", "Is the author trying to teach, convince, entertain, or explain?"],
    },
    {
      prompt: "Which evidence best supports the claim that a character is anxious?",
      standard: "English I: Character Analysis",
      difficulty: "中等",
      answers: ["Her hands shook as she reread the same line.", "The room had blue curtains.", "The school was built in 1980.", "The chapter has ten pages."],
      correct: 0,
      skill: "引用文本证据",
      explanation: "Evidence about actions or body language can support an inference about feelings.",
      coachHints: ["What does anxious mean?", "Which detail shows behavior connected to anxiety?"],
    },
    {
      prompt: "A sentence says, 'The plan collapsed like a house of cards.' What is the author using?",
      standard: "English I: Figurative Language",
      difficulty: "中等",
      answers: ["A simile", "A thesis", "A citation", "A transition"],
      correct: 0,
      skill: "分析作者意图",
      explanation: "The phrase compares two things using 'like', which makes it a simile.",
      coachHints: ["Which word signals a comparison?", "What two things are being compared?"],
    },
    {
      prompt: "Which sentence would make a weak thesis stronger?",
      standard: "English I: Argument Writing",
      difficulty: "中等",
      answers: ["Students should have later start times because sleep improves focus and health.", "School is a place.", "Some people think many things.", "This essay is about time."],
      correct: 0,
      skill: "写作修订",
      explanation: "A strong thesis states a clear position and gives a reason or direction.",
      coachHints: ["Which choice takes a clear position?", "Which choice gives a reason that can be supported?"],
    },
    {
      prompt: "When an answer choice is partly true but does not answer the question, what should you do?",
      standard: "English I: Test Strategy",
      difficulty: "中等",
      answers: ["Eliminate it because evidence must answer the exact question", "Choose it because it has a true word", "Ignore the question stem", "Pick it if it is shorter"],
      correct: 0,
      skill: "识别中心观点",
      explanation: "Correct answers must be both true and directly responsive to the question.",
      coachHints: ["Does the choice answer the exact question?", "Can an answer be true but still not be the best answer?"],
    },
  ],
  algebra1: [
    {
      prompt: "A line has slope 3 and y-intercept -2. Which equation matches?",
      standard: "Algebra I: Linear Functions",
      difficulty: "基础",
      answers: ["y = 3x - 2", "y = -2x + 3", "y = x - 6", "y = 3x + 2"],
      correct: 0,
      skill: "线性方程建模",
      explanation: "Slope-intercept form is y = mx + b, where m is slope and b is y-intercept.",
      coachHints: ["What does m represent in y = mx + b?", "Where does the y-intercept go?"],
    },
    {
      prompt: "Solve 4x + 6 = 22.",
      standard: "Algebra I: Equations",
      difficulty: "基础",
      answers: ["x = 4", "x = 7", "x = 16", "x = 28"],
      correct: 0,
      skill: "解一元一次方程",
      explanation: "Subtract 6, then divide by 4: 4x = 16, so x = 4.",
      coachHints: ["What should you undo first?", "After subtracting 6, what equation remains?"],
    },
    {
      prompt: "Two lines have slopes 2 and 2 but different y-intercepts. What is true?",
      standard: "Algebra I: Systems",
      difficulty: "中等",
      answers: ["They are parallel and have no solution", "They intersect once", "They are the same line", "They are vertical"],
      correct: 0,
      skill: "函数图像解释",
      explanation: "Same slope with different intercepts means parallel lines, so there is no intersection.",
      coachHints: ["What does equal slope mean on a graph?", "If the intercepts differ, are the lines identical?"],
    },
    {
      prompt: "Which point is the y-intercept of y = -2x + 5?",
      standard: "Algebra I: Linear Functions",
      difficulty: "基础",
      answers: ["(0, 5)", "(5, 0)", "(-2, 5)", "(0, -2)"],
      correct: 0,
      skill: "函数图像解释",
      explanation: "The y-intercept occurs when x = 0, so the point is (0, 5).",
      coachHints: ["What is x at the y-intercept?", "In y = mx + b, what does b represent?"],
    },
    {
      prompt: "Solve 3(x - 2) = 18.",
      standard: "Algebra I: Equations",
      difficulty: "中等",
      answers: ["x = 8", "x = 6", "x = 4", "x = 20"],
      correct: 0,
      skill: "解一元一次方程",
      explanation: "Divide by 3 to get x - 2 = 6, then add 2 to get x = 8.",
      coachHints: ["What operation can undo the outside 3?", "After that, how do you isolate x?"],
    },
    {
      prompt: "Which inequality represents 'at most 12'?",
      standard: "Algebra I: Inequalities",
      difficulty: "基础",
      answers: ["x ≤ 12", "x ≥ 12", "x > 12", "x < -12"],
      correct: 0,
      skill: "解一元一次方程",
      explanation: "At most means the value can be 12 or less.",
      coachHints: ["Does 'at most' include 12?", "Should the values be less than or greater than 12?"],
    },
    {
      prompt: "A function has x-values that repeat with different y-values. Is it a function?",
      standard: "Algebra I: Functions",
      difficulty: "中等",
      answers: ["No, one input cannot have two outputs", "Yes, all tables are functions", "Yes, if y-values are positive", "No, because x is used"],
      correct: 0,
      skill: "函数图像解释",
      explanation: "A function assigns each input exactly one output.",
      coachHints: ["What is the rule for a function?", "Can the same x lead to two different y-values?"],
    },
    {
      prompt: "Factor x² + 5x + 6.",
      standard: "Algebra I: Quadratics",
      difficulty: "中等",
      answers: ["(x + 2)(x + 3)", "(x + 1)(x + 6)", "(x - 2)(x - 3)", "(x + 5)(x + 1)"],
      correct: 0,
      skill: "二次函数基础",
      explanation: "Find two numbers that multiply to 6 and add to 5: 2 and 3.",
      coachHints: ["What two numbers multiply to 6?", "Do those two numbers also add to 5?"],
    },
    {
      prompt: "What are the x-intercepts of y = (x - 4)(x + 1)?",
      standard: "Algebra I: Quadratics",
      difficulty: "中等",
      answers: ["x = 4 and x = -1", "x = -4 and x = 1", "x = 4 only", "x = -1 only"],
      correct: 0,
      skill: "二次函数基础",
      explanation: "Set each factor equal to zero: x - 4 = 0 and x + 1 = 0.",
      coachHints: ["What makes a product equal zero?", "What value makes each factor zero?"],
    },
    {
      prompt: "A system is y = x + 2 and y = -x + 6. What is the first algebra step to solve by substitution?",
      standard: "Algebra I: Systems",
      difficulty: "中等",
      answers: ["Set x + 2 equal to -x + 6", "Add the y-values", "Multiply both equations by 0", "Ignore one equation"],
      correct: 0,
      skill: "方程组",
      explanation: "Both expressions equal y, so set them equal to find x.",
      coachHints: ["If both expressions equal y, what else are they equal to?", "How can you make one equation with x only?"],
    },
    {
      prompt: "Which situation shows exponential growth?",
      standard: "Algebra I: Exponential Functions",
      difficulty: "中等",
      answers: ["A population doubles every month", "A taxi charges $2 per mile", "A line has slope 3", "A student saves $5 each week"],
      correct: 0,
      skill: "指数函数基础",
      explanation: "Exponential growth multiplies by a constant factor, such as doubling.",
      coachHints: ["Is the quantity adding the same amount or multiplying?", "Which choice uses repeated multiplication?"],
    },
    {
      prompt: "The graph of y = x² is shifted up 3 units. Which equation matches?",
      standard: "Algebra I: Quadratics",
      difficulty: "进阶",
      answers: ["y = x² + 3", "y = (x + 3)²", "y = x² - 3", "y = 3x²"],
      correct: 0,
      skill: "二次函数基础",
      explanation: "Adding 3 outside the square shifts the graph up 3 units.",
      coachHints: ["Is the shift vertical or horizontal?", "Where do vertical shifts appear in the equation?"],
    },
  ],
  geometry: [
    {
      prompt: "Two triangles have two pairs of corresponding angles congruent. What can you conclude?",
      standard: "Geometry: Similarity",
      difficulty: "中等",
      answers: ["The triangles are similar", "The triangles must be congruent", "The triangles have equal area", "No conclusion is possible"],
      correct: 0,
      skill: "全等判定",
      explanation: "AA similarity shows triangles have the same shape, but not necessarily the same size.",
      coachHints: ["What does two equal angle pairs tell you about shape?", "Does similarity always mean same size?"],
    },
    {
      prompt: "If two parallel lines are cut by a transversal, alternate interior angles are...",
      standard: "Geometry: Angle Relationships",
      difficulty: "基础",
      answers: ["Congruent", "Always 90 degrees", "Supplementary only", "Unrelated"],
      correct: 0,
      skill: "角关系",
      explanation: "Alternate interior angles are congruent when lines are parallel.",
      coachHints: ["What special angle pairs appear with parallel lines?", "Are alternate interior angles equal or supplementary?"],
    },
  ],
  biology: [
    {
      prompt: "Which structure controls what enters and leaves a cell?",
      standard: "Biology: Cell Structure",
      difficulty: "基础",
      answers: ["Cell membrane", "Nucleus", "Ribosome", "Mitochondrion"],
      correct: 0,
      skill: "细胞结构功能",
      explanation: "The cell membrane regulates materials moving into and out of the cell.",
      coachHints: ["Which structure is the cell's boundary?", "What does 'controls enters and leaves' suggest?"],
    },
    {
      prompt: "A trait appears more often after many generations because it helps survival. This is an example of...",
      standard: "Biology: Evolution",
      difficulty: "中等",
      answers: ["Natural selection", "Osmosis", "Cell division", "Photosynthesis"],
      correct: 0,
      skill: "遗传基础",
      explanation: "Natural selection can make helpful traits more common over generations.",
      coachHints: ["What happens to helpful traits over generations?", "Which choice explains survival advantage?"],
    },
    {
      prompt: "Plants convert light energy into chemical energy mainly through...",
      standard: "Biology: Energy Flow",
      difficulty: "基础",
      answers: ["Photosynthesis", "Respiration only", "Diffusion", "Mitosis"],
      correct: 0,
      skill: "能量转化",
      explanation: "Photosynthesis stores light energy as chemical energy in sugars.",
      coachHints: ["What process uses light?", "What kind of energy is stored in sugar?"],
    },
  ],
};

const expandedQuestionBank = {
  math8: [
    {
      prompt: "A table shows x increases by 2 while y increases by 10 each time. What is the rate of change?",
      standard: "Grade 8 Math: Linear Relationships",
      difficulty: "中等",
      answers: ["5", "10", "12", "20"],
      correct: 0,
      skill: "斜率概念",
      explanation: "Rate of change is change in y divided by change in x, so 10 / 2 = 5.",
      coachHints: ["How much does y change?", "How much does x change for the same step?"],
    },
    {
      prompt: "Which statement describes y = 2x + 3?",
      standard: "Grade 8 Math: Linear Equations",
      difficulty: "中等",
      answers: ["It starts at 3 and increases by 2 for each 1 in x", "It is proportional", "It has no y-intercept", "It decreases by 3"],
      correct: 0,
      skill: "数据图表",
      explanation: "In y = mx + b, b is the starting value and m is the rate of change.",
      coachHints: ["What number is added after 2x?", "What does the coefficient of x tell you?"],
    },
    {
      prompt: "A cylinder has radius 3 and height 10. Which expression represents its volume?",
      standard: "Grade 8 Math: Geometry and Measurement",
      difficulty: "中等",
      answers: ["π(3²)(10)", "π(3)(10²)", "2π(3)(10)", "3 + 10π"],
      correct: 0,
      skill: "多步文字题",
      explanation: "Cylinder volume is V = πr²h.",
      coachHints: ["What is the formula for cylinder volume?", "Which number is the radius?"],
    },
    {
      prompt: "Which number is irrational?",
      standard: "Grade 8 Math: Number Sense",
      difficulty: "基础",
      answers: ["√2", "0.75", "-4", "3/8"],
      correct: 0,
      skill: "比例关系",
      explanation: "√2 cannot be written as a ratio of two integers, so it is irrational.",
      coachHints: ["Which choices can be written as fractions?", "Does the square root simplify to a whole number?"],
    },
    {
      prompt: "A scatterplot trends upward from left to right. What association does it show?",
      standard: "Grade 8 Math: Data Analysis",
      difficulty: "基础",
      answers: ["Positive association", "Negative association", "No association", "A constant y-value"],
      correct: 0,
      skill: "数据图表",
      explanation: "An upward trend means both variables tend to increase together.",
      coachHints: ["What happens to y as x increases?", "Does the pattern go up or down?"],
    },
  ],
  rla8: [
    {
      prompt: "An author uses the word 'relentless' to describe a storm. What should you infer about the tone?",
      standard: "Grade 8 RLA: Vocabulary and Tone",
      difficulty: "中等",
      answers: ["The tone feels intense or threatening", "The tone is playful", "The tone is uncertain", "The tone is humorous"],
      correct: 0,
      skill: "词汇语境",
      explanation: "Relentless suggests something that does not stop, creating an intense tone.",
      coachHints: ["What feeling does 'relentless' create?", "Is the word light or forceful?"],
    },
    {
      prompt: "Which evidence best supports the claim that a speaker is disappointed?",
      standard: "Grade 8 RLA: Inference and Evidence",
      difficulty: "中等",
      answers: ["She folded the invitation and stared at the floor.", "The room had a window.", "The event began at noon.", "The invitation was printed in blue."],
      correct: 0,
      skill: "证据比较",
      explanation: "Actions and body language can support an inference about feelings.",
      coachHints: ["What does disappointed look like in behavior?", "Which detail shows emotion?"],
    },
    {
      prompt: "When revising an argumentative paragraph, what should every reason connect back to?",
      standard: "Grade 8 RLA: Argument Writing",
      difficulty: "基础",
      answers: ["The claim", "The font size", "The title length", "A random fact"],
      correct: 0,
      skill: "短文写作",
      explanation: "Reasons in an argument must support the claim.",
      coachHints: ["What is the argument trying to prove?", "What should reasons support?"],
    },
    {
      prompt: "Two articles discuss school lunches. One focuses on cost, and the other focuses on nutrition. What is being compared?",
      standard: "Grade 8 RLA: Compare Texts",
      difficulty: "中等",
      answers: ["The authors' focus or perspective", "The number of paragraphs only", "The publication dates only", "The font style"],
      correct: 0,
      skill: "主题与主张",
      explanation: "Comparing texts often means comparing focus, perspective, claim, and evidence.",
      coachHints: ["What does each article care about most?", "Are the authors looking at the same topic in the same way?"],
    },
    {
      prompt: "Which sentence is the clearest topic sentence for a paragraph about sleep and learning?",
      standard: "Grade 8 RLA: Organization",
      difficulty: "基础",
      answers: ["Getting enough sleep can improve how students learn.", "Sleep is a thing people do.", "School starts early.", "I have a bed."],
      correct: 0,
      skill: "短文写作",
      explanation: "A topic sentence should state the main idea of the paragraph clearly.",
      coachHints: ["Which sentence gives a clear main idea?", "Which one can the rest of the paragraph support?"],
    },
  ],
  science8: [
    {
      prompt: "A student rubs a balloon on hair and it sticks to a wall. Which force is most related?",
      standard: "Grade 8 Science: Force and Motion",
      difficulty: "基础",
      answers: ["Electric force", "Gravity only", "Magnetism only", "Weathering"],
      correct: 0,
      skill: "科学词汇",
      explanation: "Static electricity can create electric attraction between objects.",
      coachHints: ["What kind of charge effect can happen after rubbing?", "Is the wall acting like a magnet?"],
    },
    {
      prompt: "A rock layer contains fossils of ocean organisms. What can scientists infer?",
      standard: "Grade 8 Science: Earth History",
      difficulty: "中等",
      answers: ["The area may once have been covered by water", "The fossils formed yesterday", "The rock is made of metal", "No environment can be inferred"],
      correct: 0,
      skill: "数据解释",
      explanation: "Fossils can give evidence about past environments.",
      coachHints: ["Where do ocean organisms live?", "What does a fossil tell us about the past?"],
    },
    {
      prompt: "Which change is chemical rather than physical?",
      standard: "Grade 8 Science: Matter",
      difficulty: "基础",
      answers: ["Iron rusting", "Ice melting", "Paper being cut", "Water freezing"],
      correct: 0,
      skill: "科学词汇",
      explanation: "Rusting forms a new substance, which is evidence of a chemical change.",
      coachHints: ["Does a new substance form?", "Which option changes identity, not just shape or state?"],
    },
    {
      prompt: "If an investigation has no control group, what is harder to determine?",
      standard: "Grade 8 Science: Experimental Design",
      difficulty: "中等",
      answers: ["Whether the tested variable caused the result", "The color of the graph", "The title of the lab", "The number of pages"],
      correct: 0,
      skill: "实验设计",
      explanation: "A control group gives a comparison point for judging the effect of a variable.",
      coachHints: ["What does a control group help compare?", "Without comparison, what becomes uncertain?"],
    },
    {
      prompt: "A model shows the Moon between Earth and the Sun. What event can this model represent?",
      standard: "Grade 8 Science: Earth and Space",
      difficulty: "中等",
      answers: ["Solar eclipse", "Lunar eclipse", "Earthquake", "Tide from wind"],
      correct: 0,
      skill: "数据解释",
      explanation: "A solar eclipse can occur when the Moon is between Earth and the Sun.",
      coachHints: ["Which object is blocking sunlight?", "What eclipse happens when the Moon is between Earth and Sun?"],
    },
  ],
  algebraReady: [
    {
      prompt: "Which expression is equivalent to 5x + 2x - 3?",
      standard: "Algebra Readiness: Expressions",
      difficulty: "基础",
      answers: ["7x - 3", "7x + 3", "10x - 3", "5x - 1"],
      correct: 0,
      skill: "文字题翻译",
      explanation: "Combine like terms: 5x + 2x = 7x.",
      coachHints: ["Which terms have x?", "What happens when you combine like terms?"],
    },
    {
      prompt: "Solve -2x = 14.",
      standard: "Algebra Readiness: Equations",
      difficulty: "基础",
      answers: ["x = -7", "x = 7", "x = -12", "x = 16"],
      correct: 0,
      skill: "整数运算",
      explanation: "Divide both sides by -2 to isolate x.",
      coachHints: ["What operation is attached to x?", "What is 14 divided by -2?"],
    },
    {
      prompt: "A taxi charges $4 plus $2 per mile. Which expression shows the cost for m miles?",
      standard: "Algebra Readiness: Linear Modeling",
      difficulty: "中等",
      answers: ["2m + 4", "4m + 2", "6m", "2 + 4"],
      correct: 0,
      skill: "函数准备",
      explanation: "The starting fee is 4, and each mile adds 2 dollars.",
      coachHints: ["Which amount happens once?", "Which amount repeats per mile?"],
    },
    {
      prompt: "Which graph feature shows the starting value in a linear relationship?",
      standard: "Algebra Readiness: Graphs",
      difficulty: "基础",
      answers: ["The y-intercept", "The x-axis label", "The steepest point", "The last point only"],
      correct: 0,
      skill: "函数准备",
      explanation: "The y-intercept shows the value when x = 0.",
      coachHints: ["What does starting value mean for x?", "Where does a graph cross the y-axis?"],
    },
    {
      prompt: "Which inequality represents 'more than 9'?",
      standard: "Algebra Readiness: Inequalities",
      difficulty: "基础",
      answers: ["x > 9", "x < 9", "x ≤ 9", "x = 9"],
      correct: 0,
      skill: "方程逆运算",
      explanation: "More than means greater than and does not include 9.",
      coachHints: ["Does 'more than' include 9?", "Which symbol means greater than?"],
    },
  ],
  geometry: [
    {
      prompt: "Two triangles have three pairs of corresponding sides congruent. Which congruence shortcut applies?",
      standard: "Geometry: Congruence",
      difficulty: "基础",
      answers: ["SSS", "AAA", "SSA", "HL only"],
      correct: 0,
      skill: "全等判定",
      explanation: "SSS proves triangle congruence when all three corresponding side pairs match.",
      coachHints: ["What does each S represent?", "How many side pairs are given?"],
    },
    {
      prompt: "A line segment has endpoints (2, 3) and (8, 3). What is its length?",
      standard: "Geometry: Coordinate Geometry",
      difficulty: "基础",
      answers: ["6", "5", "8", "11"],
      correct: 0,
      skill: "几何词汇",
      explanation: "The y-values are the same, so subtract x-values: 8 - 2 = 6.",
      coachHints: ["Which coordinate changes?", "How far apart are the x-values?"],
    },
    {
      prompt: "If a triangle has angles 40° and 65°, what is the third angle?",
      standard: "Geometry: Triangle Angle Sum",
      difficulty: "基础",
      answers: ["75°", "85°", "105°", "115°"],
      correct: 0,
      skill: "角关系",
      explanation: "Triangle angles add to 180°, so 180 - 40 - 65 = 75.",
      coachHints: ["What is the angle sum of a triangle?", "How much is left after 40 and 65?"],
    },
    {
      prompt: "A dilation has scale factor 2. What happens to side lengths?",
      standard: "Geometry: Transformations",
      difficulty: "中等",
      answers: ["They double", "They are cut in half", "They stay the same", "They become negative"],
      correct: 0,
      skill: "几何词汇",
      explanation: "A scale factor of 2 multiplies every length by 2.",
      coachHints: ["What does scale factor multiply?", "Is 2 larger or smaller than 1?"],
    },
    {
      prompt: "Which statement is needed to prove two lines are parallel using angle relationships?",
      standard: "Geometry: Parallel Lines",
      difficulty: "中等",
      answers: ["A pair of alternate interior angles is congruent", "The lines look close", "The drawing uses arrows", "The segments have labels"],
      correct: 0,
      skill: "证明书写",
      explanation: "Congruent alternate interior angles can prove two lines are parallel.",
      coachHints: ["Which angle relationship has a theorem?", "What evidence is stronger than how the diagram looks?"],
    },
  ],
  biology: [
    {
      prompt: "Which molecule carries genetic instructions in cells?",
      standard: "Biology: Genetics",
      difficulty: "基础",
      answers: ["DNA", "Glucose", "Water", "Oxygen"],
      correct: 0,
      skill: "遗传基础",
      explanation: "DNA stores hereditary information used by cells.",
      coachHints: ["Which molecule is connected to genes?", "What carries inherited instructions?"],
    },
    {
      prompt: "What is the main purpose of cellular respiration?",
      standard: "Biology: Energy",
      difficulty: "中等",
      answers: ["To release usable energy from food molecules", "To make chromosomes disappear", "To copy sunlight directly", "To stop all cell processes"],
      correct: 0,
      skill: "能量转化",
      explanation: "Cellular respiration releases energy stored in food molecules for cell use.",
      coachHints: ["What do cells need energy for?", "Which process breaks down food for energy?"],
    },
    {
      prompt: "In a food chain, arrows usually show...",
      standard: "Biology: Ecology",
      difficulty: "基础",
      answers: ["The direction energy flows", "Which organism is largest", "Which organism is oldest", "The direction animals walk"],
      correct: 0,
      skill: "科学图表分析",
      explanation: "Food-chain arrows show energy transfer from one organism to another.",
      coachHints: ["What moves through a food chain?", "Do arrows point to who receives energy?"],
    },
    {
      prompt: "A plant cell is placed in salt water and loses water. Which process explains the water movement?",
      standard: "Biology: Cell Transport",
      difficulty: "中等",
      answers: ["Osmosis", "Mitosis", "Photosynthesis", "Mutation"],
      correct: 0,
      skill: "细胞结构功能",
      explanation: "Osmosis is the movement of water across a membrane.",
      coachHints: ["What substance is moving?", "What process describes water crossing a membrane?"],
    },
    {
      prompt: "A graph shows enzyme activity dropping sharply after a high temperature. What is the best explanation?",
      standard: "Biology: Enzymes",
      difficulty: "进阶",
      answers: ["The enzyme's shape changed and it works less well", "The enzyme became a carbohydrate", "Temperature has no effect", "The graph must be ignored"],
      correct: 0,
      skill: "科学图表分析",
      explanation: "High temperature can denature enzymes, changing their shape and reducing activity.",
      coachHints: ["What do enzymes depend on to work?", "How can high heat affect protein shape?"],
    },
  ],
};

const challengeQuestionBank = {
  math8: [
    {
      prompt: "A line has slope -3/2 and passes through (4, -1). Which equation represents the line?",
      standard: "Grade 8 Math: Linear Relationships",
      difficulty: "挑战",
      answers: ["y + 1 = -3/2(x - 4)", "y - 4 = -3/2(x + 1)", "y = 4x - 1", "y + 1 = 3/2(x + 4)"],
      correct: 0,
      skill: "斜率概念",
      explanation: "Point-slope form uses y - y1 = m(x - x1), so substitute m = -3/2 and (4, -1).",
      coachHints: ["Which form uses slope and one point?", "What changes when y1 is -1?"],
    },
    {
      prompt: "A cylinder and cone have the same radius and height. The cylinder volume is 96 cubic units. What is the cone volume?",
      standard: "Grade 8 Math: Volume",
      difficulty: "挑战",
      answers: ["32 cubic units", "48 cubic units", "96 cubic units", "288 cubic units"],
      correct: 0,
      skill: "多步文字题",
      explanation: "A cone with the same radius and height has one-third the cylinder volume.",
      coachHints: ["How are cone and cylinder volume related?", "What is one-third of 96?"],
    },
  ],
  rla8: [
    {
      prompt: "Two articles use the same statistic, but one says it proves a problem is urgent and the other says change is already working. What should a strong comparison explain?",
      standard: "Grade 8 RLA: Paired Text Analysis",
      difficulty: "挑战",
      answers: ["How each author interprets the same evidence differently", "Which article has more paragraphs", "Whether the statistic has commas", "Which title is shorter"],
      correct: 0,
      skill: "证据比较",
      explanation: "Paired-text analysis often asks how authors use or interpret evidence differently.",
      coachHints: ["Is the evidence different or the interpretation different?", "What does each author want the reader to believe?"],
    },
    {
      prompt: "A narrator says, 'I was sure the speech would be easy,' but later describes checking the clock, forgetting notes, and speaking too quickly. Which inference is best supported?",
      standard: "Grade 8 RLA: Inference and Text Evidence",
      difficulty: "挑战",
      schoolExamDepth: "evidence-based inference",
      multiStepReasoning: true,
      answers: ["The narrator felt more nervous than expected", "The narrator did not prepare at all", "The audience interrupted the speech", "The speech topic was changed"],
      correct: 0,
      skill: "证据推理",
      explanation: "The best inference combines the narrator's claim with later behavior. Clock-checking, forgotten notes, and rushing all support nervousness.",
      coachHints: ["Which details show behavior instead of direct feelings?", "Which answer is supported by all three details, not just one guess?"],
    },
  ],
  science8: [
    {
      prompt: "A student claims fertilizer increases plant growth. Both groups got fertilizer, but one group also got more light. What is the main flaw?",
      standard: "Grade 8 Science: Experimental Design",
      difficulty: "挑战",
      answers: ["More than one variable changed, so the cause is unclear", "The plants were measured", "The conclusion used data", "The experiment had a question"],
      correct: 0,
      skill: "变量控制",
      explanation: "A fair test changes only one independent variable so results can be linked to one cause.",
      coachHints: ["Which things changed between groups?", "Can you tell whether fertilizer or light caused the result?"],
    },
    {
      prompt: "A data table shows that as distance from a lamp increases, measured light intensity decreases. Which conclusion is best supported by the data?",
      standard: "Grade 8 Science: Data Analysis",
      difficulty: "挑战",
      schoolExamDepth: "data interpretation",
      multiStepReasoning: true,
      answers: ["Light intensity decreases as distance increases", "The lamp gives off more heat at larger distances", "Distance has no relationship to intensity", "The table proves all lamps behave the same"],
      correct: 0,
      skill: "科学图表分析",
      explanation: "The conclusion must stay within the data. The table supports a relationship between distance and measured intensity, not claims about heat or every lamp.",
      coachHints: ["What are the two variables in the table?", "Which answer describes only what the data actually measured?"],
    },
  ],
  english1: [
    {
      prompt: "An author first describes a character's confident claim, then shows the character hesitating before acting. What is the best inference about the author's purpose?",
      standard: "English I: Author's Craft",
      difficulty: "挑战",
      answers: ["To reveal a conflict between appearance and inner uncertainty", "To prove the character has no emotions", "To list unrelated events", "To explain a scientific process"],
      correct: 0,
      skill: "分析作者意图",
      explanation: "Contrasting public confidence with private hesitation can reveal inner conflict.",
      coachHints: ["What contrast does the author create?", "What does hesitation reveal that the claim did not?"],
    },
    {
      prompt: "A paragraph begins with a broad claim, then includes a personal story and finally a statistic from a city survey. What is the strongest reason for this structure?",
      standard: "English I: Argument and Author's Craft",
      difficulty: "挑战",
      schoolExamDepth: "argument structure",
      multiStepReasoning: true,
      answers: ["It combines emotional example with factual evidence to strengthen the claim", "It hides the author's position until the end", "It changes from fiction to drama", "It proves personal stories are always more reliable than surveys"],
      correct: 0,
      skill: "分析作者意图",
      explanation: "Argument questions often ask how structure supports purpose. A story can engage the reader, while a statistic adds evidence for the claim.",
      coachHints: ["What does the personal story do for the reader?", "What does the statistic add that the story alone cannot prove?"],
    },
  ],
  algebra1: [
    {
      prompt: "A phone plan charges $25 per month plus $0.08 per text. Another plan charges $45 per month with unlimited texts. For which number of texts is the unlimited plan cheaper?",
      standard: "Algebra I: Linear Inequalities",
      difficulty: "挑战",
      schoolExamDepth: "multi-step inequality",
      multiStepReasoning: true,
      answers: ["More than 250 texts", "Fewer than 250 texts", "Exactly 200 texts", "Any number of texts"],
      correct: 0,
      skill: "线性方程",
      explanation: "Set 45 < 25 + 0.08t, then solve 20 < 0.08t, so t > 250. The unlimited plan is cheaper above 250 texts.",
      coachHints: ["Which expression represents each plan's cost?", "When should the unlimited plan's cost be less than the per-text plan?"],
    },
    {
      prompt: "A quadratic has x-intercepts at -2 and 5 and opens upward. Which statement must be true about its graph?",
      standard: "Algebra I: Quadratic Functions",
      difficulty: "挑战",
      schoolExamDepth: "function reasoning",
      multiStepReasoning: true,
      answers: ["The vertex has an x-coordinate halfway between -2 and 5", "The graph opens downward", "The y-intercept must be 0", "The function has no minimum"],
      correct: 0,
      skill: "函数图像",
      explanation: "For a parabola, the axis of symmetry is halfway between the two x-intercepts. Since it opens upward, the vertex is a minimum on that line.",
      coachHints: ["What symmetry does a parabola have around its intercepts?", "What does opening upward tell you about the vertex?"],
    },
  ],
  geometry: [
    {
      prompt: "In a proof, AB ≅ DE, BC ≅ EF, and ∠B ≅ ∠E. Which triangle congruence theorem is strongest?",
      standard: "Geometry: Triangle Congruence Proofs",
      difficulty: "挑战",
      answers: ["SAS", "SSA", "AAA", "HL"],
      correct: 0,
      skill: "全等判定",
      explanation: "The congruent angle is included between the two congruent side pairs, so SAS applies.",
      coachHints: ["Where is the given angle located?", "Is it between the two side pairs?"],
    },
    {
      prompt: "Two parallel lines are cut by a transversal. One exterior angle measures 124°. What is the measure of its same-side exterior angle?",
      standard: "Geometry: Parallel Lines and Angle Relationships",
      difficulty: "挑战",
      schoolExamDepth: "angle relationship reasoning",
      multiStepReasoning: true,
      answers: ["56°", "124°", "62°", "180°"],
      correct: 0,
      skill: "角度关系",
      explanation: "Same-side exterior angles formed by parallel lines are supplementary, so their measures add to 180 degrees. 180 - 124 = 56.",
      coachHints: ["Are same-side exterior angles equal or supplementary?", "What number must you add to 124 to reach 180?"],
    },
  ],
  biology: [
    {
      prompt: "A mutation changes one DNA base but the protein still works normally. Which explanation is most reasonable?",
      standard: "Biology: Genetics and Protein Synthesis",
      difficulty: "挑战",
      answers: ["The mutation may not have changed the amino acid or critical protein shape", "All mutations stop protein production", "DNA never affects proteins", "The cell no longer needs enzymes"],
      correct: 0,
      skill: "遗传基础",
      explanation: "Some mutations are silent or do not affect a critical part of protein structure.",
      coachHints: ["Do all DNA changes have the same effect?", "What has to change for protein function to change?"],
    },
    {
      prompt: "A graph shows a population rising quickly, then leveling off for several years. Which explanation best fits the pattern?",
      standard: "Biology: Ecology and Carrying Capacity",
      difficulty: "挑战",
      schoolExamDepth: "graph-based biology reasoning",
      multiStepReasoning: true,
      answers: ["The population approached the environment's carrying capacity", "The population had unlimited resources forever", "All predators disappeared permanently", "The graph shows no relationship to resources"],
      correct: 0,
      skill: "科学图表分析",
      explanation: "When population growth levels off, limited resources often keep the population near carrying capacity instead of increasing without limit.",
      coachHints: ["What does a flat part of a population graph suggest?", "Which answer explains why growth would slow after a rapid increase?"],
    },
  ],
};

const twoHourExpansionQuestionBank = window.twoHourExpansionQuestionBank || {};

const questionQualityRubric = {
  alignment: {
    label: "TEKS/STAAR alignment",
    points: 20,
    check: (question) => Boolean(question.standard && /(Grade|English|Algebra|Geometry|Biology|Math|Science|RLA)/i.test(question.standard)),
  },
  skillTag: {
    label: "skillTag",
    points: 15,
    check: (question) => Boolean(question.skill),
  },
  difficultyLadder: {
    label: "difficultyLadder",
    points: 10,
    check: (question) => Boolean(question.difficulty),
  },
  explanationDepth: {
    label: "explanationDepth",
    points: 20,
    check: (question) => (question.explanation || "").trim().length >= 45,
  },
  guidedHints: {
    label: "guidedHints",
    points: 15,
    check: (question) => Array.isArray(question.coachHints) && question.coachHints.length >= 2,
  },
  distractorQuality: {
    label: "distractorQuality",
    points: 20,
    check: (question) => Array.isArray(question.answers)
      && question.answers.length === 4
      && new Set(question.answers).size === 4
      && Number.isInteger(question.correct)
      && question.correct >= 0
      && question.correct < question.answers.length,
  },
};

const questionCoverageTargets = {
  math8: { minimumQuestions: 8, minimumAdvancedQuestions: 1 },
  rla8: { minimumQuestions: 8, minimumAdvancedQuestions: 1 },
  science8: { minimumQuestions: 8, minimumAdvancedQuestions: 1 },
  english1: { minimumQuestions: 8, minimumAdvancedQuestions: 1 },
  algebra1: { minimumQuestions: 8, minimumAdvancedQuestions: 1 },
  geometry: { minimumQuestions: 8, minimumAdvancedQuestions: 1 },
  biology: { minimumQuestions: 8, minimumAdvancedQuestions: 1 },
};

const twoHourLearningTargets = {
  dailyMinutes: 120,
  targetQuestionsPerSession: 24,
  minimumBankQuestionsPerSubject: 80,
  minimumChallengeQuestions: 12,
  minimumOpenResponseTasks: 10,
  spiralReviewRatio: 25,
  sourcePolicy: "Use TEKS and STAAR released item style as references; write original questions instead of copying protected test banks.",
};

function allLocalQuestionsForSubject(subjectId) {
  return mergeQuestions(
    localQuestionBank[subjectId] || [],
    (expandedQuestionBank[subjectId] || []).concat(challengeQuestionBank[subjectId] || [], twoHourExpansionQuestionBank[subjectId] || [])
  );
}

function openResponseTaskCount(subjectId) {
  return allLocalQuestionsForSubject(subjectId).filter((question) => question.openResponse || question.multiStepReasoning).length;
}

function qualityScore(question) {
  const checks = Object.values(questionQualityRubric).map((rule) => ({
    label: rule.label,
    passed: rule.check(question),
    points: rule.points,
  }));
  const score = checks.reduce((sum, item) => sum + (item.passed ? item.points : 0), 0);
  return { score, checks, passed: score >= 80 };
}

function bankScaleGap(subjectId) {
  const questions = allLocalQuestionsForSubject(subjectId);
  const challengeCount = questions.filter((question) => difficultyScore(question.difficulty) >= 3 || question.schoolExamDepth).length;
  const openResponseCount = openResponseTaskCount(subjectId);
  return {
    subjectId,
    questionGap: Math.max(0, twoHourLearningTargets.minimumBankQuestionsPerSubject - questions.length),
    challengeGap: Math.max(0, twoHourLearningTargets.minimumChallengeQuestions - challengeCount),
    openResponseGap: Math.max(0, twoHourLearningTargets.minimumOpenResponseTasks - openResponseCount),
    currentQuestions: questions.length,
    challengeCount,
    openResponseCount,
    readyForTwoHours: questions.length >= twoHourLearningTargets.minimumBankQuestionsPerSubject
      && challengeCount >= twoHourLearningTargets.minimumChallengeQuestions
      && openResponseCount >= twoHourLearningTargets.minimumOpenResponseTasks,
  };
}

function coverageBySubject(subjectId) {
  const questions = allLocalQuestionsForSubject(subjectId);
  const target = questionCoverageTargets[subjectId] || { minimumQuestions: 5, minimumAdvancedQuestions: 0 };
  const advancedCount = questions.filter((question) => difficultyScore(question.difficulty) >= 2).length;
  const averageQuality = questions.length
    ? Math.round(questions.reduce((sum, question) => sum + qualityScore(question).score, 0) / questions.length)
    : 0;
  return {
    subjectId,
    questionCount: questions.length,
    advancedCount,
    target,
    averageQuality,
    meetsCount: questions.length >= target.minimumQuestions,
    meetsAdvanced: advancedCount >= target.minimumAdvancedQuestions,
    meetsQuality: averageQuality >= 80,
  };
}

function buildQuestionQualityAudit(subjectIds = Object.keys(questionCoverageTargets)) {
  const coverage = subjectIds.map(coverageBySubject);
  const weakSubjects = coverage.filter((subject) => !subject.meetsCount || !subject.meetsAdvanced || !subject.meetsQuality);
  const scaleGaps = subjectIds.map(bankScaleGap);
  const twoHourReadiness = scaleGaps.filter((subject) => subject.readyForTwoHours).length;
  return {
    generatedAt: new Date().toISOString(),
    rubric: questionQualityRubric,
    expansionTarget: twoHourLearningTargets,
    coverage,
    scaleGaps,
    weakSubjects,
    twoHourReadiness,
    ready: weakSubjects.length === 0,
  };
}

let state = {
  accountId: "parent",
  accountRole: "parent",
  studentId: "older",
  grade: "9",
  subject: "english1",
  selectedAnswer: null,
  selectedAnswers: {},
  preAnswerThoughts: {},
  answerConfidence: {},
  hintUsage: {},
  guidanceLock: null,
  guidedMastery: {},
  inlineCoachHistory: [],
  currentQuestion: 0,
  lastAdvanceNotice: "",
  answerSyncStatus: { state: "idle", text: "记录待同步" },
  cloudQuestions: {},
  cloudLoading: false,
  chatHistory: [],
  reportReady: false,
  records: [],
  mistakeLog: [],
  authSession: null,
  authProfile: null,
  cloudStudents: {},
  adaptiveLevels: {},
  adaptiveStats: {},
  answeredQuestionKeys: {},
  skillMastery: {},
  practiceSessions: [],
  challengeProofs: [],
  activePracticeSessionId: "",
  activeQuestionProgressKey: "",
  questionStartedAt: "",
  learningPathSubject: "math",
  planSettings: {
    older: { minutes: 30, questionTarget: 8, difficultyMode: "adaptive", focusSubject: "english1" },
    younger: { minutes: 30, questionTarget: 8, difficultyMode: "adaptive", focusSubject: "math8" },
  },
};

const $ = (id) => document.getElementById(id);
const storageKey = "family-learning-coach";
const authStorageKey = "family-learning-coach-auth";
const supabaseConfig = {
  url: "https://olyehadsblazpyxhsryn.supabase.co",
  key: "sb_publishable_5-n_a32xrCbk9O4UtLB0eg_-XXr9L6c",
};
const supabaseClient = window.supabase?.createClient(supabaseConfig.url, supabaseConfig.key);
const roleAllowedViews = {
  parent: ["parent", "roadmap"],
  student: ["today", "learningPath", "diagnostic", "mistakes", "report", "coach"],
};

function accountDataStorageKey() {
  return state.authSession?.user?.id ? `${storageKey}:${state.authSession.user.id}` : storageKey;
}

function clearLearningStateForAccount() {
  state.selectedAnswer = null;
  state.selectedAnswers = {};
  state.preAnswerThoughts = {};
  state.answerConfidence = {};
  state.hintUsage = {};
  state.guidanceLock = null;
  state.guidedMastery = {};
  state.inlineCoachHistory = [];
  state.currentQuestion = 0;
  state.chatHistory = [];
  state.reportReady = false;
  state.records = [];
  state.mistakeLog = [];
  state.adaptiveLevels = {};
  state.adaptiveStats = {};
  state.answeredQuestionKeys = {};
  state.skillMastery = {};
  state.practiceSessions = [];
  state.challengeProofs = [];
  state.activePracticeSessionId = "";
  state.activeQuestionProgressKey = "";
  state.questionStartedAt = "";
}

function loadSavedData(key = storageKey, options = {}) {
  try {
    if (options.resetLearning) clearLearningStateForAccount();
    const saved = JSON.parse(localStorage.getItem(key));
    if (saved && Array.isArray(saved.records)) {
      state.records = saved.records;
    }
    if (saved && Array.isArray(saved.mistakeLog)) {
      state.mistakeLog = saved.mistakeLog;
    }
    if (saved?.answerConfidence) state.answerConfidence = saved.answerConfidence;
    if (saved?.selectedAnswers) state.selectedAnswers = saved.selectedAnswers;
    if (saved?.preAnswerThoughts) state.preAnswerThoughts = saved.preAnswerThoughts;
    if (saved?.hintUsage) state.hintUsage = saved.hintUsage;
    if (saved?.guidanceLock) state.guidanceLock = saved.guidanceLock;
    if (saved?.guidedMastery) state.guidedMastery = saved.guidedMastery;
    if (Array.isArray(saved?.inlineCoachHistory)) state.inlineCoachHistory = saved.inlineCoachHistory;
    if (Number.isInteger(saved?.currentQuestion)) state.currentQuestion = saved.currentQuestion;
    if (typeof saved?.reportReady === "boolean") state.reportReady = saved.reportReady;
    if (saved?.accountId) state.accountId = saved.accountId;
    if (saved?.accountRole) state.accountRole = saved.accountRole;
    if (saved?.studentId) state.studentId = saved.studentId;
    if (saved?.grade) state.grade = saved.grade;
    if (saved?.subject) state.subject = saved.subject;
    if (saved?.learningPathSubject) state.learningPathSubject = saved.learningPathSubject;
    if (saved?.planSettings) {
      state.planSettings = {
        ...state.planSettings,
        ...saved.planSettings,
      };
    }
    if (saved?.adaptiveLevels) state.adaptiveLevels = saved.adaptiveLevels;
    if (saved?.adaptiveStats) state.adaptiveStats = saved.adaptiveStats;
    if (saved?.answeredQuestionKeys) state.answeredQuestionKeys = saved.answeredQuestionKeys;
    if (saved?.skillMastery) state.skillMastery = saved.skillMastery;
    if (Array.isArray(saved?.practiceSessions)) state.practiceSessions = saved.practiceSessions;
    if (Array.isArray(saved?.challengeProofs)) state.challengeProofs = saved.challengeProofs;
    if (saved?.activePracticeSessionId) state.activePracticeSessionId = saved.activePracticeSessionId;
    if (saved?.activeQuestionProgressKey) state.activeQuestionProgressKey = saved.activeQuestionProgressKey;
    if (saved?.questionStartedAt) state.questionStartedAt = saved.questionStartedAt;
  } catch {
    state.records = [];
  }
}

function saveData(key = accountDataStorageKey()) {
  localStorage.setItem(
    key,
    JSON.stringify({
      records: state.records,
      mistakeLog: state.mistakeLog,
      selectedAnswers: state.selectedAnswers,
      preAnswerThoughts: state.preAnswerThoughts,
      answerConfidence: state.answerConfidence,
      hintUsage: state.hintUsage,
      guidanceLock: state.guidanceLock,
      guidedMastery: state.guidedMastery,
      inlineCoachHistory: state.inlineCoachHistory,
      currentQuestion: state.currentQuestion,
      reportReady: state.reportReady,
      accountId: state.accountId,
      accountRole: state.accountRole,
      studentId: state.studentId,
      grade: state.grade,
      subject: state.subject,
      learningPathSubject: state.learningPathSubject,
      planSettings: state.planSettings,
      adaptiveLevels: state.adaptiveLevels,
      adaptiveStats: state.adaptiveStats,
      answeredQuestionKeys: state.answeredQuestionKeys,
      skillMastery: state.skillMastery,
      practiceSessions: state.practiceSessions,
      challengeProofs: state.challengeProofs,
      activePracticeSessionId: state.activePracticeSessionId,
      activeQuestionProgressKey: state.activeQuestionProgressKey,
      questionStartedAt: state.questionStartedAt,
      lastUpdated: new Date().toISOString(),
    })
  );
}

async function supabaseRequest(path, options = {}) {
  const token = state.authSession?.access_token || supabaseConfig.key;
  const response = await fetch(`${supabaseConfig.url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: supabaseConfig.key,
      Authorization: `Bearer ${token}`,
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

async function authRequest(path, options = {}) {
  const response = await fetch(`${supabaseConfig.url}/auth/v1/${path}`, {
    ...options,
    headers: {
      apikey: supabaseConfig.key,
      "Content-Type": "application/json",
      ...(state.authSession?.access_token ? { Authorization: `Bearer ${state.authSession.access_token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(data?.error_description || data?.msg || data?.message || `Auth request failed: ${response.status}`);
  }
  return data;
}

function persistAuthSession(session) {
  state.authSession = session || null;
  if (session) {
    localStorage.setItem(authStorageKey, JSON.stringify(session));
  } else {
    localStorage.removeItem(authStorageKey);
  }
}

function loadPersistedAuthSession() {
  try {
    const session = JSON.parse(localStorage.getItem(authStorageKey));
    if (session?.access_token && session?.user?.id) return session;
  } catch {
    return null;
  }
  return null;
}

async function supabaseRpc(functionName, body = {}) {
  return supabaseRequest(`rpc/${functionName}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
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

function localStudentIdFromName(name) {
  const normalized = String(name || "").trim().toUpperCase();
  if (normalized === "MIA") return "older";
  if (normalized === "EVA") return "younger";
  return "older";
}

function currentAuthUserLabel() {
  if (!state.authSession?.user?.email) return "未登录";
  const profile = state.authProfile;
  const role = profile?.role === "parent" ? "家长" : "孩子";
  return `${role}：${profile?.display_name || state.authSession.user.email}`;
}

function setAuthStatus(message) {
  const status = $("authStatus");
  if (status) status.textContent = message;
  const accountStatus = $("accountStatus");
  if (accountStatus && state.authSession) accountStatus.textContent = currentAuthUserLabel();
}

function selectedSignupProfile() {
  const role = $("signupRole")?.value || "parent";
  const studentName = role === "student" ? $("signupStudent")?.value || "MIA" : "";
  return {
    role,
    displayName: role === "student" ? studentName : "家长",
    studentName,
  };
}

function inferSignupProfile(email) {
  const localPart = String(email || "").split("@")[0].toLowerCase();
  if (localPart.includes("+mia") || localPart.endsWith(".mia")) {
    return { role: "student", displayName: "MIA", studentName: "MIA" };
  }
  if (localPart.includes("+eva") || localPart.endsWith(".eva")) {
    return { role: "student", displayName: "EVA", studentName: "EVA" };
  }
  return { role: "parent", displayName: "家长", studentName: "" };
}

function signupProfileForCurrentForm(email) {
  return selectedSignupProfile();
}

function applyProfileToLocalState(profile, options = {}) {
  if (!profile) return;
  const { persist = true } = options;
  state.authProfile = profile;

  if (profile.role === "parent") {
    state.accountId = "parent";
    state.accountRole = "parent";
  } else {
    const studentName = profile.display_name || (profile.student_id && Object.keys(state.cloudStudents).find((key) => state.cloudStudents[key] === profile.student_id));
    const localStudentId = localStudentIdFromName(studentName);
    const accountId = localStudentId === "younger" ? "eva" : "mia";
    state.accountId = accountId;
    state.accountRole = "student";
    state.studentId = localStudentId;
    state.grade = activeStudent().grade;
    state.subject = planForStudent(localStudentId).focusSubject || subjects[state.grade][0].id;
  }

  if (persist) saveData(accountDataStorageKey());
}

function renderAuthGate() {
  const signedIn = Boolean(state.authSession);
  const loginView = $("loginView");
  const appShell = $("appShell");
  if (loginView) loginView.classList.toggle("hidden", signedIn);
  if (appShell) appShell.classList.toggle("authenticated", signedIn);
}

function setAuthMode(mode = "login") {
  const signupMode = mode === "signup";
  $("authForm")?.classList.toggle("auth-mode-hidden", signupMode);
  $("signupForm")?.classList.toggle("auth-mode-hidden", !signupMode);
}

function showSignupMode() {
  const loginEmail = $("authEmail")?.value.trim();
  if (loginEmail && !$("signupEmail")?.value) $("signupEmail").value = loginEmail;
  setAuthStatus("");
  setAuthMode("signup");
  $("signupEmail")?.focus();
}

function showLoginMode() {
  const signupEmail = $("signupEmail")?.value.trim();
  if (signupEmail && !$("authEmail")?.value) $("authEmail").value = signupEmail;
  setAuthStatus("");
  setAuthMode("login");
  $("authEmail")?.focus();
}

function clearAuthForms() {
  ["authEmail", "authPassword", "signupEmail", "signupPassword"].forEach((id) => {
    const input = $(id);
    if (input) input.value = "";
  });
  if ($("signupRole")) $("signupRole").value = "parent";
  setAuthMode("login");
  renderAuth();
}

function viewAllowedForRole(viewName) {
  const role = state.accountRole === "parent" ? "parent" : "student";
  return roleAllowedViews[role].includes(viewName);
}

function applyRoleVisibility() {
  const isParent = state.accountRole === "parent";
  document.querySelectorAll(".parentOnly").forEach((item) => item.classList.toggle("role-hidden", !isParent));
  document.querySelectorAll(".studentOnly").forEach((item) => item.classList.toggle("role-hidden", isParent));
  const currentView = document.querySelector(".view.active")?.id?.replace("View", "");
  if (!currentView || !viewAllowedForRole(currentView)) {
    if (isParent) {
      switchView("parent");
    } else {
      switchView("today");
    }
  }
}

async function loadFamilyStudentsFromCloud() {
  if (!state.authSession) return;
  const data = await supabaseRpc("get_my_family_students");

  state.cloudStudents = {};
  (data || []).forEach((student) => {
    const localStudentId = localStudentIdFromName(student.display_name);
    state.cloudStudents[localStudentId] = student.student_id;
  });
}

async function findCloudSubjectId(subjectId) {
  const subject = subjectById(subjectId);
  if (!subject) return null;
  const data = await supabaseRequest(
    `subjects?${new URLSearchParams({ select: "id,title", title: `eq.${subject.label}`, limit: "1" }).toString()}`,
    { headers: { Prefer: "" } }
  );
  return data?.[0]?.id || null;
}

async function findLocalSubjectByCloudId(cloudSubjectId) {
  if (!cloudSubjectId) return null;
  const data = await supabaseRequest(
    `subjects?${new URLSearchParams({ select: "title", id: `eq.${cloudSubjectId}`, limit: "1" }).toString()}`,
    { headers: { Prefer: "" } }
  );
  const title = data?.[0]?.title;
  return Object.values(subjects).flat().find((subject) => subject.label === title) || null;
}

async function loadPlanSettingsFromCloud() {
  if (!state.authSession) return;
  const cloudStudentIds = Object.values(state.cloudStudents).filter(Boolean);
  if (!cloudStudentIds.length) return;

  const data = await supabaseRequest(
    `study_plan_settings?${new URLSearchParams({
      select: "student_id,minutes_per_day,focus_subject_id",
      student_id: `in.(${cloudStudentIds.join(",")})`,
    }).toString()}`,
    { headers: { Prefer: "" } }
  );

  for (const plan of data || []) {
    const localStudentId = Object.keys(state.cloudStudents).find((key) => state.cloudStudents[key] === plan.student_id);
    if (!localStudentId) continue;
    const localSubject = await findLocalSubjectByCloudId(plan.focus_subject_id);
    state.planSettings[localStudentId] = {
      minutes: plan.minutes_per_day || 30,
      focusSubject: localSubject?.id || planForStudent(localStudentId).focusSubject,
    };
  }

  saveData();
}

async function savePlanSettingsToCloud(studentId) {
  if (!state.authSession || state.accountRole !== "parent") return;
  const cloudStudentId = state.cloudStudents[studentId];
  if (!cloudStudentId) {
    setAuthStatus("已本机保存；云端还没有找到这个孩子的关联。");
    return;
  }

  const plan = planForStudent(studentId);
  const focusSubjectId = await findCloudSubjectId(plan.focusSubject);
  await supabaseRequest("study_plan_settings?on_conflict=student_id", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify({
      student_id: cloudStudentId,
      parent_user_id: state.authProfile?.id || state.authSession.user.id,
      minutes_per_day: plan.minutes,
      focus_subject_id: focusSubjectId,
      goal: $("goalSelect").value || "summer",
    }),
  });
  setAuthStatus("学习计划已保存到云端。");
}

function cloudMistakePayload(item) {
  return {
    student_id: state.cloudStudents[item.studentId],
    subject_id: item.cloudSubjectId,
    question_key: item.key,
    prompt: item.prompt,
    skill: item.skill,
    difficulty: item.difficulty || "中等",
    selected_answer: item.selectedAnswer || null,
    correct_answer: item.correctAnswer || null,
    reason: item.reason || "答错",
    attempts: item.attempts || 1,
    resolved: Boolean(item.resolved),
    last_missed_at: item.lastMissedIso || new Date().toISOString(),
    reviewed_at: item.reviewedIso || null,
    updated_by: state.authProfile?.id || state.authSession?.user?.id || null,
  };
}

async function saveMistakeToCloud(item) {
  if (!state.authSession || !item) return;
  const cloudStudentId = state.cloudStudents[item.studentId];
  if (!cloudStudentId) return;
  const cloudSubjectId = await findCloudSubjectId(item.subjectId);
  if (!cloudSubjectId) return;

  await supabaseRequest("mistake_reviews?on_conflict=student_id,subject_id,question_key", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(cloudMistakePayload({ ...item, cloudSubjectId })),
  });
}

async function syncMistakeLogToCloud() {
  if (!state.authSession) return;
  const pending = state.mistakeLog.filter((item) => state.cloudStudents[item.studentId]);
  for (const item of pending) {
    await saveMistakeToCloud(item);
  }
}

async function cloudMistakeToLocal(row) {
  const localStudentId = Object.keys(state.cloudStudents).find((key) => state.cloudStudents[key] === row.student_id);
  const localSubject = await findLocalSubjectByCloudId(row.subject_id);
  if (!localStudentId || !localSubject) return null;

  return {
    key: row.question_key || [localStudentId, localSubject.id, row.prompt].join("::"),
    studentId: localStudentId,
    studentName: students.find((student) => student.id === localStudentId)?.name || "学生",
    grade: students.find((student) => student.id === localStudentId)?.grade || "9",
    subjectId: localSubject.id,
    subjectLabel: localSubject.label,
    prompt: row.prompt,
    skill: row.skill,
    difficulty: row.difficulty || "中等",
    selectedAnswer: row.selected_answer || "未作答",
    correctAnswer: row.correct_answer || "",
    reason: row.reason || "答错",
    attempts: row.attempts || 1,
    lastMissedAt: row.last_missed_at ? new Date(row.last_missed_at).toLocaleString("zh-CN", { dateStyle: "medium", timeStyle: "short" }) : "",
    lastMissedIso: row.last_missed_at || "",
    reviewedAt: row.reviewed_at ? new Date(row.reviewed_at).toLocaleString("zh-CN", { dateStyle: "medium", timeStyle: "short" }) : "",
    reviewedIso: row.reviewed_at || "",
    resolved: Boolean(row.resolved),
  };
}

async function loadMistakesFromCloud() {
  if (!state.authSession) return;
  const cloudStudentIds = Object.values(state.cloudStudents).filter(Boolean);
  if (!cloudStudentIds.length) return;

  const data = await supabaseRequest(
    `mistake_reviews?${new URLSearchParams({
      select: "student_id,subject_id,question_key,prompt,skill,difficulty,selected_answer,correct_answer,reason,attempts,resolved,last_missed_at,reviewed_at",
      student_id: `in.(${cloudStudentIds.join(",")})`,
      order: "last_missed_at.desc",
    }).toString()}`,
    { headers: { Prefer: "" } }
  );

  const merged = new Map(state.mistakeLog.map((item) => [item.key, item]));
  for (const row of data || []) {
    const localItem = await cloudMistakeToLocal(row);
    if (!localItem) continue;
    merged.set(localItem.key, { ...(merged.get(localItem.key) || {}), ...localItem });
  }
  state.mistakeLog = Array.from(merged.values()).slice(0, 80);
  saveData();
}

function cloudSkillMasteryPayload(item, cloudSubjectId) {
  return {
    student_id: state.cloudStudents[item.studentId],
    subject_id: cloudSubjectId,
    skill: item.skill,
    mastery: item.mastery || 45,
    attempts: item.attempts || 0,
    correct_count: item.correctCount || 0,
    review_count: item.reviewCount || 0,
    accuracy: item.accuracy || 0,
    average_time: item.averageTime || 0,
    status: item.status || "not_started",
    last_practiced_at: item.lastPracticedAt || null,
    updated_by: state.authProfile?.id || state.authSession?.user?.id || null,
  };
}

async function saveSkillMasteryToCloud(item) {
  if (!state.authSession || !item || !item.skill) return;
  const cloudStudentId = state.cloudStudents[item.studentId];
  if (!cloudStudentId) return;
  const cloudSubjectId = await findCloudSubjectId(item.subject);
  if (!cloudSubjectId) return;

  await supabaseRequest("skill_mastery?on_conflict=student_id,subject_id,skill", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(cloudSkillMasteryPayload(item, cloudSubjectId)),
  });
}

async function syncSkillMasteryToCloud() {
  if (!state.authSession) return;
  const pending = Object.values(state.skillMastery).filter((item) => state.cloudStudents[item.studentId]);
  for (const item of pending) {
    try {
      await saveSkillMasteryToCloud(item);
    } catch (error) {
      console.warn("Skill mastery cloud sync skipped.", error);
      return;
    }
  }
}

async function cloudSkillMasteryToLocal(row) {
  const localStudentId = Object.keys(state.cloudStudents).find((key) => state.cloudStudents[key] === row.student_id);
  const localSubject = await findLocalSubjectByCloudId(row.subject_id);
  if (!localStudentId || !localSubject || !row.skill) return null;

  return {
    studentId: localStudentId,
    subject: localSubject.id,
    skill: row.skill,
    mastery: row.mastery || 45,
    attempts: row.attempts || 0,
    correctCount: row.correct_count || 0,
    reviewCount: row.review_count || 0,
    accuracy: row.accuracy || 0,
    averageTime: row.average_time || 0,
    lastPracticedAt: row.last_practiced_at || "",
    status: row.status || skillMasteryStatus(row.mastery, row.accuracy, row.attempts),
  };
}

async function loadSkillMasteryFromCloud() {
  if (!state.authSession) return;
  const cloudStudentIds = Object.values(state.cloudStudents).filter(Boolean);
  if (!cloudStudentIds.length) return;

  try {
    const data = await supabaseRequest(
      `skill_mastery?${new URLSearchParams({
        select: "student_id,subject_id,skill,mastery,attempts,correct_count,review_count,accuracy,average_time,status,last_practiced_at",
        student_id: `in.(${cloudStudentIds.join(",")})`,
        order: "updated_at.desc",
      }).toString()}`,
      { headers: { Prefer: "" } }
    );

    for (const row of data || []) {
      const localItem = await cloudSkillMasteryToLocal(row);
      if (!localItem) continue;
      state.skillMastery[skillMasteryKey(localItem.studentId, localItem.subject, localItem.skill)] = localItem;
    }
    saveData();
  } catch (error) {
    console.warn("Skill mastery cloud load skipped.", error);
  }
}

function cloudPracticeSessionPayload(session, cloudSubjectId) {
  return {
    local_session_id: session.id,
    student_id: state.cloudStudents[session.studentId],
    subject_id: cloudSubjectId,
    skill: session.skill || "",
    started_at: session.startedAt || new Date().toISOString(),
    ended_at: session.endedAt || null,
    questions_answered: session.questionsAnswered || 0,
    correct_count: session.correctCount || 0,
    hints_used: session.hintsUsed || 0,
    difficulty_start: session.difficultyStart || 0,
    difficulty_end: session.difficultyEnd || 0,
    slow_count: session.slowCount || 0,
    guessing_count: session.guessingCount || 0,
    updated_by: state.authProfile?.id || state.authSession?.user?.id || null,
  };
}

async function savePracticeSessionToCloud(session) {
  if (!state.authSession || !session?.id) return;
  const cloudStudentId = state.cloudStudents[session.studentId];
  if (!cloudStudentId) return;
  const cloudSubjectId = await findCloudSubjectId(session.subject);
  if (!cloudSubjectId) return;

  await supabaseRequest("practice_sessions?on_conflict=student_id,local_session_id", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(cloudPracticeSessionPayload(session, cloudSubjectId)),
  });
}

async function syncPracticeSessionsToCloud() {
  if (!state.authSession) return;
  const pending = state.practiceSessions.filter((session) => state.cloudStudents[session.studentId]);
  for (const session of pending) {
    try {
      await savePracticeSessionToCloud(session);
    } catch (error) {
      console.warn("Practice session cloud sync skipped.", error);
      return;
    }
  }
}

async function cloudPracticeSessionToLocal(row) {
  const localStudentId = Object.keys(state.cloudStudents).find((key) => state.cloudStudents[key] === row.student_id);
  const localSubject = await findLocalSubjectByCloudId(row.subject_id);
  if (!localStudentId || !localSubject || !row.local_session_id) return null;

  return {
    id: row.local_session_id,
    studentId: localStudentId,
    subject: localSubject.id,
    skill: row.skill || "",
    startedAt: row.started_at || "",
    endedAt: row.ended_at || "",
    questionsAnswered: row.questions_answered || 0,
    correctCount: row.correct_count || 0,
    hintsUsed: row.hints_used || 0,
    difficultyStart: row.difficulty_start || 0,
    difficultyEnd: row.difficulty_end || 0,
    slowCount: row.slow_count || 0,
    guessingCount: row.guessing_count || 0,
    events: [],
  };
}

async function loadPracticeSessionsFromCloud() {
  if (!state.authSession) return;
  const cloudStudentIds = Object.values(state.cloudStudents).filter(Boolean);
  if (!cloudStudentIds.length) return;

  try {
    const data = await supabaseRequest(
      `practice_sessions?${new URLSearchParams({
        select: "local_session_id,student_id,subject_id,skill,started_at,ended_at,questions_answered,correct_count,hints_used,difficulty_start,difficulty_end,slow_count,guessing_count",
        student_id: `in.(${cloudStudentIds.join(",")})`,
        order: "started_at.desc",
      }).toString()}`,
      { headers: { Prefer: "" } }
    );

    const merged = new Map(state.practiceSessions.map((session) => [session.id, session]));
    for (const row of data || []) {
      const localSession = await cloudPracticeSessionToLocal(row);
      if (!localSession) continue;
      merged.set(localSession.id, { ...(merged.get(localSession.id) || {}), ...localSession });
    }
    state.practiceSessions = Array.from(merged.values()).slice(0, 80);
    saveData();
  } catch (error) {
    console.warn("Practice session cloud load skipped.", error);
  }
}

async function checkCloudTable(path) {
  if (!state.authSession) return { ready: false, note: "登录后检查" };
  try {
    await supabaseRequest(`${path}?${new URLSearchParams({ select: "id", limit: "1" }).toString()}`, { headers: { Prefer: "" } });
    return { ready: true, note: "已可用" };
  } catch {
    return { ready: false, note: "需要在 Supabase 运行对应 SQL" };
  }
}

async function loadSystemStatus() {
  try {
    const response = await fetch("/api/system-status");
    if (!response.ok) throw new Error("System status unavailable");
    return response.json();
  } catch {
    return {
      emailConfigured: false,
      digestEmailFromConfigured: false,
      requiredSupabaseScripts: ["000_run_all_learning_platform.sql"],
    };
  }
}

async function callLearningApi(path, payload = {}) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Learning API failed: ${path}`);
  return response.json();
}

function setAnswerSyncStatus(syncState, text) {
  state.answerSyncStatus = { state: syncState, text };
  const pill = $("answerSyncStatus");
  if (!pill) return;
  pill.textContent = text;
  pill.classList.toggle("pending", syncState === "pending");
  pill.classList.toggle("error", syncState === "error");
}

async function syncAnswerSubmitToApi(question, selectedIndex, confidence, practiceEvent = {}) {
  const selectedLabel = String.fromCharCode(65 + selectedIndex);
  setAnswerSyncStatus("pending", "正在保存记录");
  try {
    const result = await callLearningApi("/api/answer/submit", {
      studentId: state.studentId,
      question: {
        id: question.id || question.prompt,
        subject: subjectLabelById(state.subject),
        skill: question.skill || question.knowledgePoint || question.topic || "",
        correctAnswer: String.fromCharCode(65 + question.correct),
        hintSteps: question.coachHints || question.hints || [],
      },
      studentAnswer: selectedLabel,
      confidence,
      timeSpentSeconds: practiceEvent.seconds || 0,
    });
    setAnswerSyncStatus("ready", result?.mistakeNotebookEntry ? "错题已记录" : "记录已保存");
  } catch (error) {
    console.warn("Learning API answer sync skipped.", error);
    setAnswerSyncStatus("error", "本地已保存");
  }
}

async function loadAuthProfile() {
  if (!state.authSession?.user?.id) return;
  await supabaseRpc("ensure_my_profile");
  const profiles = await supabaseRequest(
    `user_profiles?${new URLSearchParams({
      select: "id,display_name,role,student_id",
      id: `eq.${state.authSession.user.id}`,
      limit: "1",
    }).toString()}`,
    { headers: { Prefer: "" } }
  );
  const data = profiles?.[0];
  if (!data) throw new Error("No profile found for current user.");

  applyProfileToLocalState(data, { persist: false });
  loadSavedData(accountDataStorageKey(), { resetLearning: true });
  applyProfileToLocalState(data, { persist: false });
  if (data.role === "parent") {
    await supabaseRpc("ensure_family_links");
  }
  await loadFamilyStudentsFromCloud();
  await loadPlanSettingsFromCloud();
  await syncMistakeLogToCloud();
  await loadMistakesFromCloud();
  await syncSkillMasteryToCloud();
  await loadSkillMasteryFromCloud();
  await syncPracticeSessionsToCloud();
  await loadPracticeSessionsFromCloud();
  applyProfileToLocalState(data, { persist: false });
  saveData(accountDataStorageKey());
  setAuthStatus(`已登录：${currentAuthUserLabel()}`);
  renderAll();
  switchView(data.role === "parent" ? "parent" : "today");
  loadCloudQuestions();
}

async function initAuth() {
  if (supabaseClient) {
    const { data } = await supabaseClient.auth.getSession();
    persistAuthSession(data.session || null);
  } else {
    persistAuthSession(loadPersistedAuthSession());
  }

  if (state.authSession) {
    try {
      await loadAuthProfile();
    } catch (error) {
      console.error(error);
      setAuthStatus("已登录，但读取账号资料失败。");
    }
  } else {
    setAuthStatus("");
    renderAuthGate();
  }

  if (!supabaseClient) return;
  supabaseClient.auth.onAuthStateChange(async (_event, session) => {
    persistAuthSession(session);
    if (!session) {
      state.authProfile = null;
      state.cloudStudents = {};
      if (_event === "SIGNED_OUT") setAuthStatus("已退出登录。");
      clearAuthForms();
      renderAll();
      renderAuthGate();
      return;
    }
    try {
      await loadAuthProfile();
    } catch (error) {
      console.error(error);
      setAuthStatus("登录成功，但读取账号资料失败。");
    }
  });
}

async function signInWithPassword() {
  const email = $("authEmail").value.trim();
  const password = $("authPassword").value;
  if (!email || !password) {
    setAuthStatus("请先输入邮箱和密码。");
    return;
  }
  setAuthStatus("正在登录...");
  try {
    if (supabaseClient) {
      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) throw error;
      persistAuthSession(data.session || null);
    } else {
      const data = await authRequest("token?grant_type=password", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      persistAuthSession(data);
    }
    setAuthStatus("登录成功，正在读取学习资料...");
    await loadAuthProfile();
  } catch (error) {
    console.error(error);
    setAuthStatus(`登录失败：${error.message}`);
  }
}

async function signUp() {
  const email = $("signupEmail").value.trim();
  const password = $("signupPassword").value;
  if (!email || !password) {
    setAuthStatus("请先在注册区输入邮箱和密码。");
    return;
  }

  setAuthStatus("正在注册...");
  const profile = signupProfileForCurrentForm(email);
  try {
    let data;
    if (supabaseClient) {
      const result = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: profile.role,
            display_name: profile.displayName,
            student_name: profile.studentName,
          },
        },
      });
      if (result.error) throw result.error;
      data = result.data;
      persistAuthSession(data.session || null);
    } else {
      data = await authRequest("signup", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          data: {
            role: profile.role,
            display_name: profile.displayName,
            student_name: profile.studentName,
          },
        }),
      });
      persistAuthSession(data?.access_token ? data : data?.session || null);
    }
    if (!state.authSession) {
      setAuthStatus("注册已提交。若 Supabase 要求邮件验证，请先打开邮箱确认。");
      return;
    }
    setAuthStatus("注册成功，正在读取学习资料...");
    await loadAuthProfile();
  } catch (error) {
    console.error(error);
    setAuthStatus(`注册失败：${error.message}`);
  }
}

async function signOut() {
  try {
    if (supabaseClient) {
      await supabaseClient.auth.signOut();
    } else if (state.authSession?.access_token) {
      await authRequest("logout", { method: "POST" });
    }
  } catch (error) {
    console.warn(error);
  }
  persistAuthSession(null);
  state.authProfile = null;
  state.cloudStudents = {};
  setAuthStatus("已退出登录。");
  clearAuthForms();
  renderAll();
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

function activeAccount() {
  return accounts.find((account) => account.id === state.accountId) || accounts[0];
}

function subjectById(subjectId) {
  return Object.values(subjects).flat().find((subject) => subject.id === subjectId);
}

function subjectLabelById(subjectId) {
  return subjectById(subjectId)?.label || activeSubject()?.label || "Learning";
}

function defaultSubjectForStudent(studentId) {
  const student = students.find((item) => item.id === studentId) || students[0];
  return subjects[student.grade][0].id;
}

function planForStudent(studentId) {
  const fallbackSubject = defaultSubjectForStudent(studentId);
  return {
    minutes: 30,
    questionTarget: 8,
    difficultyMode: "adaptive",
    focusSubject: fallbackSubject,
    ...(state.planSettings[studentId] || {}),
  };
}

function difficultyModeLabel(mode = "adaptive") {
  if (mode === "steady") return "稳扎稳打";
  if (mode === "challenge") return "挑战拔高";
  return "自动调整";
}

function applyDifficultyMode(studentId, subjectId) {
  const plan = planForStudent(studentId);
  if (plan.difficultyMode === "steady") {
    state.adaptiveLevels[subjectId] = Math.min(adaptiveLevelForSubject(subjectId), 1);
  }
  if (plan.difficultyMode === "adaptive") {
    state.adaptiveLevels[subjectId] = Math.max(adaptiveLevelForSubject(subjectId), 2);
  }
  if (plan.difficultyMode === "challenge") {
    state.adaptiveLevels[subjectId] = Math.max(adaptiveLevelForSubject(subjectId), 3);
  }
}

function todayRecordForStudent(studentName) {
  const today = new Date().toLocaleDateString("zh-CN");
  return state.records.find((record) => record.student === studentName && record.date?.includes(today));
}

function mistakeKey(studentId, subjectId, question) {
  return [studentId, subjectId, question?.prompt || ""].join("::");
}

function mistakesForStudent(studentId = state.studentId) {
  return state.mistakeLog
    .filter((item) => item.studentId === studentId && !item.resolved)
    .sort((a, b) => (b.attempts || 1) - (a.attempts || 1));
}

function recordMistake(question, selectedIndex, reason = "答错") {
  if (!question) return;
  const key = mistakeKey(state.studentId, state.subject, question);
  const existing = state.mistakeLog.find((item) => item.key === key);
  const selectedAnswer = Number.isInteger(selectedIndex) ? question.answers[selectedIndex] : "未作答";
  const now = new Date().toLocaleString("zh-CN", { dateStyle: "medium", timeStyle: "short" });
  const nowIso = new Date().toISOString();

  if (existing) {
    existing.attempts = (existing.attempts || 1) + 1;
    existing.lastMissedAt = now;
    existing.lastMissedIso = nowIso;
    existing.selectedAnswer = selectedAnswer;
    existing.reason = reason;
    existing.resolved = false;
    updateSkillMastery(question, { correct: false });
    saveMistakeToCloud(existing).catch((error) => console.error(error));
    return;
  }

  const mistake = {
    key,
    studentId: state.studentId,
    studentName: activeStudent().name,
    grade: state.grade,
    subjectId: state.subject,
    subjectLabel: activeSubject().label,
    prompt: question.prompt,
    skill: question.skill || activeDiagnostic().skills[0][0],
    difficulty: question.difficulty || "中等",
    selectedAnswer,
    correctAnswer: question.answers[question.correct],
    reason,
    attempts: 1,
    lastMissedAt: now,
    lastMissedIso: nowIso,
    resolved: false,
  };
  state.mistakeLog.unshift(mistake);
  state.mistakeLog = state.mistakeLog.slice(0, 40);
  updateSkillMastery(question, { correct: false });
  saveMistakeToCloud(mistake).catch((error) => console.error(error));
}

function markMistakeReviewed(question) {
  if (!question) return;
  const key = mistakeKey(state.studentId, state.subject, question);
  const existing = state.mistakeLog.find((item) => item.key === key);
  if (existing) {
    existing.resolved = true;
    existing.reviewedAt = new Date().toLocaleString("zh-CN", { dateStyle: "medium", timeStyle: "short" });
    existing.reviewedIso = new Date().toISOString();
    existing.reviewCount = (existing.reviewCount || 0) + 1;
    updateSkillMastery(question, { reviewed: true });
    saveMistakeToCloud(existing).catch((error) => console.error(error));
  }
}

function skillMasteryKey(studentId = state.studentId, subjectId = state.subject, skill = "") {
  return [studentId, subjectId, skill].join("::");
}

function skillMasteryStatus(mastery = 0, accuracy = 0, attempts = 0) {
  if (!attempts) return "not_started";
  if (mastery >= 82 && accuracy >= 75) return "mastered";
  if (mastery < 55 || accuracy < 55) return "needs_review";
  return "learning";
}

function updateSkillMastery(question, outcome = {}) {
  if (!question) return null;
  const skill = question.skill || activeDiagnostic().skills[0][0];
  const key = skillMasteryKey(state.studentId, state.subject, skill);
  const current = state.skillMastery[key] || {
    studentId: state.studentId,
    subject: state.subject,
    skill,
    mastery: 45,
    attempts: 0,
    correctCount: 0,
    reviewCount: 0,
    averageTime: 0,
    status: "not_started",
  };
  const delta = outcome.reviewed ? 10 : outcome.guided ? 8 : outcome.correct ? 6 : -10;
  const attempts = current.attempts + 1;
  const correctCount = current.correctCount + (outcome.correct || outcome.guided || outcome.reviewed ? 1 : 0);
  const reviewCount = current.reviewCount + (outcome.reviewed ? 1 : 0);
  const mastery = Math.max(5, Math.min(100, current.mastery + delta));
  const accuracy = Math.round((correctCount / attempts) * 100);
  state.skillMastery[key] = {
    ...current,
    mastery,
    attempts,
    correctCount,
    reviewCount,
    accuracy,
    averageTime: outcome.seconds || current.averageTime || 0,
    lastPracticedAt: new Date().toISOString(),
    status: skillMasteryStatus(mastery, accuracy, attempts),
  };
  saveSkillMasteryToCloud(state.skillMastery[key]).catch((error) => console.warn("Skill mastery cloud save skipped.", error));
  return state.skillMastery[key];
}

function masteryForSkill(subjectId = state.subject, skill = "") {
  return state.skillMastery[skillMasteryKey(state.studentId, subjectId, skill)];
}

function weakSkillMasteryItems(studentId = state.studentId) {
  return Object.values(state.skillMastery)
    .filter((item) => item.studentId === studentId && item.status === "needs_review")
    .sort((a, b) => a.mastery - b.mastery || b.attempts - a.attempts)
    .slice(0, 5);
}

function questionProgressKey(index = state.currentQuestion) {
  return [state.studentId, state.subject, index].join("::");
}

function questionStableKey(question = {}, subjectId = state.subject) {
  return [state.studentId, subjectId, question.skill || "", question.prompt || ""]
    .join("::")
    .replace(/\s+/g, " ")
    .trim();
}

function answeredQuestionBucket(subjectId = state.subject) {
  const bucketKey = `${state.studentId}::${subjectId}`;
  state.answeredQuestionKeys[bucketKey] = state.answeredQuestionKeys[bucketKey] || {};
  return state.answeredQuestionKeys[bucketKey];
}

function markQuestionAnswered(question, subjectId = state.subject) {
  const key = questionStableKey(question, subjectId);
  if (!key) return;
  answeredQuestionBucket(subjectId)[key] = true;
}

function hasAnsweredQuestion(question, subjectId = state.subject) {
  return Boolean(answeredQuestionBucket(subjectId)[questionStableKey(question, subjectId)]);
}

function isReasonStrong(reason = "") {
  const text = String(reason).trim().toLowerCase();
  if (text.length < 14) return false;
  if (/猜|随便|不知道|不会|不确定|guess|idk|not sure/.test(text)) return false;
  return /因为|所以|题目|关键词|证据|先|therefore|because|means|evidence|ask|first|so/.test(text);
}

function hasActiveGuidanceLock(index = state.currentQuestion) {
  return Boolean(state.guidanceLock && !state.guidanceLock.complete && state.guidanceLock.questionIndex === index);
}

function nextAdaptiveQuestionIndex(questions = activeQuestions(), answeredIndex = state.currentQuestion, adaptiveResult = {}) {
  const targetLevel = adaptiveResult.level ?? adaptiveLevelForSubject();
  const unanswered = questions
    .map((question, index) => ({ question, index }))
    .filter(({ question, index }) => index !== answeredIndex && state.selectedAnswers[index] === undefined && !hasAnsweredQuestion(question));
  if (!unanswered.length) return -1;

  const highPerformance = adaptiveResult.isCorrect && (adaptiveResult.fastCorrect || adaptiveResult.raisedLevel || adaptiveResult.challengeMode || targetLevel >= 2);
  const challengeQueue = state.adaptiveStats[state.subject]?.challengeQueue || [];
  const missionCandidate = challengeMissionPreferredQuestion(unanswered, challengeQueue, targetLevel);
  const explanationChallengeCandidate = unanswered
    .filter(({ question }) => isExplanationFirstChallenge(question))
    .sort(
      (a, b) =>
        questionExamDepthScore(b.question) - questionExamDepthScore(a.question)
        || questionLearningDepthScore(b.question) - questionLearningDepthScore(a.question)
        || difficultyScore(b.question.difficulty) - difficultyScore(a.question.difficulty)
    )[0];
  const challengeCandidate = unanswered
    .filter(({ question }) => difficultyScore(question.difficulty) >= Math.max(2, targetLevel - 1) || question.schoolExamDepth || question.constructedResponse || question.openResponse)
    .sort(
      (a, b) =>
        questionLearningDepthScore(b.question) - questionLearningDepthScore(a.question)
        || questionExamDepthScore(b.question) - questionExamDepthScore(a.question)
        || Math.abs(difficultyScore(a.question.difficulty) - targetLevel) - Math.abs(difficultyScore(b.question.difficulty) - targetLevel)
    )[0];
  const supportCandidate = unanswered
    .filter(({ question }) => difficultyScore(question.difficulty) <= Math.max(1, targetLevel))
    .sort((a, b) => difficultyScore(a.question.difficulty) - difficultyScore(b.question.difficulty))[0];

  if (adaptiveResult.challengeMode && missionCandidate) return missionCandidate.index;
  if (highPerformance && explanationChallengeCandidate) return explanationChallengeCandidate.index;
  if (adaptiveResult.isCorrect && targetLevel >= 2 && challengeCandidate) return challengeCandidate.index;
  if (adaptiveResult.isCorrect === false && supportCandidate) return supportCandidate.index;
  return unanswered.find(({ index }) => index > answeredIndex)?.index ?? unanswered[0].index;
}

function challengeMissionPreferredQuestion(unanswered = [], challengeQueue = [], targetLevel = adaptiveLevelForSubject()) {
  const queueHead = challengeQueue[0] || {};
  const ranked = [...unanswered].sort(
    (a, b) =>
      questionExamDepthScore(b.question) - questionExamDepthScore(a.question)
      || questionLearningDepthScore(b.question) - questionLearningDepthScore(a.question)
      || difficultyScore(b.question.difficulty) - difficultyScore(a.question.difficulty)
      || Math.abs(difficultyScore(a.question.difficulty) - targetLevel) - Math.abs(difficultyScore(b.question.difficulty) - targetLevel)
  );
  if (queueHead.label === "解释型题") {
    return ranked.find(({ question }) => question.openResponse || question.constructedResponse || question.errorAnalysis || question.multiStepReasoning);
  }
  if (queueHead.label === "学校考试深度题") {
    return ranked.find(({ question }) => question.schoolExamDepth);
  }
  if (queueHead.label === "同技能变式题") {
    const currentSkill = activeQuestions()[state.currentQuestion]?.skill || "";
    return ranked.find(({ question }) => question.skill === currentSkill && isDepthPracticeQuestion(question));
  }
  return ranked.find(({ question }) => isExplanationFirstChallenge(question));
}

function questionCompletesChallengeMission(question = {}, mission = {}, subjectId = state.subject) {
  if (!mission?.label) return false;
  if (mission.label === "解释型题") {
    return Boolean(question.openResponse || question.constructedResponse || question.errorAnalysis || question.multiStepReasoning);
  }
  if (mission.label === "学校考试深度题") {
    return Boolean(question.schoolExamDepth);
  }
  if (mission.label === "同技能变式题") {
    const previousSkill = state.adaptiveStats[subjectId]?.challengeSkill || "";
    return Boolean(question.skill && question.skill === previousSkill && isDepthPracticeQuestion(question));
  }
  return false;
}

function challengeMissionCompletionNotice(completedMission = {}, remainingQueue = []) {
  if (!completedMission?.label) return "";
  if (!remainingQueue.length) {
    return `挑战任务完成：${completedMission.label}。挑战三步已完成，可以生成学习总结，或继续选择更高难度。`;
  }
  return `挑战任务完成：${completedMission.label}。下一步挑战：${remainingQueue[0].label}。`;
}

function recordChallengeProof(question = {}, completedMission = {}, outcome = "correct", subjectId = state.subject) {
  const student = activeStudent();
  const proof = {
    id: `${state.studentId}-${subjectId}-${Date.now()}-${completedMission.label || "challenge"}`,
    studentId: state.studentId,
    studentName: student.name,
    subjectId,
    subject: subjectById(subjectId)?.label || subjectId,
    skill: question.skill || activeDiagnostic().skills[0][0],
    difficulty: question.difficulty || difficultyLevels[adaptiveLevelForSubject(subjectId)],
    mission: completedMission.label || "挑战任务",
    outcome,
    questionKey: mistakeKey(state.studentId, subjectId, question),
    completedAt: new Date().toISOString(),
  };
  state.challengeProofs = [proof, ...(state.challengeProofs || []).filter((item) => item.questionKey !== proof.questionKey || item.mission !== proof.mission)].slice(0, 80);
  return proof;
}

function challengeProofSummary(studentId = state.studentId) {
  const proofs = (state.challengeProofs || []).filter((proof) => proof.studentId === studentId);
  const recent = proofs.slice(0, 5);
  const schoolDepth = proofs.filter((proof) => proof.mission === "学校考试深度题").length;
  const explanation = proofs.filter((proof) => proof.mission === "解释型题").length;
  return {
    total: proofs.length,
    schoolDepth,
    explanation,
    recent,
  };
}

function completeChallengeMissionForQuestion(question = {}, outcome = "correct", subjectId = state.subject) {
  if (!["correct", "guided"].includes(outcome)) return false;
  const stats = state.adaptiveStats[subjectId] || {};
  const queue = stats.challengeQueue || [];
  if (!queue.length || !questionCompletesChallengeMission(question, queue[0], subjectId)) return false;
  const completedMission = queue[0];
  const remainingQueue = queue.slice(1);
  recordChallengeProof(question, completedMission, outcome, subjectId);
  state.adaptiveStats[subjectId] = {
    ...stats,
    challengeQueue: remainingQueue,
    challengeBoostRemaining: remainingQueue.length,
  };
  state.lastChallengeMissionNotice = challengeMissionCompletionNotice(completedMission, remainingQueue);
  return true;
}

function advanceToNextQuestionAfterCompletion(answeredIndex = state.currentQuestion, mode = "correct", preferredIndex = -1) {
  const questions = activeQuestions();
  if (!questions.length) return false;
  const canUsePreferred =
    Number.isInteger(preferredIndex)
    && preferredIndex >= 0
    && preferredIndex < questions.length
    && preferredIndex !== answeredIndex
    && state.selectedAnswers[preferredIndex] === undefined;
  if (answeredIndex >= questions.length - 1) {
    if (canUsePreferred) {
      state.currentQuestion = preferredIndex;
      state.lastAdvanceNotice =
        state.lastChallengeMissionNotice ||
        (mode === "guided"
          ? `引导完成，已为你切到更合适的第 ${state.currentQuestion + 1} 题。`
          : `上一题答对了，已为你切到更合适的第 ${state.currentQuestion + 1} 题。`);
      state.lastChallengeMissionNotice = "";
      return true;
    }
    state.currentQuestion = questions.length - 1;
    state.lastAdvanceNotice =
      state.lastChallengeMissionNotice ||
      (mode === "guided"
        ? "引导完成，这是本轮最后一题，可以生成学习总结。"
        : "这题答对了，这是本轮最后一题，可以生成学习总结。");
    state.lastChallengeMissionNotice = "";
    return false;
  }
  state.currentQuestion = canUsePreferred ? preferredIndex : Math.min(questions.length - 1, answeredIndex + 1);
  state.lastAdvanceNotice = state.lastChallengeMissionNotice ||
    (mode === "guided"
      ? `引导完成，已进入第 ${state.currentQuestion + 1} 题。`
      : canUsePreferred
        ? `上一题答对了，系统已切到更合适的第 ${state.currentQuestion + 1} 题。`
        : `上一题答对了，已进入第 ${state.currentQuestion + 1} 题。`);
  state.lastChallengeMissionNotice = "";
  return true;
}

function buildVariantQuestion(question) {
  const skill = question?.skill || activeDiagnostic().skills[0][0];
  const method = question?.explanation || question?.coachHints?.[0] || "先找题干关键词，再判断哪个选项直接回答问题。";
  const hints = question?.coachHints || [];
  return {
    prompt: `变式验证：请不用选项，用自己的话写出这类 ${skill} 题的解题方法。`,
    expectedMethod: method,
    keywords: [skill, method, ...hints]
      .join(" ")
      .split(/[\s，。,.、：:；;]+/)
      .filter((word) => word.length >= 2)
      .slice(0, 8),
  };
}

function variantSkillPracticeGuideFor(skill = "") {
  const normalized = String(skill).toLowerCase();
  if (/斜率|变化率|slope|rate|比例|函数|linear|unit/.test(normalized)) {
    return {
      focus: "看数量关系：先找 x 的变化和 y 的变化，或找固定单位率。",
      firstStep: "写出第一步：先标出两个量分别怎样变化，再决定要比较哪两个变化。",
      why: "说明为什么：这样能判断关系是否稳定，而不是只看数字大小。",
    };
  }
  if (/方程|equation|逆运算|代数|expression|文字转符号/.test(normalized)) {
    return {
      focus: "看变量结构：先找变量周围最外层操作。",
      firstStep: "写出第一步：先说变量被加、减、乘、除中的哪一种操作影响。",
      why: "说明为什么：找到外层操作后，才能选择对应的逆运算或表达式结构。",
    };
  }
  if (/证据|中心|主张|观点|claim|evidence|theme|作者|文本|rla|english/.test(normalized)) {
    return {
      focus: "看阅读目标：先找题干要证明的观点或要解释的中心意思。",
      firstStep: "写出第一步：先回到文本找能直接支持这个观点的句子或细节。",
      why: "说明为什么：证据必须直接回答题目，不能只靠感觉或选项长度。",
    };
  }
  if (/变量|实验|experiment|variable|control|数据|science/.test(normalized)) {
    return {
      focus: "看实验结构：先分清改变什么、测量什么、保持什么不变。",
      firstStep: "写出第一步：先标出 independent variable、dependent variable 或控制条件。",
      why: "说明为什么：这样才能判断结论是否真的由一个因素造成。",
    };
  }
  if (/全等|证明|几何|角|triangle|geometry|congruent/.test(normalized)) {
    return {
      focus: "看对应关系：先找对应边、对应角和题目已给条件。",
      firstStep: "写出第一步：先标出能配对的边角，再判断能不能支持某个判定。",
      why: "说明为什么：几何证明每一步都要有依据，不能只看图像像不像。",
    };
  }
  if (/细胞|能量|生态|biology|cell|energy|ecosystem/.test(normalized)) {
    return {
      focus: "看系统关系：先找结构、功能、能量或物质在怎样流动。",
      firstStep: "写出第一步：先说清哪个结构或过程在起作用。",
      why: "说明为什么：科学题要把现象和机制连起来，而不是只背一个名词。",
    };
  }
  return {
    focus: "看题目目标：先判断这题真正要你证明、计算或解释什么。",
    firstStep: "写出第一步：先说明你会看什么、找什么，或先做哪一个计算。",
    why: "说明为什么：这一步怎样帮助你排除猜测或找到方法？",
  };
}

function needsSchoolLevelVerification(question, confidence = "sure") {
  const plan = planForStudent(state.studentId);
  const currentStats = state.adaptiveStats[state.subject] || { correctStreak: 0 };
  const lowDifficultyChoice = difficultyScore(question?.difficulty) <= 1 && Array.isArray(question?.answers) && question.answers.length >= 3;
  const ordinaryChoice = Array.isArray(question?.answers) && question.answers.length >= 3;
  const shallowChoice = isShallowChoiceQuestion(question);
  const notAlreadyExplanation = !question?.openResponse && !question?.constructedResponse && !question?.errorAnalysis;
  const fastCorrect = secondsOnCurrentQuestion() <= 20;
  const alreadyTooEasy = currentStats.correctStreak >= 1 || adaptiveLevelForSubject() >= 2;
  const streakTooEasy = currentStats.correctStreak >= 2 && ordinaryChoice;
  return plan.difficultyMode !== "steady" && confidence === "sure" && (lowDifficultyChoice || shallowChoice || streakTooEasy) && notAlreadyExplanation && fastCorrect && alreadyTooEasy;
}

function variantMethodChecklistFor(variant = state.guidanceLock?.variant, question = activeQuestions()[state.currentQuestion]) {
  const skill = question?.skill || activeDiagnostic().skills[0][0];
  const guide = variantSkillPracticeGuideFor(skill);
  return {
    mission: `验证目标：判断题目类型是 ${skill}，用自己的话写出方法，不写答案字母。`,
    steps: [
      `判断题目类型：${guide.focus}`,
      guide.firstStep,
      guide.why,
    ],
    selfCheck: "自查：我的解释是否包含“先做什么”和“为什么这样做”？如果只写答案，需要补方法。",
  };
}

function variantSentenceStartersFor(variant = state.guidanceLock?.variant, question = activeQuestions()[state.currentQuestion]) {
  const skill = question?.skill || activeDiagnostic().skills[0][0];
  return [
    { label: "说题型", text: `这题属于 ${skill}，我先要看 ` },
    { label: "说第一步", text: "第一步我会先 " },
    { label: "说原因", text: "这样做是因为 " },
  ];
}

function applyVariantStarter(text = "") {
  const input = $("variantReply");
  if (!input || !text) return;
  const prefix = input.value.trim() ? "\n" : "";
  input.value = `${input.value}${prefix}${text}`;
  if (state.guidanceLock) {
    state.guidanceLock.variantDraft = input.value;
    state.guidanceLock.variantFeedback = "";
  }
  renderVariantRubricFeedback(input.value, state.guidanceLock?.variant);
  input.focus();
}

function variantNextStepStarterFor(reply = "", variant = state.guidanceLock?.variant, question = activeQuestions()[state.guidanceLock?.questionIndex ?? state.currentQuestion]) {
  const missing = variantRubricItems(reply, variant).find((item) => !item.ready);
  if (!missing) return "";
  const skill = question?.skill || activeDiagnostic().skills[0][0];
  if (missing.label === "题目类型") {
    return `这题考的是 ${skill}，我先要判断 `;
  }
  if (missing.label === "第一步") {
    return "第一步我先看题目中的关键词、条件或关系：";
  }
  if (missing.label === "原因解释") {
    return "这样做是因为 ";
  }
  return "具体来说，我还要把题目里的条件和我的方法连起来说明：";
}

const lessonBlueprints = {
  引用文本证据: {
    concept: "证据必须直接支持你的答案，不能只凭感觉。",
    example: "例子：如果题目问人物紧张，要找动作、语言或心理描写，而不是只说“我觉得”。",
    steps: ["先读清题目要证明什么", "回到文本找一句能证明的细节", "把证据和结论用因为/所以连起来"],
    trap: "不要选看起来很长但没有回答问题的句子。",
    quickCheck: "我能指出哪一句文字证明了我的答案吗？",
  },
  识别中心观点: {
    concept: "中心观点是文章最想让读者明白的主要想法。",
    example: "例子：一段文章列出睡眠、注意力和健康，中心观点可能是“充足睡眠帮助学生学习”。",
    steps: ["先看题目问主张还是细节", "找反复出现的关键词", "判断哪个选项能覆盖整段意思"],
    trap: "不要把某个小例子当成全文中心。",
    quickCheck: "这个答案能不能概括整段，而不是只解释一句话？",
  },
  斜率与变化率: {
    concept: "斜率表示 y 每随着 x 增加 1 而变化多少。",
    example: "例子：点从 (2, 7) 到 (5, 16)，x 增加 3，y 增加 9，所以变化率是 3。",
    steps: ["先找两个点的 x 和 y 变化", "用 y 的变化除以 x 的变化", "检查单位和正负方向"],
    trap: "不要把 x 的变化和 y 的变化写反。",
    quickCheck: "我能说清楚“每增加 1 个 x，y 变多少”吗？",
  },
  方程逆运算: {
    concept: "解方程就是用相反操作把 x 单独留下。",
    example: "例子：3x + 5 = 20，先用减 5 去掉 +5，再用除以 3 去掉乘 3。",
    steps: ["先找离 x 最远的运算", "两边做相同的逆运算", "最后把答案代回去检查"],
    trap: "不要只改一边，方程两边必须保持平衡。",
    quickCheck: "我每一步有没有同时作用在等号两边？",
  },
  变量控制: {
    concept: "可靠实验一次只改变一个关键因素，才能知道结果来自哪里。",
    example: "例子：研究阳光对植物高度的影响，就只改变阳光，水和土壤要保持一致。",
    steps: ["先找学生故意改变的因素", "再找测量的结果", "检查其他条件是否保持不变"],
    trap: "如果两个因素同时改变，就很难判断真正原因。",
    quickCheck: "我能分清 independent variable 和 dependent variable 吗？",
  },
  比例关系: {
    concept: "比例关系不是只看数字变大，而是看两个量是否一直用同一个倍数变化。",
    example: "例子：y = 3x 表示 x 每增加 1，y 都增加 3，图像会经过原点。",
    steps: ["先看是否有固定单位率", "检查图像是否经过原点", "用表格确认每一组 y/x 是否相同"],
    trap: "不要只看到两个数同时增加就判断成比例。",
    quickCheck: "我能说出这个关系的单位率是多少吗？",
  },
  多步文字题: {
    concept: "多步文字题先把故事拆成数量关系，再决定运算顺序。",
    example: "例子：先算折扣金额，再算折后价格，最后再考虑税或总价。",
    steps: ["圈出每个数量和单位", "写出先发生什么、后发生什么", "每算一步都标注这个数代表什么"],
    trap: "不要把题目里的所有数字直接加减乘除。",
    quickCheck: "我每一步算出的数，能不能说出它的意思？",
  },
  证据比较: {
    concept: "比较两篇文章时，要分别找每篇文章的主张和证据，再看它们哪里相同或不同。",
    example: "例子：两篇都谈校车安全，一篇用统计数据，另一篇用学生经历，证据类型不同。",
    steps: ["先写出文章 A 的主张", "再写出文章 B 的主张", "比较证据是否支持同一个方向"],
    trap: "不要只比较文章长短或有没有图片。",
    quickCheck: "我能分别说出两篇文章各自想证明什么吗？",
  },
  实验设计: {
    concept: "实验设计先分清改变什么、测量什么、保持什么不变。",
    example: "例子：测试肥料效果时，只改变肥料，水量、光照、土壤要尽量一样。",
    steps: ["找 independent variable", "找 dependent variable", "列出至少两个 controlled variables"],
    trap: "不要把测量结果误认为学生故意改变的因素。",
    quickCheck: "如果结果改变，我能判断是哪个因素造成的吗？",
  },
  线性方程建模: {
    concept: "线性方程建模要把情境翻译成 y = mx + b：m 是每次变化，b 是起点。",
    example: "例子：会员费 10 美元，每次课 3 美元，总价可以写成 y = 3x + 10。",
    steps: ["先找固定起点", "再找每单位增加多少", "把总量写成起点加变化量"],
    trap: "不要把起点和变化率混在一起。",
    quickCheck: "我的 m 和 b 分别来自题目哪句话？",
  },
  函数图像解释: {
    concept: "函数图像解释要同时看形状、截距和变化趋势。",
    example: "例子：直线向上表示 y 随 x 增加；y 轴截距表示 x = 0 时的起始值。",
    steps: ["先看图像是上升还是下降", "找到截距或关键点", "用一句话解释 x 和 y 的关系"],
    trap: "不要只看某一个点就忽略整体趋势。",
    quickCheck: "我能用现实语言解释这条图像在说什么吗？",
  },
  全等判定: {
    concept: "全等判定要证明两个三角形完全一样：对应边和对应角能匹配。",
    example: "例子：如果两边和夹角相等，可以用 SAS 证明三角形全等。",
    steps: ["先标出对应边角", "判断可用 SSS、SAS、ASA、AAS 哪一种", "写出对应关系和理由"],
    trap: "不要把 SSA 当成普通全等判定。",
    quickCheck: "我用的判定条件是否足够证明两个三角形完全一样？",
  },
  证明书写: {
    concept: "证明书写像搭桥：每一步结论都要有一个理由支撑。",
    example: "例子：已知平行线，可以推出内错角相等，再用于证明三角形全等。",
    steps: ["先列出 given 信息", "每写一个结论就配一个理由", "最后回到要证明的目标"],
    trap: "不要跳步写“显然相等”，要说明依据。",
    quickCheck: "我的每一行证明旁边都有理由吗？",
  },
  细胞结构功能: {
    concept: "细胞结构功能要把结构和工作配对：结构决定它能做什么。",
    example: "例子：线粒体负责细胞呼吸，帮助细胞把食物能量转成可用能量。",
    steps: ["先识别细胞结构", "说出它的主要功能", "解释如果它出问题会影响什么过程"],
    trap: "不要只背名字，要联系功能和结果。",
    quickCheck: "我能说出这个结构帮细胞完成哪项工作吗？",
  },
  能量转化: {
    concept: "能量转化关注能量从哪里来、到哪里去、以什么形式储存或释放。",
    example: "例子：植物把光能转成化学能，动物通过细胞呼吸释放食物中的能量。",
    steps: ["先找能量来源", "追踪能量进入哪个生物或结构", "说明能量如何被使用或传递"],
    trap: "能量不会凭空产生或消失，只会转化或转移。",
    quickCheck: "我能画出能量流动的一条路径吗？",
  },
};

function lessonBlueprintForSkill(skill = "") {
  const direct = lessonBlueprints[skill];
  if (direct) return direct;
  const partialKey = Object.keys(lessonBlueprints).find((key) => skill.includes(key) || key.includes(skill));
  if (partialKey) return lessonBlueprints[partialKey];
  return null;
}

function conceptMiniLesson(question) {
  const skill = question?.skill || activeDiagnostic().skills[0][0];
  const explanation = question?.explanation || "先看题目真正问什么，再用已知条件缩小选项。";
  const firstHint = question?.coachHints?.[0] || "先圈出关键词。";
  const secondHint = question?.coachHints?.[1] || "再判断哪个选项直接回答问题。";
  const blueprint = lessonBlueprintForSkill(skill);
  const layeredHints = [
    question?.aiHintLevel1,
    question?.aiHintLevel2,
    question?.aiHintLevel3,
    ...(question?.coachHints || []),
  ].filter(Boolean);
  const commonMistake = question?.commonMistakes?.[0] || blueprint?.trap || "不要只看选项长度或熟悉程度，要回到题目要求。";
  return {
    concept: `今天先练：${skill}`,
    example: blueprint?.example || `例题思路：${explanation}`,
    method: `方法句：${firstHint} ${secondHint}`,
    steps: layeredHints.length >= 3 ? layeredHints.slice(0, 3) : blueprint?.steps || ["先读题目问什么", "圈出关键词或已知条件", "选择能直接回答问题的思路"],
    trap: commonMistake,
    quickCheck: blueprint?.quickCheck || "我能用一句话说出这题第一步该做什么吗？",
    layeredHints,
    commonMistakes: question?.commonMistakes || [commonMistake],
  };
}

function lessonMasteryStatus(skill, score) {
  const hasMistake = mistakesForStudent().some((item) => item.skill === skill);
  const guidedCount = Object.keys(state.guidedMastery).length;
  const answeredCount = Object.keys(state.selectedAnswers).length;
  if (hasMistake) return "需要复习";
  if (guidedCount > 0 && score >= 55) return "变式通过";
  if (answeredCount >= 3 && score >= 60) return "基础通过";
  if (score >= 70) return "已掌握";
  return "学习中";
}

function shouldStartGuidance(selectedIndex, question, confidence) {
  if (selectedIndex !== question.correct) return "answer";
  if (confidence !== "sure") return "confidence";
  if (needsSchoolLevelVerification(question, confidence)) return "school_verification";
  return "";
}

function guidedMasteryCount(studentId = state.studentId) {
  return Object.values(state.guidedMastery).filter((item) => !studentId || item.studentId === studentId).length;
}

function masteryOutcome(lock, variantReply = "") {
  const issue =
    lock?.issue === "confidence"
      ? "猜对后验证掌握"
      : lock?.issue === "school_verification"
        ? "答对后深度验证掌握"
        : "答错后引导掌握";
  return {
    studentId: state.studentId,
    subjectId: state.subject,
    skill: activeQuestions()[lock?.questionIndex || 0]?.skill || activeDiagnostic().skills[0][0],
    issue,
    variantReply,
    completedAt: new Date().toISOString(),
  };
}

function variantKeywordBank(variant = {}) {
  const raw = [variant.prompt, variant.expectedMethod, ...(variant.keywords || [])].join(" ").toLowerCase();
  const tokens = raw
    .split(/[\s，。,.、：:；;()（）]+/)
    .map((word) => word.trim())
    .filter((word) => word.length >= 2);
  const concepts = [];
  if (/斜率|变化率|slope|rate of change|rise over run|change in y|change in x/.test(raw)) {
    concepts.push("斜率", "变化率", "y 变化", "x 变化", "除以", "相除", "每增加", "rise", "run", "change");
  }
  if (/中心观点|claim|central idea|evidence|证据/.test(raw)) {
    concepts.push("中心观点", "主张", "证据", "支持", "claim", "central", "evidence");
  }
  if (/方程|equation|inverse|逆运算/.test(raw)) {
    concepts.push("方程", "逆运算", "两边", "平衡", "inverse", "equation");
  }
  if (/变量|variable|experiment|实验/.test(raw)) {
    concepts.push("变量", "改变", "测量", "保持不变", "variable", "control");
  }
  return [...new Set([...tokens, ...concepts])];
}

function variantRetryPrompt(variant = {}) {
  const bank = variantKeywordBank(variant).join(" ");
  if (/斜率|变化率|slope|rise|run/.test(bank)) {
    return "还差一点：请补上 x 怎么变、y 怎么变，以及为什么要用 y 的变化除以 x 的变化。";
  }
  return "还差一点：请补上第一步看什么，以及为什么这一步能帮你判断。";
}

function coachingHintForTurn(question, turn = 0) {
  const lesson = conceptMiniLesson(question);
  const hints = lesson.layeredHints?.length ? lesson.layeredHints : lesson.steps || [];
  return hints[Math.min(turn, Math.max(0, hints.length - 1))] || question?.coachHints?.[0] || "先说题目真正问什么。";
}

function commonMistakeForQuestion(question) {
  const lesson = conceptMiniLesson(question);
  return lesson.commonMistakes?.[0] || lesson.trap || "容易错在先猜答案，没有说明第一步。";
}

function isVariantExplanationStrong(reply = "", variant = state.guidanceLock?.variant) {
  const text = String(reply).trim().toLowerCase();
  if (text.length < 18) return false;
  if (/猜|随便|不知道|不会|不确定|答案是|选[a-d]|choose|guess|idk/.test(text)) return false;
  const methodWords = ["先", "因为", "所以", "题目", "关键词", "证据", "方法", "第一步", "看", "判断", "条件", "关系", "变化", "除以", "because", "first", "evidence", "method"];
  const hasMethodLanguage = methodWords.some((word) => text.includes(word.toLowerCase()));
  const keywordHits = variantKeywordBank(variant).filter((word) => text.includes(String(word).toLowerCase())).length;
  return hasMethodLanguage && keywordHits >= 1;
}

function hasMeaningfulVariantCompletion(reply = "") {
  const raw = String(reply).trim();
  if (/我先要(看|判断)\s*$|第一步(我会先|我先看题目中的关键词、条件或关系[:：]?)\s*$|这样做是因为\s*$|具体来说，我还要把题目里的条件和我的方法连起来说明[:：]?\s*$/.test(raw)) {
    return false;
  }
  const starterOnlyPattern = /这题属于|这题考的是|我先要看|我先要判断|第一步我会先|第一步我先看题目中的关键词、条件或关系|这样做是因为|这一步能帮我判断方法，而不是直接猜选项|具体来说，我还要把题目里的条件和我的方法连起来说明/g;
  const remaining = raw
    .replace(starterOnlyPattern, "")
    .replace(/[。；;，,\s_\-—]+/g, "")
    .trim();
  return remaining.length >= 8;
}

function variantRubricItems(reply = "", variant = state.guidanceLock?.variant) {
  const text = String(reply).trim().toLowerCase();
  const keywordHits = variantKeywordBank(variant).filter((word) => text.includes(String(word).toLowerCase())).length;
  const typeReady = keywordHits >= 1 && !/答案是|选[a-d]|choose/.test(text);
  const firstStepReady = /先|第一步|看|找|用|比较|变化|证据|条件|first|compare|change|evidence/.test(text);
  const reasonReady = /因为|所以|为什么|说明|证明|原因|because|so that|why/.test(text);
  return [
    { label: "题目类型", ready: typeReady, next: "先说这题在考哪个知识点" },
    { label: "第一步", ready: firstStepReady, next: "写清第一步要看什么或怎么算" },
    { label: "原因解释", ready: reasonReady, next: "补上为什么这一步能帮助判断" },
    { label: "具体内容", ready: hasMeaningfulVariantCompletion(reply), next: "把句式后面的内容补完整" },
  ];
}

function buildVariantRubricFeedback(reply = "", variant = state.guidanceLock?.variant) {
  return variantRubricItems(reply, variant)
    .map((item) => `${item.ready ? "已做到" : "还要补"}：${item.label}${item.ready ? "" : `。${item.next}`}`)
    .join("；");
}

function isVariantRubricReady(reply = "", variant = state.guidanceLock?.variant) {
  return variantRubricItems(reply, variant).every((item) => item.ready);
}

function variantNextActionText(reply = "", variant = state.guidanceLock?.variant) {
  if (!String(reply).trim()) return "先按清单写自己的方法；系统会检查表达是否完整，但不会先给参考答案。";
  const missing = variantRubricItems(reply, variant).find((item) => !item.ready);
  if (!missing) return "说明已经完整，可以提交给 AI 教练检查。";
  return `下一步：${missing.next}。`;
}

function variantTargetedRetryText(reply = "", variant = state.guidanceLock?.variant, evaluation = {}) {
  const missing = variantRubricItems(reply, variant).find((item) => !item.ready);
  if (missing) return `先别重写全部，只补这一处：${missing.next}。`;
  const coachNote = evaluation.reply || evaluation.nextPrompt || "";
  const specificPush = "你的结构已经够了，现在要更像学校考试答案：点出题目里的具体关键词或条件，再说明它们为什么支持你的方法。";
  return coachNote ? `${coachNote} ${specificPush}` : specificPush;
}

function renderVariantRubricFeedback(reply = $("variantReply")?.value || "", variant = state.guidanceLock?.variant) {
  const target = $("variantRubricFeedback");
  if (!target) return "";
  const feedback = buildVariantRubricFeedback(reply, variant);
  const ready = isVariantRubricReady(reply, variant);
  $("variantRubricFeedback").innerHTML = variantRubricItems(reply, variant)
    .map(
      (item) =>
        `<span class="rubric-${item.ready ? "met" : "missing"}"><strong>${item.ready ? "已做到" : "还要补"}</strong>${item.label}</span>`
    )
    .join("");
  $("variantFeedback").textContent = variantNextActionText(reply, variant);
  $("variantSubmit").disabled = !ready;
  renderVariantNextHelp(reply, variant);
  renderGuidanceNextAction();
  renderGuidanceUnlockProgress();
  return feedback;
}

function renderVariantNextHelp(reply = $("variantReply")?.value || "", variant = state.guidanceLock?.variant) {
  const help = $("variantNextHelp");
  if (!help) return;
  const ready = isVariantRubricReady(reply, variant);
  const starter = variantNextStepStarterFor(reply, variant);
  help.classList.toggle("hidden", ready);
  $("variantNextHelpText").textContent = ready
    ? "说明已经完整，可以提交给 AI 教练检查。"
    : `${variantNextActionText(reply, variant)} 卡住时点“补下一句”；完全不懂就点“换种讲法”。`;
  $("applyVariantNextStepButton").disabled = ready || !starter;
  $("variantReteachButton").disabled = ready;
}

function variantReteachMessageFor(lock = state.guidanceLock) {
  const question = activeQuestions()[lock?.questionIndex || state.currentQuestion];
  const lesson = conceptMiniLesson(question);
  const skill = question?.skill || activeDiagnostic().skills[0][0];
  const firstStep = lesson.steps?.[0] || "先看题目真正问什么";
  return `我们先退一步。这个知识点是 ${skill}：${lesson.concept} 先记一个方法：${firstStep}。同类小例子：${teachingMiniExampleForSkill(skill)} 现在先不提交变式，你只要补一句：我第一步先____，因为____。`;
}

function requestVariantReteach() {
  if (!hasActiveGuidanceLock()) return;
  const reply = $("variantReply")?.value.trim();
  state.guidanceLock.status = "coaching";
  state.guidanceLock.teachingTurns = (state.guidanceLock.teachingTurns || 0) + 1;
  state.inlineCoachHistory.push({
    role: "student",
    text: reply ? `我在变式题这里卡住了：${reply}` : "我在变式题这里卡住了，想换一种讲法。",
  });
  state.inlineCoachHistory.push({
    role: "coach",
    text: variantReteachMessageFor(state.guidanceLock),
  });
  saveData();
  renderDiagnostic();
  focusGuidancePanel();
}

function guidanceIssueText(issue) {
  if (issue === "answer") return "答案还不对，先回到题干和关键词。";
  if (issue === "confidence") return "你选择了不确定或猜测，我们用一道变式题确认你真的会了。";
  if (issue === "school_verification") return "这题做得很快，系统加一道学校考试式验证：请证明你不是靠选项猜对。";
  return "需要先完成引导。";
}

function guidanceInsightForLock(lock = state.guidanceLock, question = activeQuestions()[state.currentQuestion]) {
  const lesson = conceptMiniLesson(question);
  const skill = question?.skill || activeDiagnostic().skills[0][0];
  const issueType =
    lock?.issue === "confidence"
      ? "可能是猜对，还没证明掌握"
      : lock?.issue === "school_verification"
        ? "题目偏简单，需要升级到解释型验证"
        : "答案不对，方法需要修正";
  const repairAction =
    lock?.issue === "confidence" || lock?.issue === "school_verification"
      ? "不显示正确答案，先说清楚为什么这样做，再完成变式验证。"
      : "不显示正确答案，先说题目真正问什么，再找关键词或已知条件。";
  return {
    issueType,
    skillGap: `${skill}：${lesson.concept.replace(/^今天先练：/, "")}`,
    repairAction: `${repairAction} 常见误区：${commonMistakeForQuestion(question)}`,
  };
}

function guidanceCurrentTaskForLock(lock = state.guidanceLock) {
  if (!lock) {
    return {
      badge: "当前任务",
      title: "先独立作答",
      body: "先自己读题和选择答案；答错或不确定后，系统才会开始引导。",
    };
  }
  if (lock.microDrill) {
    return {
      badge: "第 2 步 / 微练习",
      title: "先完成一个小步骤",
      body: `${lock.microDrill.prompt} 完成这句后，再回到原题做变式验证。`,
    };
  }
  if (lock.status === "variant") {
    return {
      badge: "第 3 步 / 变式验证",
      title: "写方法，不写选项",
      body: "先判断题目类型，再写第一步和原因。卡住时可以补下一句，还是不懂就换种讲法。",
    };
  }
  const hasStudentReply = state.inlineCoachHistory.some((message) => message.role === "student");
  if (hasStudentReply) {
    return {
      badge: "第 2 步 / 复述方法",
      title: "把方法补完整",
      body: "只要写清三件事：题目问什么、第一步看什么、为什么这样做。写完整后才能继续。",
    };
  }
  return {
    badge: "第 1 步 / 先听讲解",
    title: "先听讲解，再只填一个空",
    body: "不用先完整说题意。先看 AI 拆题和小讲解，卡住就点“先讲知识点”或“换个例子”。",
  };
}

function renderGuidanceTask(lock = state.guidanceLock) {
  const task = guidanceCurrentTaskForLock(lock);
  $("guidanceTaskBadge").textContent = task.badge;
  $("guidanceTaskTitle").textContent = task.title;
  $("guidanceTaskBody").textContent = task.body;
}

function guidanceLadderForLock(lock = state.guidanceLock, question = activeQuestions()[lock?.questionIndex ?? state.currentQuestion]) {
  const skill = question?.skill || activeDiagnostic().skills[0][0];
  const firstStep = guidanceStepBuilderSentence("method", lock, question).replace(/^我/, "你");
  return {
    teach: `小讲解：${localStudentFriendlyConceptLine(question)}`,
    example: `小例子：${teachingMiniExampleForSkill(skill)}`,
    tryStep: `你来一步：先不用完整作答，只做这一句：${firstStep}。`,
  };
}

function renderGuidanceLadder(lock = state.guidanceLock) {
  if (!$("guidanceLadderCard") || !lock) return;
  const ladder = guidanceLadderForLock(lock);
  $("guidanceLadderTeach").textContent = ladder.teach;
  $("guidanceLadderExample").textContent = ladder.example;
  $("guidanceLadderTry").textContent = ladder.tryStep;
}

function guidanceUnlockItemsForLock(lock = state.guidanceLock) {
  const reply = $("inlineCoachReply")?.value || "";
  const variantReply = $("variantReply")?.value || "";
  const hasStudentReply = state.inlineCoachHistory.some((message) => message.role === "student");
  const inVariant = lock?.status === "variant";
  const restatementReady = inVariant || evaluateGuidanceReplyQuality(reply).ready;
  const variantReady = inVariant && isVariantRubricReady(variantReply, lock?.variant);
  return [
    {
      label: "听懂错因和方法",
      detail: "已经进入讲解区，先看错因和方法提示。",
      done: Boolean(lock),
      active: Boolean(lock) && !hasStudentReply && !inVariant,
    },
    {
      label: "用自己的话复述方法",
      detail: "写清题目目标、第一步和原因。",
      done: restatementReady,
      active: Boolean(lock) && !inVariant,
    },
    {
      label: "通过一道变式验证",
      detail: "写方法解释，不靠选择题猜答案。",
      done: variantReady,
      active: inVariant,
    },
  ];
}

function renderGuidanceUnlockProgress(lock = state.guidanceLock) {
  const list = $("guidanceUnlockList");
  if (!list || !lock) return;
  list.innerHTML = guidanceUnlockItemsForLock(lock)
    .map(
      (item) => `
        <li class="${item.done ? "done" : item.active ? "active" : ""}">
          <span>${item.done ? "完成" : item.active ? "正在做" : "等待"}</span>
          <strong>${item.label}</strong>
          <small>${item.detail}</small>
        </li>
      `
    )
    .join("");
}

function renderGuidanceInsight(lock = state.guidanceLock) {
  if (!lock) return;
  const question = activeQuestions()[lock.questionIndex] || activeQuestions()[state.currentQuestion];
  const insight = guidanceInsightForLock(lock, question);
  $("guidanceIssueType").textContent = insight.issueType;
  $("guidanceSkillGap").textContent = insight.skillGap;
  $("guidanceRepairAction").textContent = insight.repairAction;
}

function guidanceScaffoldForLock(lock = state.guidanceLock, question = activeQuestions()[state.currentQuestion]) {
  const lesson = conceptMiniLesson(question);
  const hintIndex = Math.min(lock?.teachingTurns || 0, 2);
  const firstHint = coachingHintForTurn(question, hintIndex);
  const reasonFocus =
    lock?.issue === "confidence"
      ? "因为我要证明自己不是猜的，而是知道这个方法为什么能用。"
      : "因为这一步能帮我把题目要求和解题方法连起来。";
  return {
    questionFocus: "题目问什么：先用一句话说出题目要找什么。",
    firstStep: `第一步看什么：${firstHint}`,
    reasonStarter: `为什么这样做：${reasonFocus}`,
  };
}

function guidanceQuestionUnpackForLock(lock = state.guidanceLock, question = activeQuestions()[lock?.questionIndex ?? state.currentQuestion]) {
  const lesson = conceptMiniLesson(question);
  const skill = question?.skill || activeDiagnostic().skills[0][0];
  const firstStep = coachingHintForTurn(question, lock?.teachingTurns || 0) || lesson.steps?.[0] || "题干里的关键词或已知条件";
  const promptPreview = String(question?.prompt || "").replace(/\s+/g, " ").slice(0, 90);
  return `不是让你先猜答案。题目其实在问：我能不能判断 ${skill}。先看这句题干：${promptPreview}。第一眼只找：${firstStep}。`;
}

function renderGuidanceScaffold(lock = state.guidanceLock) {
  if (!lock) return;
  const question = activeQuestions()[lock.questionIndex] || activeQuestions()[state.currentQuestion];
  const scaffold = guidanceScaffoldForLock(lock, question);
  $("questionUnpackText").textContent = guidanceQuestionUnpackForLock(lock, question);
  $("scaffoldQuestionFocus").textContent = scaffold.questionFocus;
  $("scaffoldFirstStep").textContent = scaffold.firstStep;
  $("scaffoldReasonStarter").textContent = scaffold.reasonStarter;
}

function guidanceMicroDrillForLock(lock = state.guidanceLock, question = activeQuestions()[lock?.questionIndex ?? state.currentQuestion]) {
  const skill = question?.skill || activeDiagnostic().skills[0][0];
  if (/斜率|变化率|slope|rate|线性|函数/.test(skill)) {
    return {
      prompt: "微练习：先不看原题选项，只说 x 和 y 哪个在变、为什么要比较变化。",
      starter: "这题要我判断变化关系。我第一步先看 x 和 y 怎么变，因为斜率表示每增加 1 个 x，y 变多少。",
    };
  }
  if (/证据|中心观点|主张|作者|文本|claim|evidence|author|theme/.test(skill)) {
    return {
      prompt: "微练习：先不看选项，只说文章要判断的观点，再说证据要支持什么。",
      starter: "这题要我判断中心观点或主张。我第一步先找中心句和直接证据，因为证据必须支持这个观点。",
    };
  }
  if (/变量|实验|variable|experiment|数据|图表/.test(skill)) {
    return {
      prompt: "微练习：先不看答案，只分清谁被改变、谁被测量、谁要保持不变。",
      starter: "这题要我判断实验关系。我第一步先分清改变的变量和测量的结果，因为结论要由数据支持。",
    };
  }
  return {
    prompt: "微练习：先不看答案，只完成一句方法句：题目要我判断什么，第一步看什么，为什么。",
    starter: guidanceTeacherModelForLock(lock, question),
  };
}

function guidanceMicroChoiceForLock(lock = state.guidanceLock, question = activeQuestions()[lock?.questionIndex ?? state.currentQuestion]) {
  const skill = question?.skill || activeDiagnostic().skills[0][0];
  const firstHint = coachingHintForTurn(question, lock?.teachingTurns || 0) || "题目关键词或已知条件";
  if (/证据|中心观点|主张|作者|文本|claim|evidence|author|theme/.test(skill)) {
    return {
      prompt: "先选一个最小动作：这类阅读题第一步更应该做什么？",
      choices: [
        { label: "找中心观点", sentence: `这题要我判断 ${skill}。我第一步先找中心观点，因为证据必须直接支持它。` },
        { label: "看答案长度", sentence: `这题要我判断 ${skill}。我第一步不能看答案长度，要先回到文本找观点和证据。` },
      ],
    };
  }
  if (/斜率|变化率|slope|rate|线性|函数|比例/.test(skill)) {
    return {
      prompt: "先选一个最小动作：这类数学题第一步更应该看什么？",
      choices: [
        { label: "比较变化", sentence: `这题要我判断 ${skill}。我第一步先比较两个量怎么变，因为变化率要看每单位变化。` },
        { label: "只看最大数", sentence: `这题要我判断 ${skill}。我第一步不能只看最大数，要先比较变化关系。` },
      ],
    };
  }
  if (/变量|实验|variable|experiment|数据|图表|science|biology|细胞|能量/.test(skill)) {
    return {
      prompt: "先选一个最小动作：这类科学题第一步更应该分清什么？",
      choices: [
        { label: "改变和测量", sentence: `这题要我判断 ${skill}。我第一步先分清改变什么和测量什么，因为结论要由数据支持。` },
        { label: "先背名词", sentence: `这题要我判断 ${skill}。我第一步不能只背名词，要先看结构、过程或数据关系。` },
      ],
    };
  }
  return {
    prompt: "先选一个最小动作：你现在第一步要补哪一句？",
    choices: [
      { label: "题目目标", sentence: `这题要我判断 ${skill}。我第一步先看 ${firstHint}，因为这能帮我确定方法。` },
      { label: "方法原因", sentence: `这题要我判断 ${skill}。我第一步先看 ${firstHint}，因为这一步能把题目要求和方法连起来。` },
    ],
  };
}

function renderGuidanceMicroChoice(lock = state.guidanceLock, quality = evaluateGuidanceReplyQuality()) {
  const card = $("replyMicroChoiceCard");
  if (!card || !lock) return;
  const micro = guidanceMicroChoiceForLock(lock);
  card.classList.toggle("hidden", quality.ready);
  $("replyMicroChoicePrompt").textContent = micro.prompt;
  card.querySelectorAll("[data-micro-choice]").forEach((button) => {
    const choice = micro.choices[Number(button.dataset.microChoice)] || micro.choices[0];
    button.textContent = choice.label;
  });
}

function guidanceStepBuilderSentence(part = "goal", lock = state.guidanceLock, question = activeQuestions()[lock?.questionIndex ?? state.currentQuestion]) {
  const skill = question?.skill || activeDiagnostic().skills[0][0];
  const scaffold = guidanceScaffoldForLock(lock, question);
  const firstStep = scaffold.firstStep.replace(/^第一步看什么：/, "") || coachingHintForTurn(question, lock?.teachingTurns || 0) || "题目关键词和已知条件";
  if (part === "method") return `我第一步先看 ${firstStep}`;
  if (part === "reason") return "因为这一步能帮我把题目要求和解题方法连起来";
  return `这题要我判断 ${skill}`;
}

function applyGuidanceStepBuilder(part = "goal", input = $("inlineCoachReply")) {
  if (!hasActiveGuidanceLock() || !input) return;
  const sentence = guidanceStepBuilderSentence(part, state.guidanceLock);
  const parts = state.guidanceLock.stepBuilderParts || {};
  parts[part] = sentence;
  state.guidanceLock.stepBuilderParts = parts;
  input.value = ["goal", "method", "reason"]
    .map((key) => parts[key])
    .filter(Boolean)
    .join("。");
  if (input.value && !/[。.!?？]$/.test(input.value)) input.value += "。";
  state.guidanceLock.replyDraft = input.value;
  state.guidanceLock.microChoiceReady = false;
  renderReplyQuality(input.value);
  const quality = evaluateGuidanceReplyQuality(input.value);
  if (quality.ready) {
    $("inlineCoachSubmit").focus();
  } else {
    input.focus();
  }
}

function applyGuidanceMicroChoice(choiceIndex = 0, input = $("inlineCoachReply")) {
  if (!hasActiveGuidanceLock() || !input) return;
  const micro = guidanceMicroChoiceForLock(state.guidanceLock);
  const choice = micro.choices[Number(choiceIndex)] || micro.choices[0];
  input.value = choice.sentence;
  state.guidanceLock.replyDraft = input.value;
  state.guidanceLock.microChoiceReady = true;
  state.guidanceLock.microChoiceNote = "已帮你写好一个小步骤，可以直接提交给教练检查。";
  renderReplyQuality(input.value);
  $("inlineCoachSubmit").focus();
}

function conceptBridgeChoicesForLock(lock = state.guidanceLock, question = activeQuestions()[lock?.questionIndex ?? state.currentQuestion]) {
  const skill = question?.skill || activeDiagnostic().skills[0][0];
  const firstStep = guidanceStepBuilderSentence("method", lock, question).replace(/[。.!！]$/, "");
  return {
    goal: `这题要我判断 ${skill}。我先不用猜答案。`,
    method: `这题要我判断 ${skill}。${firstStep}，因为这一步能帮我把知识点接回题目。`,
    teach: `我知识点没吃透，请先讲概念，再让我只填一个空。`,
  };
}

function renderConceptBridgeChoices(reply = $("inlineCoachReply")?.value || "", quality = evaluateGuidanceReplyQuality(reply), lock = state.guidanceLock) {
  const card = $("conceptBridgeCard");
  if (!card || !lock) return;
  const showBridge = guidanceCannotProduceThought(reply) || quality.asksForHelp;
  $("conceptBridgeCard").classList.toggle("hidden", !showBridge);
  if (!showBridge) return;
  const choices = conceptBridgeChoicesForLock(lock);
  $("conceptBridgePrompt").textContent = "知识点没吃透时，不要硬打完整思路。先点一个小句子，系统会帮你接上。";
  card.querySelectorAll("[data-concept-bridge]").forEach((button) => {
    const key = button.dataset.conceptBridge;
    button.textContent = key === "teach" ? "先补知识点" : key === "goal" ? "先接上题目目标" : "先接上第一步";
    button.setAttribute("aria-label", choices[key] || choices.goal);
  });
}

function applyConceptBridgeChoice(choiceKey = "goal", input = $("inlineCoachReply")) {
  if (!hasActiveGuidanceLock() || !input) return;
  const choices = conceptBridgeChoicesForLock(state.guidanceLock);
  const sentence = choices[choiceKey] || choices.goal;
  if (choiceKey === "teach") {
    input.value = sentence;
    state.guidanceLock.replyDraft = sentence;
    rescueIncompleteGuidanceReply(sentence, input);
    return;
  }
  input.value = sentence;
  state.guidanceLock.replyDraft = sentence;
  state.guidanceLock.conceptBridgeReady = true;
  state.guidanceLock.microChoiceReady = false;
  state.guidanceLock.stepBuilderParts = {
    ...(state.guidanceLock.stepBuilderParts || {}),
    [choiceKey === "method" ? "method" : "goal"]: sentence.replace(/[。.!！]$/, ""),
  };
  renderReplyQuality(input.value);
  input.focus();
}

function continueConceptBridgeSentence(input = $("inlineCoachReply")) {
  if (!hasActiveGuidanceLock() || !input) return;
  let draft = input.value.trim();
  let quality = evaluateGuidanceReplyQuality(draft);
  let guard = 0;
  while (!quality.ready && guard < 3) {
    const nextSentence = guidanceNextMissingSentence(draft, state.guidanceLock);
    draft = `${draft} ${nextSentence}`.trim();
    quality = evaluateGuidanceReplyQuality(draft);
    guard += 1;
  }
  input.value = draft;
  state.guidanceLock.replyDraft = input.value;
  state.guidanceLock.conceptBridgeReady = false;
  renderReplyQuality(input.value);
  if (evaluateGuidanceReplyQuality(input.value).ready) $("inlineCoachSubmit").focus();
  else input.focus();
}

function guidanceReplyStarterForLock(lock = state.guidanceLock, question = activeQuestions()[lock?.questionIndex ?? state.currentQuestion]) {
  const scaffold = guidanceScaffoldForLock(lock, question);
  const firstStep = scaffold.firstStep.replace(/^第一步看什么：/, "") || "关键词或条件";
  return `这题要我[写题目目标]。我第一步先看[${firstStep}]，因为[说明这一步为什么有用]。`;
}

function guidanceNextMissingSentence(reply = "", lock = state.guidanceLock, question = activeQuestions()[lock?.questionIndex ?? state.currentQuestion]) {
  const quality = evaluateGuidanceReplyQuality(reply);
  const scaffold = guidanceScaffoldForLock(lock, question);
  const skill = question?.skill || activeDiagnostic().skills[0][0];
  const firstStep = scaffold.firstStep.replace(/^第一步看什么：/, "") || question?.coachHints?.[0] || "题目关键词和已知条件";
  if (!quality.questionGoal) return `这题要我判断 ${skill}。`;
  if (!quality.methodStep) return `我第一步先看 ${firstStep}。`;
  if (!quality.reasonWhy) return "因为这一步能帮我把题目要求和解题方法连起来。";
  if (!quality.enoughDetail) return "我还要把题目目标、第一步和原因连成一句完整方法。";
  return "现在把这句话用自己的话再说清楚一点。";
}

function guidanceReplyPlaceholderForLock(lock = state.guidanceLock, question = activeQuestions()[lock?.questionIndex ?? state.currentQuestion]) {
  const skill = question?.skill || activeDiagnostic().skills[0][0];
  if (/斜率|变化率|slope|rate|线性|函数/.test(skill)) {
    return "例如：这题要我判断变化关系。我第一步先看 x 和 y 怎么变，因为...";
  }
  if (/证据|中心观点|主张|作者|文本|claim|evidence|author|theme/.test(skill)) {
    return "例如：这题要我判断文章想说明什么。我第一步先找中心句和证据，因为...";
  }
  if (/方程|equation|逆运算|代数/.test(skill)) {
    return "例如：这题要我解出未知数。我第一步先看离 x 最远的运算，因为...";
  }
  if (/变量|实验|variable|experiment/.test(skill)) {
    return "例如：这题要我判断实验关系。我第一步先分清改变什么和测量什么，因为...";
  }
  if (/细胞|能量|生态|biology|cell|energy/.test(skill)) {
    return "例如：这题要我解释科学现象。我第一步先找结构、功能或能量变化，因为...";
  }
  return "例如：这题要我判断题目目标。我第一步先看关键词和条件，因为...";
}

function guidanceTeacherModelForLock(lock = state.guidanceLock, question = activeQuestions()[lock?.questionIndex ?? state.currentQuestion]) {
  const lesson = conceptMiniLesson(question);
  const skill = question?.skill || activeDiagnostic().skills[0][0];
  const firstStep = (lesson.steps?.[0] || question?.coachHints?.[0] || "看题目关键词和已知条件")
    .replace(/^先/, "")
    .replace(/[。.!！]$/, "");
  const reason =
    lock?.issue === "confidence"
      ? "这样可以证明我不是猜的，而是真的知道方法为什么能用"
      : "这一步能帮我把题目要求和解题方法连起来";
  return `题目要我判断 ${skill}。第一步我先${firstStep}，因为${reason}。`;
}

function evaluateGuidanceReplyQuality(reply = "") {
  const text = reply.trim().toLowerCase();
  const compactText = text.replace(/\s+/g, "");
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const conceptBridgeReady = Boolean(state.guidanceLock?.conceptBridgeReady);
  const enoughDetail = compactText.length >= 18 || wordCount >= 8;
  const hasQuestionGoal = /题目|问什么|要求|求什么|找什么|判断|比较|what|which|calculate/.test(text);
  const hasMethodStep = /先|第一步|步骤|方法|看|找|变化|条件|证据|除以|比较|compare|divide|change|rate/.test(text);
  const hasReasonWhy = /因为|所以|为了|能帮|说明|证明|原因|why|because|so that/.test(text);
  const asksForHelp = /不知道|不会|不懂|写什么|怎么写|没思路|知识点没吃透|打不出来|说不出来|help|stuck|idk|not sure/.test(text);
  const hasPlaceholder = /\[.*?\]|_{2,}/.test(reply);
  const conceptNotReady = asksForHelp || (Boolean(text) && !hasQuestionGoal && !hasMethodStep);
  return {
    enoughDetail,
    questionGoal: hasQuestionGoal,
    methodStep: hasMethodStep,
    reasonWhy: hasReasonWhy,
    asksForHelp,
    hasPlaceholder,
    conceptNotReady,
    conceptBridgeReady,
    ready: enoughDetail && hasQuestionGoal && hasMethodStep && hasReasonWhy && !asksForHelp && !hasPlaceholder,
  };
}

function guidanceCannotProduceThought(reply = "") {
  return /别人知识点没吃透|人家也打不出来|打不出来|说不出来|写不出来|不知道这题问什么|不懂这题问什么|不知道要写什么|不会说思路|没思路/.test(String(reply || ""));
}

function guidanceReplyHelpText(reply = "", quality = evaluateGuidanceReplyQuality(reply)) {
  if (guidanceCannotProduceThought(reply)) {
    return "你说得对，知识点没吃透时很难自己打出思路。不要再让孩子先完整说思路；系统会先帮你拆题和补概念，然后只填一个空。";
  }
  if (quality.asksForHelp) {
    return "没关系，先教会，再让你只答一小步。还是不会就点“看老师示范句”，不用自己组织完整答案。";
  }
  if (quality.hasPlaceholder) {
    return "把方括号里的内容换成自己的话；如果不知道怎么换，可以先看老师示范句。";
  }
  const missing = [
    !quality.enoughDetail && "把解释写完整一点",
    !quality.questionGoal && "写清题目要找什么",
    !quality.methodStep && "写清第一步看什么",
    !quality.reasonWhy && "写清为什么这样做",
  ].filter(Boolean);
  return missing.length ? `下一步只补：${missing[0]}。可以先照下面句式写。` : "这句还不够清楚，先照下面句式补完整。";
}

function guidanceReplyProgressText(quality = evaluateGuidanceReplyQuality()) {
  const completed = [quality.questionGoal, quality.methodStep, quality.reasonWhy].filter(Boolean).length;
  const next =
    !quality.questionGoal
      ? "先写这题要判断什么"
      : !quality.methodStep
        ? "再写第一步看什么"
        : !quality.reasonWhy
          ? "最后写为什么这一步有用"
          : quality.ready
            ? "可以提交给教练检查"
            : "把 3 个部分连成一句完整方法";
  return `已完成 ${completed}/3：${next}。`;
}

function guidanceSubmitButtonText(quality = evaluateGuidanceReplyQuality()) {
  if (quality.conceptBridgeReady) return "继续补下一句";
  if (quality.asksForHelp) return "帮我开头";
  if (quality.ready) return "提交给教练";
  if (quality.conceptNotReady) return "帮我拆题";
  return "让教练帮我补";
}

function guidanceNextActionForReply(reply = "", quality = evaluateGuidanceReplyQuality(reply), lock = state.guidanceLock) {
  if (lock?.status === "variant") {
    const variantReply = $("variantReply")?.value || lock.variantDraft || "";
    const variantReady = isVariantRubricReady(variantReply, lock.variant);
    return variantReady
      ? "完成变式验证：提交给 AI 教练，通过后会自动进入下一题。"
      : "完成变式验证：先写题型、第一步和原因；卡住就点“补下一句”。";
  }
  if (quality.ready || lock?.microChoiceReady) {
    return "提交给教练：方法句已够完整，系统会检查后进入变式验证。";
  }
  if (guidanceCannotProduceThought(reply) || quality.asksForHelp || lock?.forceStepBuilder) {
    return "知识点没吃透时，先不用自己组织完整句；点“小台阶”或“二选一微任务”。";
  }
  if (!quality.questionGoal) return "先补题目目标：这题要我判断什么。";
  if (!quality.methodStep) return "再补方法步骤：第一步看什么或找什么。";
  if (!quality.reasonWhy) return "最后补原因说明：为什么这一步有用。";
  return "把三句连成一句完整方法，再提交给教练。";
}

function renderGuidanceNextAction(reply = $("inlineCoachReply")?.value || "", quality = evaluateGuidanceReplyQuality(reply)) {
  const bar = $("guidanceNextActionBar");
  if (!bar) return;
  $("guidanceNextActionLabel").textContent = "下一步动作";
  $("guidanceNextActionText").textContent = guidanceNextActionForReply(reply, quality, state.guidanceLock);
}

function setGuidanceWaitingAction(immediateReply = "", canMoveToVariant = false) {
  const bar = $("guidanceNextActionBar");
  if (!bar) return;
  $("guidanceNextActionLabel").textContent = "AI 正在补充检查";
  $("guidanceNextActionText").textContent = canMoveToVariant
    ? "你已经进入变式验证。先按本地提示补这一小步，远端 AI 返回后会追加更细的建议。"
    : `先按本地提示补这一小步：${immediateReply}`;
}

function renderReplyQuality(reply = $("inlineCoachReply")?.value || "") {
  const card = $("replyQualityCard");
  if (!card) return;
  const quality = evaluateGuidanceReplyQuality(reply);
  renderGuidanceNextAction(reply, quality);
  const helperCard = $("replyHelperCard");
  const canAskForHelp = quality.asksForHelp || Boolean(String(reply || "").trim());
  [
    ["qualityQuestionGoal", quality.questionGoal],
    ["qualityMethodStep", quality.methodStep],
    ["qualityReasonWhy", quality.reasonWhy],
  ].forEach(([id, met]) => {
    $(id).classList.toggle("met", met);
  });
  const missing = [
    !quality.enoughDetail && "解释要更完整",
    !quality.questionGoal && "题目目标",
    !quality.methodStep && "方法步骤",
    !quality.reasonWhy && "原因说明",
  ].filter(Boolean);
  const starter = guidanceReplyStarterForLock(state.guidanceLock);
  $("replyQualityStatus").textContent =
    state.guidanceLock?.microChoiceReady && quality.ready
      ? state.guidanceLock.microChoiceNote || "已帮你写好一个小步骤，可以直接提交给教练检查。"
      : quality.ready
        ? "这句方法比较完整，可以提交给 AI 教练检查。"
        : quality.asksForHelp || quality.hasPlaceholder
          ? guidanceReplyHelpText(reply, quality)
          : `还差：${missing.join("、")}。${guidanceReplyHelpText(reply, quality)}`;
  $("replyProgressText").textContent = guidanceReplyProgressText(quality);
  if (helperCard) {
    helperCard.classList.toggle("hidden", quality.ready);
    $("replyHelperText").textContent = guidanceReplyHelpText(reply, quality);
    $("replyStarterText").textContent = starter;
    $("replyNextSentenceText").textContent = `建议下一句：${guidanceNextMissingSentence(reply, state.guidanceLock)}`;
    renderGuidanceMicroChoice(state.guidanceLock, quality);
    renderConceptBridgeChoices(reply, quality, state.guidanceLock);
  }
  $("inlineCoachSubmit").disabled = !quality.ready && !canAskForHelp;
  $("inlineCoachSubmit").textContent = guidanceSubmitButtonText(quality);
  renderGuidanceUnlockProgress();
}

function teachingMiniExampleForSkill(skill = "") {
  if (/斜率|变化率|slope|rate/.test(skill)) {
    return "如果题目问变化率，先看 x 怎么变、y 怎么变，再说明为什么要比较这两个变化。";
  }
  if (/证据|中心观点|主张|claim|evidence|author/.test(skill)) {
    return "如果题目问作者观点，先找中心句，再找能直接支持它的证据。";
  }
  if (/方程|equation|逆运算/.test(skill)) {
    return "如果题目是方程，先说清楚变量正在被做什么运算，再用相反运算保持两边平衡。";
  }
  if (/变量|实验|variable|experiment/.test(skill)) {
    return "如果题目是实验，先分清谁被改变、谁被测量、谁要保持不变。";
  }
  return "先把题目目标和第一步拆开看，再解释这一步为什么能缩小判断范围。";
}

function buildGuidedTeachingMove(reply = "", lock = state.guidanceLock) {
  const question = activeQuestions()[lock?.questionIndex || state.currentQuestion];
  const lesson = conceptMiniLesson(question);
  const skill = question?.skill || activeDiagnostic().skills[0][0];
  const quality = evaluateGuidanceReplyQuality(reply);
  const hint = coachingHintForTurn(question, lock?.teachingTurns || 0);
  const mistake = commonMistakeForQuestion(question);
  const nextAsk = quality.reasonWhy
    ? "把你的方法换成一句更具体的话：我先看____，因为____。"
    : "先不要写答案，请补上“为什么这一步有用”。";
  return `概念提醒：${hint} 常见误区：${mistake} 小例子：${teachingMiniExampleForSkill(skill)} 下一问：${nextAsk}`;
}

function buildGuidanceRescueMove(lock = state.guidanceLock) {
  const question = activeQuestions()[lock?.questionIndex || state.currentQuestion];
  const skill = question?.skill || activeDiagnostic().skills[0][0];
  const firstStep = coachingHintForTurn(question, lock?.teachingTurns || 0);
  const mistake = commonMistakeForQuestion(question);
  const modelSentence = guidanceTeacherModelForLock(lock, question);
  if (lock?.microDrill) {
    return `我们先降一级做微练习。${lock.microDrill.prompt} 我已经把一条可改写的句子放到输入框里：${lock.microDrill.starter}`;
  }
  return `可以，不会写时先不要硬猜。这个知识点是 ${skill}。先记住：${firstStep}。容易错在：${mistake}。我已经把一条老师示范句放到输入框里，你先改成自己的话再继续：${modelSentence}`;
}

function guidanceNeedsLowerStep(lock = state.guidanceLock) {
  const teachingTurns = lock?.teachingTurns || 0;
  return teachingTurns >= 3;
}

function shouldUseTeachFirstLadder(reply = "", lock = state.guidanceLock) {
  const quality = evaluateGuidanceReplyQuality(reply);
  return guidanceCannotProduceThought(reply) || quality.asksForHelp || guidanceNeedsLowerStep(lock);
}

function teachFirstLadderDraft(reply = "", lock = state.guidanceLock) {
  if (!lock) return "";
  if (shouldUseTeachFirstLadder(reply, lock)) return guidanceStepBuilderSentence("goal", lock);
  return lock.microDrill?.starter || guidanceTeacherModelForLock(lock);
}

function buildConceptBridgeMove(reply = "", lock = state.guidanceLock) {
  const question = activeQuestions()[lock?.questionIndex || state.currentQuestion];
  const lesson = conceptMiniLesson(question);
  const skill = question?.skill || activeDiagnostic().skills[0][0];
  const firstStep = coachingHintForTurn(question, lock?.teachingTurns || 0) || lesson.steps?.[0] || "先找题目里的关键词";
  const microDrill = lock?.microDrill || guidanceMicroDrillForLock(lock, question);
  const quality = evaluateGuidanceReplyQuality(reply);
  const missing =
    !quality.questionGoal
      ? "题目目标"
      : !quality.methodStep
        ? "第一步"
        : !quality.reasonWhy
          ? "原因"
          : "具体内容";
  if (guidanceNeedsLowerStep(lock)) {
    return `你已经卡了几次，这说明任务太大，不是你不努力。我们不用再打完整句，先点下面的小台阶按钮，只完成一个空：题目问什么。系统会帮你把后面的第一步和原因慢慢接上。`;
  }
  if (guidanceCannotProduceThought(reply)) {
    return `你说得对，别人知识点没吃透时，人家也打不出来。不要先打完整思路，我们先帮你拆题和补概念。小讲解：${localStudentFriendlyConceptLine(question)} 小例子：${teachingMiniExampleForSkill(skill)} 我先帮你写好第一小句，接下来你只需要点“第一步”或从两个小选择里选一个：${guidanceStepBuilderSentence("goal", lock, question)}`;
  }
  return `你说得对，知识点没吃透时确实很难自己说题意，也会打不出来、说不出来。先教会，再让你只答一小步，不用自己组织完整答案。老师先示范怎么拆题：1. 题目要判断 ${skill}；2. 第一眼看关键词或条件；3. 用二选一或填空说出第一步。小讲解：${skill} 这类题先抓“题目要判断什么”和“第一步看什么”。小例子：${teachingMiniExampleForSkill(skill)} 现在只补${missing}：${microDrill.starter}`;
}

function rescueIncompleteGuidanceReply(reply = "", input = $("inlineCoachReply")) {
  appendInlineCoach("student", reply);
  state.guidanceLock.teachingTurns = (state.guidanceLock.teachingTurns || 0) + 1;
  state.guidanceLock.microDrill = guidanceMicroDrillForLock(state.guidanceLock);
  const coachMove = buildConceptBridgeMove(reply, state.guidanceLock);
  state.inlineCoachHistory.push({ role: "coach", text: coachMove });
  state.guidanceLock.forceStepBuilder = shouldUseTeachFirstLadder(reply, state.guidanceLock);
  if (state.guidanceLock.forceStepBuilder) {
    state.guidanceLock.forceStepBuilder = true;
    state.guidanceLock.stepBuilderParts = { goal: guidanceStepBuilderSentence("goal", state.guidanceLock) };
  }
  state.guidanceLock.replyDraft = teachFirstLadderDraft(reply, state.guidanceLock);
  input.value = state.guidanceLock.replyDraft;
  renderReplyQuality(input.value);
  saveData();
  renderDiagnostic();
  focusGuidancePanel();
}

function requestConceptExampleReteach(input = $("inlineCoachReply")) {
  if (!hasActiveGuidanceLock()) return;
  state.guidanceLock.teachingTurns = (state.guidanceLock.teachingTurns || 0) + 1;
  state.guidanceLock.microDrill = guidanceMicroDrillForLock(state.guidanceLock);
  const currentDraft = input?.value?.trim() || "我还是没懂，换个例子讲。";
  state.inlineCoachHistory.push({ role: "student", text: currentDraft });
  state.inlineCoachHistory.push({ role: "coach", text: buildConceptBridgeMove(currentDraft, state.guidanceLock) });
  state.guidanceLock.replyDraft = state.guidanceLock.microDrill?.starter || guidanceTeacherModelForLock(state.guidanceLock);
  input.value = state.guidanceLock.replyDraft;
  renderReplyQuality(input.value);
  saveData();
  renderDiagnostic();
  focusGuidancePanel();
}

function submitGuidanceQuickReply(text = "", input = $("inlineCoachReply")) {
  if (!hasActiveGuidanceLock() || !text.trim()) return;
  input.value = text.trim();
  if (state.guidanceLock) state.guidanceLock.replyDraft = input.value;
  renderReplyQuality(input.value);
  if (/换个例子|换种讲法|another example/i.test(input.value)) {
    requestConceptExampleReteach(input);
    return;
  }
  rescueIncompleteGuidanceReply(input.value, input);
}

function shouldMoveToVariantAfterReply(reply = "") {
  return evaluateGuidanceReplyQuality(reply).ready || (isReasonStrong(reply) && (state.guidanceLock?.teachingTurns || 0) >= 1);
}

function transitionGuidanceToVariantImmediately(reply = "", immediateReply = "") {
  if (!state.guidanceLock) return false;
  state.guidanceLock.status = "variant";
  state.guidanceLock.teachingTurns = (state.guidanceLock.teachingTurns || 0) + 1;
  appendInlineCoach(
    "coach",
    `本地已确认你的方法句够完整，马上进入变式验证。${immediateReply} 现在做一道变式验证：不靠原题选项，用自己的话写出方法。`
  );
  saveData();
  renderDiagnostic();
  return true;
}

function startGuidedMastery(question, selectedIndex, reason, confidence, issue) {
  const variant = buildVariantQuestion(question);
  const startsWithVariant = issue === "school_verification";
  state.guidanceLock = {
    questionIndex: state.currentQuestion,
    questionKey: questionProgressKey(),
    selectedIndex,
    reason,
    confidence,
    issue,
    variant,
    status: startsWithVariant ? "variant" : "coaching",
    teachingTurns: 0,
    complete: false,
  };
  state.inlineCoachHistory = startsWithVariant
    ? [
        {
          role: "coach",
          text: `${guidanceIssueText(issue)} 你刚才已经选对了，现在不需要重复选项，直接写出这类题的解题方法和原因。`,
        },
      ]
    : [
        {
          role: "coach",
          text: `${guidanceIssueText(issue)} 我不会直接告诉你答案，但会先帮你拆题。小讲解：${question.skill} 这类题先看题目要判断什么，再找第一步线索。`,
        },
        {
          role: "coach",
          text: `${question.coachHints?.[0] || "先找题干里的关键词，再看哪个选项直接回应它。"} 如果说不出来，可以点“帮我拆题”或“看老师示范句”。`,
        },
      ];
}

function completeGuidedMastery(variantReply = "") {
  if (!state.guidanceLock) return;
  const question = activeQuestions()[state.guidanceLock.questionIndex];
  const outcome = masteryOutcome(state.guidanceLock, variantReply);
  updateSkillMastery(question, { guided: true });
  markMistakeReviewed(question);
  completeChallengeMissionForQuestion(question, "guided");
  state.guidedMastery[state.guidanceLock.questionKey] = {
    ...outcome,
  };
  state.guidanceLock.complete = true;
  const preferredIndex = nextAdaptiveQuestionIndex(activeQuestions(), state.guidanceLock.questionIndex, {
    isCorrect: true,
    level: adaptiveLevelForSubject(),
  });
  advanceToNextQuestionAfterCompletion(state.guidanceLock.questionIndex, "guided", preferredIndex);
  state.guidanceLock = null;
  state.inlineCoachHistory = [];
}

function resetDiagnosticProgress() {
  state.selectedAnswer = null;
  state.selectedAnswers = {};
  state.answerConfidence = {};
  state.hintUsage = {};
  state.guidanceLock = null;
  state.guidedMastery = {};
  state.inlineCoachHistory = [];
  state.answeredQuestionKeys = {};
  state.currentQuestion = 0;
  state.activeQuestionProgressKey = "";
  state.questionStartedAt = "";
  state.lastAdvanceNotice = "";
  state.reportReady = false;
}

function twoHourBlockMinutes(totalMinutes = 120) {
  const minutes = Math.max(60, Number(totalMinutes) || 120);
  const concept = Math.max(12, Math.round(minutes * 0.16));
  const foundation = Math.max(20, Math.round(minutes * 0.34));
  const review = Math.max(15, Math.round(minutes * 0.2));
  const challenge = Math.max(15, Math.round(minutes * 0.22));
  const used = concept + foundation + review + challenge;
  return {
    concept,
    foundation,
    review,
    challenge,
    summary: Math.max(8, minutes - used),
  };
}

function buildTwoHourLearningBlocks({ student, plan, focusSubject, answeredCount, guidedCount, report, openMistakes }) {
  const targetQuestions = plan.questionTarget || Math.max(4, Math.min(24, Math.round(plan.minutes / 5)));
  const foundationTarget = Math.max(4, Math.round(targetQuestions * 0.45));
  const reviewTarget = Math.max(2, Math.round(targetQuestions * 0.2));
  const challengeTarget = Math.max(2, targetQuestions - foundationTarget - reviewTarget);
  const twoHourMode = plan.minutes >= 90 || targetQuestions >= 18;
  const blockMinutes = twoHourBlockMinutes(plan.minutes);

  if (!twoHourMode) {
    const done = Math.min(answeredCount, targetQuestions);
    return [
      {
        step: "第一步",
        title: `${focusSubject.label} 今日学习课`,
        detail: `先独立作答，答错或不确定后再看讲解和例题；完成 ${targetQuestions} 道练习，难度策略：${difficultyModeLabel(plan.difficultyMode)}。`,
        done,
        total: targetQuestions,
      },
      {
        step: "第二步",
        title: "卡住时 AI 引导",
        detail: openMistakes.length
          ? `优先处理 ${openMistakes[0].skill}，AI 会先补概念，再追问下一步。`
          : "如果答错或选择不确定，系统会自动打开 AI 教练卡片。",
        done: openMistakes.length ? guidedCount : 1,
        total: 1,
      },
      {
        step: "第三步",
        title: "变式验证",
        detail: "答错或猜对的题，必须通过一道同知识点变式题，才算真正会了。",
        done: guidedCount ? 1 : 0,
        total: 1,
      },
      {
        step: "第四步",
        title: "今日总结",
        detail: "生成学习总结，家长能看到今天学了什么、哪里卡住、明天怎么调。",
        done: report ? 1 : 0,
        total: 1,
      },
    ];
  }

  return [
    {
      step: "第一步",
      title: "独立诊断",
      minutes: blockMinutes.concept,
      detail: `${student.name} 先独立完成 ${focusSubject.label} 的开场题；答错或不确定后，系统再展开概念、例题和易错点。`,
      done: answeredCount > 0 ? 1 : 0,
      total: 1,
    },
    {
      step: "第二步",
      title: "基础练习",
      minutes: blockMinutes.foundation,
      detail: `完成约 ${foundationTarget} 道基础和中等题，目标是把方法做稳，而不是追求速度。`,
      done: Math.min(answeredCount, foundationTarget),
      total: foundationTarget,
    },
    {
      step: "第三步",
      title: "错题复盘",
      minutes: blockMinutes.review,
      detail: openMistakes.length
        ? `优先复盘 ${openMistakes[0].skill}，用 AI 引导讲清楚错因。`
        : `完成约 ${reviewTarget} 道滚动复习题，防止旧知识掉线。`,
      done: Math.min(Math.max(answeredCount - foundationTarget, 0), reviewTarget),
      total: reviewTarget,
    },
    {
      step: "第四步",
      title: "挑战拔高",
      minutes: blockMinutes.challenge,
      detail: `完成约 ${challengeTarget} 道挑战题或解释题，每题都要能说出理由。`,
      done: Math.min(Math.max(answeredCount - foundationTarget - reviewTarget, 0), challengeTarget),
      total: challengeTarget,
    },
    {
      step: "第五步",
      title: "今日总结",
      minutes: blockMinutes.summary,
      detail: "生成今日总结，记录掌握度、错题知识点和明天计划。",
      done: report ? 1 : 0,
      total: 1,
    },
  ];
}

function buildDailyTasks(student = activeStudent()) {
  const plan = planForStudent(student.id);
  const focusSubject = subjectById(plan.focusSubject) || subjects[student.grade][0];
  const session = todayPracticeSessionSummary(student.id);
  const answeredCount = Math.max(Object.keys(state.selectedAnswers).length, session.answered || 0);
  const guidedCount = guidedMasteryCount(student.id);
  const report = todayRecordForStudent(student.name);
  const openMistakes = mistakesForStudent(student.id);
  return buildTwoHourLearningBlocks({ student, plan, focusSubject, answeredCount, guidedCount, report, openMistakes });
}

function todayCompletionState(tasks = buildDailyTasks()) {
  const completed = tasks.reduce((sum, task) => sum + Math.min(task.done, task.total), 0);
  const total = tasks.reduce((sum, task) => sum + task.total, 0);
  return {
    completed,
    total,
    percent: total ? Math.round((completed / total) * 100) : 0,
    complete: total > 0 && completed >= total,
    nextTask: tasks.find((task) => task.done < task.total),
  };
}

function dailyMissionStatus(task = {}, index = 0, tasks = []) {
  if (task.skipped) return "Skipped";
  if (task.done >= task.total) return "Completed";
  const previousDone = tasks.slice(0, index).every((item) => item.done >= item.total);
  if (task.done > 0 || previousDone) return "In Progress";
  return "Pending";
}

function subjectPathCategory(subjectId = state.subject) {
  if (/math|algebra|geometry|preAlgebra/i.test(subjectId)) return "math";
  if (/rla|english/i.test(subjectId)) return "reading";
  if (/biology|science/i.test(subjectId)) return "vocabulary";
  return "math";
}

function moduleStatusFromScore(score, hasMistake = false) {
  if (hasMistake) return "Needs Review";
  if (score >= 80) return "Mastered";
  if (score >= 45) return "Learning";
  return "Not Started";
}

function learningPathModulesFor(category = state.learningPathSubject) {
  const base = learningPathCatalog[category] || learningPathCatalog.math;
  const diagnosticSkills = Object.values(diagnostics)
    .flatMap((diagnostic) => diagnostic.skills || [])
    .map(([skill, score]) => ({ skill, score }));
  return base.map((moduleName, index) => {
    const related = diagnosticSkills.find((item) => {
      const moduleLower = moduleName.toLowerCase();
      const skillLower = item.skill.toLowerCase();
      return moduleLower.split(/\s|&/).some((token) => token.length > 3 && skillLower.includes(token))
        || skillLower.split(/\s|与|和|、/).some((token) => token.length > 2 && moduleLower.includes(token));
    });
    const mistake = mistakesForStudent().find((item) => item.skill === related?.skill || item.skill?.includes(moduleName));
    const tracked = masteryForSkill(preferredSubjectForPathCategory(category), related?.skill || moduleName);
    const fallbackScore = Math.max(25, 72 - index * 6);
    const mastery = Math.max(0, Math.min(100, tracked?.mastery ?? related?.score ?? fallbackScore));
    return {
      title: moduleName,
      skill: related?.skill || moduleName,
      mastery: mistake && !tracked ? Math.max(25, mastery - 18) : mastery,
      status: tracked?.status ? tracked.status.replace("_", " ") : moduleStatusFromScore(mistake ? mastery - 18 : mastery, Boolean(mistake)),
      subjectId: preferredSubjectForPathCategory(category),
    };
  });
}

function localSchoolPathForStudent(student = activeStudent()) {
  if (student.id === "older") {
    return {
      label: "Frisco ISD / Liberty High School",
      focus: "9th Grade / English I + Algebra I readiness",
      plan: "MIA 的本地化路径：优先稳住 English I 的 evidence-based reading/writing，再把 Algebra I 的 linear functions、equations 和 word problems 做成每日练习。",
    };
  }
  return {
    label: "Frisco ISD / 8th Grade Bridge",
    focus: "8th Grade Math + Reading evidence",
    plan: "EVA 的本地化路径：先加强 8th Grade Math 的比例、斜率、方程准备，同时保持 RLA 的 inference、central idea 和 text evidence。",
  };
}

function preferredSubjectForPathCategory(category) {
  const gradeSubjects = subjects[state.grade] || subjects[activeStudent().grade] || subjects["9"];
  const preferred = {
    math: gradeSubjects.find((subject) => /math|algebra|geometry|preAlgebra/i.test(subject.id)),
    reading: gradeSubjects.find((subject) => /rla|english/i.test(subject.id)),
    writing: gradeSubjects.find((subject) => /english|rla/i.test(subject.id)),
    vocabulary: gradeSubjects.find((subject) => /english|rla|science|biology/i.test(subject.id)),
    sat: gradeSubjects.find((subject) => /algebra|english|math/i.test(subject.id)),
  }[category];
  return (preferred || gradeSubjects[0]).id;
}

function dashboardStats(student = activeStudent(), tasks = buildDailyTasks(student)) {
  const completion = todayCompletionState(tasks);
  const mistakes = mistakesForStudent(student.id);
  const trackedWeak = weakSkillMasteryItems(student.id).map((item) => item.skill);
  const answered = Object.keys(state.selectedAnswers).length;
  const guided = guidedMasteryCount(student.id);
  const reportDays = new Set(state.records.filter((record) => record.student === student.name).map((record) => record.date)).size;
  const trackedMastery = Object.values(state.skillMastery).filter((item) => item.studentId === student.id);
  const masteryScores = trackedMastery.length ? trackedMastery.map((item) => item.mastery) : activeDiagnostic().skills.map(([, score]) => score);
  const averageMastery = masteryScores.length
    ? Math.round(masteryScores.reduce((sum, score) => sum + score, 0) / masteryScores.length)
    : 0;
  const xp = completion.completed * 10 + guided * 20 + Math.max(0, answered - mistakes.length) * 5;
  return {
    averageMastery,
    level: averageMastery >= 80 ? "Level 4" : averageMastery >= 65 ? "Level 3" : averageMastery >= 50 ? "Level 2" : "Level 1",
    streak: Math.max(reportDays, answered ? 1 : 0),
    xp,
    weakSkills: [...new Set(trackedWeak.concat(topMistakeSkills(mistakes).map(([skill]) => skill), activeDiagnostic().skills.filter(([, score]) => score < 60).map(([skill]) => skill)))].slice(0, 3),
  };
}

function nextStudentAction(tasks = buildDailyTasks()) {
  const current = todayCompletionState(tasks);
  if (current.complete) return "今日学习已完成。可以休息，或做 1 道挑战题保持手感。";
  if (!current.nextTask) return "下一步：开始今日学习。";
  if (current.nextTask.title.includes("总结")) return "下一步：生成今日总结。";
  if (current.nextTask.title.includes("变式")) return "下一步：完成变式验证。";
  if (current.nextTask.title.includes("AI")) return "下一步：完成 AI 引导。";
  return `下一步：${current.nextTask.title}。`;
}

function mergeQuestions(primary = [], secondary = []) {
  const seen = new Set();
  return [...primary, ...secondary].filter((question) => {
    const key = question.prompt.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function rotateQuestionOptions(question, index) {
  if (!question?.answers?.length) return question;
  const shift = index % question.answers.length;
  if (shift === 0) return question;

  const answers = [...question.answers.slice(shift), ...question.answers.slice(0, shift)];
  const correct = (question.correct - shift + question.answers.length) % question.answers.length;
  return { ...question, answers, correct };
}

function prepareQuestionSet(questions) {
  return questions.map((question, index) => rotateQuestionOptions(question, index));
}

function difficultyScore(difficulty = "中等") {
  const value = String(difficulty);
  if (value.includes("挑战") || value.includes("challenge")) return 3;
  if (value.includes("进阶") || value.includes("advanced")) return 2;
  if (value.includes("基础") || value.includes("foundation")) return 0;
  return 1;
}

function questionExamDepthScore(question = {}) {
  return [
    question.schoolExamDepth,
    question.constructedResponse,
    question.openResponse,
    question.errorAnalysis,
    question.multiStepReasoning,
  ].filter(Boolean).length;
}

function questionLearningDepthScore(question = {}) {
  const promptLength = String(question.prompt || "").trim().length;
  const explanationLength = String(question.explanation || "").trim().length;
  const hintCount = [
    ...(question.coachHints || []),
    question.aiHintLevel1,
    question.aiHintLevel2,
    question.aiHintLevel3,
  ].filter(Boolean).length;
  return (
    difficultyScore(question.difficulty) * 8
    + questionExamDepthScore(question) * 18
    + Math.min(12, Math.floor(promptLength / 35))
    + Math.min(12, Math.floor(explanationLength / 45))
    + Math.min(10, hintCount * 2)
  );
}

function isShallowChoiceQuestion(question = {}) {
  return Array.isArray(question.answers)
    && question.answers.length >= 3
    && questionExamDepthScore(question) === 0
    && !question.openResponse
    && !question.constructedResponse
    && !question.errorAnalysis
    && questionLearningDepthScore(question) < 28;
}

function requiresPreAnswerThought(question = {}) {
  return Boolean(
    question.schoolExamDepth
    || question.constructedResponse
    || question.openResponse
    || question.errorAnalysis
    || question.multiStepReasoning
    || questionLearningDepthScore(question) >= 42
  );
}

function preAnswerThoughtQuality(text = "") {
  const normalized = String(text || "").trim().toLowerCase();
  const blocked = /^[a-d]$|^选\s*[a-d]$|^choose\s*[a-d]$|不知道|不会|随便|guess|idk/.test(normalized);
  const hasGoal = /题目|问什么|要求|求什么|找什么|判断|比较|identify|what|which|calculate/.test(normalized);
  const hasMethod = /先|第一步|步骤|方法|看|找|条件|关键词|证据|变化|关系|first|evidence|compare|change|clue/.test(normalized);
  const hasReason = /因为|所以|为了|能帮|说明|证明|原因|because|why|so that|therefore/.test(normalized);
  return { normalized, blocked, hasGoal, hasMethod, hasReason, enoughLength: normalized.length >= 14 };
}

function isChallengePreAnswerQuestion(question = {}) {
  return difficultyScore(question.difficulty) >= 2 || question.constructedResponse || question.openResponse || question.errorAnalysis || question.multiStepReasoning;
}

function isPreAnswerThoughtReady(text = "", question = {}) {
  const quality = preAnswerThoughtQuality(text);
  if (!quality.enoughLength || quality.blocked) return false;
  if (isSchoolExamPracticeQuestion(question)) return quality.hasGoal && quality.hasMethod && quality.hasReason;
  if (isChallengePreAnswerQuestion(question)) return quality.hasGoal && quality.hasMethod;
  return quality.hasGoal || quality.hasMethod;
}

function preAnswerGateState(question = activeQuestions()[state.currentQuestion], progressKey = questionProgressKey()) {
  const selectedAnswer = state.selectedAnswers[state.currentQuestion];
  const locked = hasActiveGuidanceLock();
  const guidedComplete = Boolean(state.guidedMastery[progressKey]);
  const thought = state.preAnswerThoughts[progressKey] || "";
  const needsPreAnswer = requiresPreAnswerThought(question) && selectedAnswer === undefined && !locked && !guidedComplete;
  const preAnswerReady = !needsPreAnswer || isPreAnswerThoughtReady(thought, question);
  return { thought, needsPreAnswer, preAnswerReady };
}

function renderPreAnswerGate(question = activeQuestions()[state.currentQuestion], progressKey = questionProgressKey()) {
  const { thought, needsPreAnswer, preAnswerReady } = preAnswerGateState(question, progressKey);
  const card = $("preAnswerCard");
  if (!card) return { thought, needsPreAnswer, preAnswerReady };
  const thoughtInput = $("preAnswerThought");
  card.classList.toggle("hidden", !needsPreAnswer);
  if (document.activeElement !== thoughtInput) thoughtInput.value = thought;
  $("preAnswerStatus").textContent = preAnswerReady ? "思路已记录，选项已解锁。" : "先写一句思路，选项才会解锁。";
  $("preAnswerHelp").textContent = preAnswerReady
    ? "现在可以选择答案；如果不确定，选择“不确定/猜的”，系统会引导。"
    : isSchoolExamPracticeQuestion(question)
      ? "不要写答案字母。写清题目目标、第一步和为什么这样做。"
      : isChallengePreAnswerQuestion(question)
        ? "不要写答案字母。写清题目目标和第一步。"
        : "不要写答案字母。写清“题目要判断什么”或“第一步看什么”。";
  document.querySelectorAll("#answerGrid [data-answer-index]").forEach((button) => {
    button.classList.toggle("locked-choice", !preAnswerReady);
    if (!preAnswerReady) button.setAttribute("aria-disabled", "true");
    else button.removeAttribute("aria-disabled");
  });
  if (needsPreAnswer && !preAnswerReady) {
    $("answerFeedback").textContent = "这是一道深度题。先写一句自己的解题思路，再选择答案。";
  } else if (needsPreAnswer && preAnswerReady && state.selectedAnswers[state.currentQuestion] === undefined) {
    $("answerFeedback").textContent = "思路已记录。现在可以选择答案；答错后系统会讲解并引导。";
  }
  return { thought, needsPreAnswer, preAnswerReady };
}

function questionTypeLabel(question = {}) {
  if (question.schoolExamDepth) return "学校考试深度";
  if (question.constructedResponse || question.openResponse) return "解释型题";
  if (question.errorAnalysis) return "错因分析题";
  if (question.multiStepReasoning) return "多步推理题";
  return "选择诊断题";
}

function isDepthPracticeQuestion(question = {}) {
  return questionExamDepthScore(question) > 0 || difficultyScore(question.difficulty) >= 2 || questionLearningDepthScore(question) >= 36;
}

function isSchoolExamPracticeQuestion(question = {}) {
  return Boolean(
    question.schoolExamDepth
    || question.multiStepReasoning
    || question.constructedResponse
    || question.openResponse
    || question.errorAnalysis
    || questionLearningDepthScore(question) >= 50
  );
}

function isExplanationFirstChallenge(question = {}) {
  return Boolean(
    question.schoolExamDepth
    || question.constructedResponse
    || question.openResponse
    || question.errorAnalysis
    || question.multiStepReasoning
  ) && difficultyScore(question.difficulty) >= 2;
}

function adaptiveLevelForSubject(subjectId = state.subject) {
  return Math.max(0, Math.min(difficultyLevels.length - 1, state.adaptiveLevels[subjectId] ?? 1));
}

function challengeBoostForSubject(subjectId = state.subject) {
  return Math.max(0, Number(state.adaptiveStats[subjectId]?.challengeBoostRemaining || 0));
}

function activeChallengeMission(subjectId = state.subject) {
  const queue = state.adaptiveStats[subjectId]?.challengeQueue || [];
  return challengeBoostForSubject(subjectId) > 0 ? queue[0] || null : null;
}

function shouldEnterChallengeBoost(question = {}, nextStats = {}, isCorrect = false) {
  const plan = planForStudent(state.studentId);
  const easyChoice = difficultyScore(question?.difficulty) <= 1 || isShallowChoiceQuestion(question);
  const fastCorrect = secondsOnCurrentQuestion() <= 20;
  const effortlessStreak = Number(nextStats.correctStreak || 0) >= 2;
  return plan.difficultyMode !== "steady" && isCorrect && easyChoice && (fastCorrect || effortlessStreak);
}

function buildChallengeMissionQueue(question = {}, nextStats = {}) {
  const skill = question?.skill || activeDiagnostic().skills[0][0];
  const streak = Math.max(2, Number(nextStats.correctStreak || 2));
  return [
    { label: "解释型题", detail: `用自己的话写出 ${skill} 的第一步和原因。` },
    { label: "学校考试深度题", detail: `连续 ${streak} 题很顺，下一题优先选学校考试深度题。` },
    { label: "同技能变式题", detail: "再做一道同技能变式，确认不是靠选项猜出来。" },
  ];
}

function renderChallengeMissionQueue(question = activeQuestions()[state.currentQuestion]) {
  const panel = $("challengeMissionQueue");
  if (!panel) return;
  const queue = state.adaptiveStats[state.subject]?.challengeQueue || [];
  const active = challengeBoostForSubject(state.subject) > 0 && queue.length;
  panel.classList.toggle("hidden", !active);
  $("challengeMissionList").innerHTML = active
    ? queue.map((item) => `<li><strong>${item.label}</strong><span>${item.detail}</span></li>`).join("")
    : "";
}

function isTwoHourPlan(plan = planForStudent(state.studentId)) {
  return plan.minutes >= 90 || (plan.questionTarget || 8) >= 18;
}

function learningBlockForQuestionIndex(index = state.currentQuestion, plan = planForStudent(state.studentId)) {
  const targetQuestions = plan.questionTarget || 8;
  if (!isTwoHourPlan(plan)) return { id: "practice", label: "今日学习", rangeEnd: targetQuestions };

  const foundationEnd = Math.max(4, Math.round(targetQuestions * 0.45));
  const reviewEnd = foundationEnd + Math.max(2, Math.round(targetQuestions * 0.2));
  if (index < foundationEnd) return { id: "foundation", label: "基础练习", rangeEnd: foundationEnd };
  if (index < reviewEnd) return { id: "review", label: "错题复盘", rangeEnd: reviewEnd };
  return { id: "challenge", label: "挑战拔高", rangeEnd: targetQuestions };
}

function learningRouteBlocks(plan = planForStudent(state.studentId)) {
  const targetQuestions = dailyQuestionLimit(plan);
  if (!isTwoHourPlan(plan)) {
    return [{ id: "practice", label: "今日学习", start: 0, end: targetQuestions }];
  }
  const foundationEnd = Math.max(4, Math.round(targetQuestions * 0.45));
  const reviewEnd = foundationEnd + Math.max(2, Math.round(targetQuestions * 0.2));
  return [
    { id: "foundation", label: "基础练习", start: 0, end: foundationEnd },
    { id: "review", label: "错题复盘", start: foundationEnd, end: reviewEnd },
    { id: "challenge", label: "挑战拔高", start: reviewEnd, end: targetQuestions },
  ];
}

function advancedQuestionRatio(plan = planForStudent(state.studentId), subjectId = state.subject) {
  const challengeMode = challengeBoostForSubject(subjectId) > 0;
  return challengeMode ? 0.85 : plan.difficultyMode === "challenge" ? 0.75 : plan.difficultyMode === "steady" ? 0.35 : 0.55;
}

function depthFirstQuestionSort(a, b, target = adaptiveLevelForSubject()) {
  const aDistance = Math.abs(difficultyScore(a.difficulty) - target);
  const bDistance = Math.abs(difficultyScore(b.difficulty) - target);
  return (
    questionExamDepthScore(b) - questionExamDepthScore(a)
    || questionLearningDepthScore(b) - questionLearningDepthScore(a)
    || aDistance - bDistance
    || difficultyScore(b.difficulty) - difficultyScore(a.difficulty)
  );
}

function selectAdaptiveQuestions(questions, plan = planForStudent(state.studentId)) {
  const challengeMode = challengeBoostForSubject(state.subject) > 0;
  const target = challengeMode ? 3 : Math.max(adaptiveLevelForSubject(), plan.difficultyMode === "steady" ? 1 : 2);
  const sorted = [...questions].sort((a, b) => depthFirstQuestionSort(a, b, target));
  const nearTarget = sorted.filter((question) => Math.abs(difficultyScore(question.difficulty) - target) <= 1);
  const candidates = nearTarget.length >= 6 ? nearTarget : sorted;
  const targetCount = dailyQuestionLimit(plan);
  const advancedTarget = Math.max(2, Math.round(targetCount * advancedQuestionRatio(plan, state.subject)));
  const advancedQuestions = candidates.filter(
    (question) => difficultyScore(question.difficulty) >= 2 || question.schoolExamDepth || question.openResponse || question.errorAnalysis || question.constructedResponse
  ).sort((a, b) => depthFirstQuestionSort(a, b, target));
  const foundationQuestions = candidates.filter((question) => difficultyScore(question.difficulty) < 2 && !question.openResponse && !question.errorAnalysis && !question.constructedResponse);
  return mergeQuestions(advancedQuestions.slice(0, advancedTarget), foundationQuestions.concat(candidates));
}

function selectTwoHourStructuredQuestions(questions, plan = planForStudent(state.studentId)) {
  const adaptiveQuestions = selectAdaptiveQuestions(questions, plan);
  if (!isTwoHourPlan(plan)) return adaptiveQuestions;

  const targetQuestions = plan.questionTarget || 24;
  const challengeMode = plan.difficultyMode === "challenge";
  const foundationTarget = challengeMode ? 1 : Math.max(2, Math.round(targetQuestions * 0.2));
  const reviewTarget = challengeMode ? Math.max(2, Math.round(targetQuestions * 0.15)) : Math.max(3, Math.round(targetQuestions * 0.25));
  const challengeTarget = Math.max(2, targetQuestions - foundationTarget - reviewTarget);
  const foundationQuestions = adaptiveQuestions
    .filter((question) => difficultyScore(question.difficulty) <= 1)
    .sort((a, b) => questionLearningDepthScore(b) - questionLearningDepthScore(a));
  const reviewQuestions = adaptiveQuestions.filter((question) => question.spiralReview || question.errorAnalysis);
  const challengeQuestions = adaptiveQuestions.filter(
    (question) => difficultyScore(question.difficulty) >= 2 || question.schoolExamDepth || question.constructedResponse || question.openResponse
  );

  return mergeQuestions(
    foundationQuestions.slice(0, foundationTarget)
      .concat(reviewQuestions.slice(0, reviewTarget), challengeQuestions.slice(0, challengeTarget)),
    adaptiveQuestions
  );
}

function dailyQuestionLimit(plan = planForStudent(state.studentId)) {
  return Math.max(1, Number(plan.questionTarget || (isTwoHourPlan(plan) ? 24 : 8)));
}

function minimumDailyDepthQuestions(plan = planForStudent(state.studentId)) {
  const limit = dailyQuestionLimit(plan);
  if (plan.difficultyMode === "steady") return Math.min(limit, 2);
  if (plan.difficultyMode === "challenge") return Math.min(limit, Math.max(3, Math.round(limit * 0.45)));
  return Math.min(limit, Math.max(2, Math.round(limit * 0.35)));
}

function minimumDailySchoolExamQuestions(plan = planForStudent(state.studentId)) {
  const limit = dailyQuestionLimit(plan);
  if (plan.difficultyMode === "steady") return Math.min(limit, Math.max(1, Math.round(limit * 0.18)));
  if (plan.difficultyMode === "challenge") return Math.min(limit, Math.max(3, Math.round(limit * 0.45)));
  return Math.min(limit, Math.max(2, Math.round(limit * 0.3)));
}

function ensureDailyDepthMix(questions, plan = planForStudent(state.studentId)) {
  const limit = dailyQuestionLimit(plan);
  const minimumDepth = minimumDailyDepthQuestions(plan);
  const firstBatch = questions.slice(0, limit);
  const currentDepth = firstBatch.filter(isDepthPracticeQuestion).length;
  if (currentDepth >= minimumDepth) return questions;

  const used = new Set(firstBatch.map((question) => questionStableKey(question)));
  const depthPool = questions
    .slice(limit)
    .filter((question) => isDepthPracticeQuestion(question) && !used.has(questionStableKey(question)))
    .sort((a, b) => questionLearningDepthScore(b) - questionLearningDepthScore(a) || questionExamDepthScore(b) - questionExamDepthScore(a) || difficultyScore(b.difficulty) - difficultyScore(a.difficulty));
  if (!depthPool.length) return questions;

  const adjusted = [...firstBatch];
  let needed = minimumDepth - currentDepth;
  for (let index = adjusted.length - 1; index >= 0 && needed > 0 && depthPool.length; index -= 1) {
    if (isDepthPracticeQuestion(adjusted[index])) continue;
    adjusted[index] = depthPool.shift();
    needed -= 1;
  }
  return mergeQuestions(adjusted, questions);
}

function ensureDailySchoolExamMix(questions, plan = planForStudent(state.studentId)) {
  const limit = dailyQuestionLimit(plan);
  const minimumSchoolDepth = minimumDailySchoolExamQuestions(plan);
  const firstBatch = questions.slice(0, limit);
  const currentSchoolDepth = firstBatch.filter(isSchoolExamPracticeQuestion).length;
  if (currentSchoolDepth >= minimumSchoolDepth) return questions;

  const used = new Set(firstBatch.map((question) => questionStableKey(question)));
  const schoolDepthPool = questions
    .slice(limit)
    .filter((question) => isSchoolExamPracticeQuestion(question) && !used.has(questionStableKey(question)))
    .sort((a, b) => depthFirstQuestionSort(a, b));
  if (!schoolDepthPool.length) return questions;

  const adjusted = [...firstBatch];
  let needed = minimumSchoolDepth - currentSchoolDepth;
  for (let index = adjusted.length - 1; index >= 0 && needed > 0 && schoolDepthPool.length; index -= 1) {
    if (isSchoolExamPracticeQuestion(adjusted[index])) continue;
    adjusted[index] = schoolDepthPool.shift();
    needed -= 1;
  }
  return mergeQuestions(adjusted, questions);
}

function frontloadSchoolExamPractice(questions, plan = planForStudent(state.studentId)) {
  const limit = Math.min(dailyQuestionLimit(plan), questions.length);
  if (limit < 3) return questions;
  const firstWindow = questions.slice(0, Math.min(3, limit));
  if (firstWindow.some(isSchoolExamPracticeQuestion)) return questions;
  const schoolDepthIndex = questions.findIndex((question, index) => index < limit && isSchoolExamPracticeQuestion(question));
  if (schoolDepthIndex <= 0) return questions;
  const adjusted = [...questions];
  const [schoolDepthQuestion] = adjusted.splice(schoolDepthIndex, 1);
  // challenge-first school exam depth
  if (plan.difficultyMode === "challenge" && isSchoolExamPracticeQuestion(schoolDepthQuestion)) adjusted.splice(0, 0, schoolDepthQuestion);
  else adjusted.splice(1, 0, schoolDepthQuestion);
  return adjusted;
}

function limitEasyWarmupQuestions(questions, plan = planForStudent(state.studentId)) {
  const limit = Math.min(dailyQuestionLimit(plan), questions.length);
  if (plan.difficultyMode === "steady" || limit < 3) return questions;
  const firstTwoEasyCount = questions.slice(0, 2).filter((question) => difficultyScore(question.difficulty) <= 1 && !isDepthPracticeQuestion(question)).length;
  if (firstTwoEasyCount < 2) return questions;
  const replacementIndex = questions.findIndex(
    (question, index) => index >= 2 && index < limit && (isDepthPracticeQuestion(question) || isSchoolExamPracticeQuestion(question))
  );
  if (replacementIndex < 0) return questions;
  const adjusted = [...questions];
  const [replacement] = adjusted.splice(replacementIndex, 1);
  adjusted.splice(1, 0, replacement);
  return adjusted;
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function currentPracticeSession() {
  const today = todayIsoDate();
  const active = state.practiceSessions.find((session) => session.id === state.activePracticeSessionId);
  if (active && active.studentId === state.studentId && active.subject === state.subject && active.startedAt?.startsWith(today)) {
    return active;
  }

  const session = {
    id: `${state.studentId}-${state.subject}-${Date.now()}`,
    studentId: state.studentId,
    subject: state.subject,
    skill: activeQuestions()[state.currentQuestion]?.skill || activeDiagnostic().skills[0][0],
    startedAt: new Date().toISOString(),
    endedAt: "",
    questionsAnswered: 0,
    correctCount: 0,
    hintsUsed: 0,
    difficultyStart: adaptiveLevelForSubject(),
    difficultyEnd: adaptiveLevelForSubject(),
    slowCount: 0,
    guessingCount: 0,
    events: [],
  };
  state.practiceSessions.unshift(session);
  state.practiceSessions = state.practiceSessions.slice(0, 40);
  state.activePracticeSessionId = session.id;
  return session;
}

function markQuestionTimer(progressKey = questionProgressKey()) {
  if (state.activeQuestionProgressKey !== progressKey) {
    state.activeQuestionProgressKey = progressKey;
    state.questionStartedAt = new Date().toISOString();
  }
}

function secondsOnCurrentQuestion() {
  const started = Date.parse(state.questionStartedAt || "");
  if (!started) return 0;
  return Math.max(1, Math.round((Date.now() - started) / 1000));
}

function recordPracticeAttempt(question, selectedIndex, confidence, adaptiveResult) {
  const session = currentPracticeSession();
  const seconds = secondsOnCurrentQuestion();
  const correct = selectedIndex === question.correct;
  const event = {
    questionKey: mistakeKey(state.studentId, state.subject, question),
    skill: question.skill || activeDiagnostic().skills[0][0],
    difficulty: question.difficulty || difficultyLevels[adaptiveLevelForSubject()],
    correct,
    confidence,
    seconds,
    usedHint: Boolean(state.hintUsage?.[questionProgressKey()]),
    issueType: !correct ? mistakeTypeFor({ reason: guidanceIssueText("answer"), skill: question.skill }) : seconds > 90 ? "slow_mastery" : confidence !== "sure" ? "guessing" : "secure",
    answeredAt: new Date().toISOString(),
  };

  session.skill = event.skill;
  session.questionsAnswered += 1;
  session.correctCount += correct ? 1 : 0;
  session.hintsUsed += event.usedHint ? 1 : 0;
  session.difficultyEnd = adaptiveResult?.level ?? adaptiveLevelForSubject();
  session.slowCount += correct && seconds > 90 ? 1 : 0;
  session.guessingCount += !correct && seconds <= 12 ? 1 : 0;
  session.endedAt = event.answeredAt;
  session.events = [event, ...(session.events || [])].slice(0, 80);
  savePracticeSessionToCloud(session).catch((error) => console.warn("Practice session cloud save skipped.", error));
  return event;
}

function todayPracticeSessionSummary(studentId = state.studentId) {
  const today = todayIsoDate();
  const sessions = state.practiceSessions.filter((session) => session.studentId === studentId && session.startedAt?.startsWith(today));
  const answered = sessions.reduce((sum, session) => sum + (session.questionsAnswered || 0), 0);
  const correct = sessions.reduce((sum, session) => sum + (session.correctCount || 0), 0);
  const hints = sessions.reduce((sum, session) => sum + (session.hintsUsed || 0), 0);
  const slow = sessions.reduce((sum, session) => sum + (session.slowCount || 0), 0);
  const guessing = sessions.reduce((sum, session) => sum + (session.guessingCount || 0), 0);
  const seconds = sessions.reduce(
    (sum, session) =>
      sum + Math.max(0, (Date.parse(session.endedAt || session.startedAt) - Date.parse(session.startedAt || session.endedAt || new Date().toISOString())) / 1000),
    0
  );
  return {
    sessions: sessions.length,
    answered,
    correct,
    accuracy: answered ? Math.round((correct / answered) * 100) : 0,
    hints,
    slow,
    guessing,
    minutes: Math.max(0, Math.round(seconds / 60)),
  };
}

function updateAdaptiveDifficulty(question, selectedIndex) {
  const subjectId = state.subject;
  const isCorrect = selectedIndex === question.correct;
  const current = state.adaptiveStats[subjectId] || { correctStreak: 0, missedStreak: 0 };
  const completedChallengeMission = isCorrect && completeChallengeMissionForQuestion(question, "correct", subjectId);
  const currentChallengeBoost = Number(state.adaptiveStats[subjectId]?.challengeBoostRemaining ?? current.challengeBoostRemaining ?? 0);
  const nextStats = {
    correctStreak: isCorrect ? current.correctStreak + 1 : 0,
    missedStreak: isCorrect ? 0 : current.missedStreak + 1,
    challengeBoostRemaining: completedChallengeMission ? currentChallengeBoost : Math.max(0, currentChallengeBoost - 1),
  };
  let level = adaptiveLevelForSubject(subjectId);
  let message = "";
  let challengeMode = nextStats.challengeBoostRemaining > 0;

  const raisedLevel = nextStats.correctStreak >= 2 && level < difficultyLevels.length - 1;
  if (shouldEnterChallengeBoost(question, nextStats, isCorrect)) {
    nextStats.challengeBoostRemaining = 3;
    state.adaptiveStats[subjectId] = nextStats;
    state.adaptiveStats[subjectId].challengeQueue = buildChallengeMissionQueue(question, nextStats);
    state.adaptiveStats[subjectId].challengeSkill = question?.skill || "";
    challengeMode = true;
    message = "这组题太轻松，接下来进入挑战模式：优先做解释型/学校考试深度题。";
  }
  if (raisedLevel) {
    level += 1;
    nextStats.correctStreak = 0;
    if (!message) message = "答得很顺，下一题会提高一点难度。";
  } else if (nextStats.missedStreak >= 2 && level > 0) {
    level -= 1;
    nextStats.missedStreak = 0;
    message = "这组题偏难，下一题会先回到更稳的难度。";
  }

  state.adaptiveLevels[subjectId] = level;
  state.adaptiveStats[subjectId] = { ...(state.adaptiveStats[subjectId] || {}), ...nextStats };
  return { isCorrect, level, message, fastCorrect: isCorrect && secondsOnCurrentQuestion() <= 20, raisedLevel, challengeMode };
}

function raiseDifficultyOnDemand() {
  if (hasActiveGuidanceLock()) {
    $("answerFeedback").textContent = "这题还在 AI 引导中，先完成当前小步骤，再升难度。";
    return;
  }
  const subjectId = state.subject;
  const currentLevel = adaptiveLevelForSubject(subjectId);
  const nextLevel = Math.min(difficultyLevels.length - 1, currentLevel + 1);
  state.adaptiveLevels[subjectId] = nextLevel;
  state.adaptiveStats[subjectId] = {
    ...(state.adaptiveStats[subjectId] || {}),
    correctStreak: 0,
    missedStreak: 0,
    challengeBoostRemaining: 3,
    challengeQueue: buildChallengeMissionQueue(activeQuestions()[state.currentQuestion] || {}, { correctStreak: 2 }),
    lastManualBoostAt: new Date().toISOString(),
    lastManualBoostReason: "手动升难度",
  };
  const questions = activeQuestions();
  const preferredIndex = nextAdaptiveQuestionIndex(questions, state.currentQuestion, { isCorrect: true, level: nextLevel, challengeMode: true, raisedLevel: true });
  if (preferredIndex >= 0) state.currentQuestion = preferredIndex;
  state.lastAdvanceNotice = "你觉得太简单，系统已切到更高难度的解释型或挑战题。";
  $("answerFeedback").textContent = `${state.lastAdvanceNotice} 当前目标难度：${difficultyLevels[nextLevel]}。`;
  $("dailySuggestion").textContent = `${state.lastAdvanceNotice} 接下来优先做学校考试深度题。`;
  saveData();
  renderDiagnostic();
}

function activeQuestions() {
  applyDifficultyMode(state.studentId, state.subject);
  const cloudQuestions = state.cloudQuestions[state.subject] || [];
  const localQuestions = localQuestionBank[state.subject] || [];
  const expandedQuestions = expandedQuestionBank[state.subject] || [];
  const challengeQuestions = challengeQuestionBank[state.subject] || [];
  const twoHourQuestions = twoHourExpansionQuestionBank[state.subject] || [];
  if (cloudQuestions.length || localQuestions.length || expandedQuestions.length || challengeQuestions.length || twoHourQuestions.length) {
    const selected = selectTwoHourStructuredQuestions(mergeQuestions(cloudQuestions, localQuestions.concat(expandedQuestions, challengeQuestions, twoHourQuestions)));
    const depthBalanced = limitEasyWarmupQuestions(frontloadSchoolExamPractice(ensureDailyDepthMix(ensureDailySchoolExamMix(selected))));
    return prepareQuestionSet(depthBalanced.slice(0, dailyQuestionLimit()));
  }

  const diagnostic = activeDiagnostic();
  if (diagnostic.questions) {
    const depthBalanced = limitEasyWarmupQuestions(frontloadSchoolExamPractice(ensureDailyDepthMix(ensureDailySchoolExamMix(selectAdaptiveQuestions(diagnostic.questions)))));
    return prepareQuestionSet(depthBalanced.slice(0, dailyQuestionLimit()));
  }
  const strongest = diagnostic.skills.reduce((best, skill) => (skill[1] > best[1] ? skill : best), diagnostic.skills[0]);
  const weakest = diagnostic.skills.reduce((low, skill) => (skill[1] < low[1] ? skill : low), diagnostic.skills[0]);
  const generatedQuestions = selectAdaptiveQuestions([
    {
      prompt: diagnostic.prompt,
      standard: diagnostic.standard,
      difficulty: diagnostic.difficulty,
      answers: diagnostic.answers,
      correct: 0,
      skill: diagnostic.skills[0][0],
      explanation: "先判断题目考查的核心概念，再选择最符合题意的答案。",
      coachHints: ["题目真正让你找什么？", "哪一个选项直接回答了这个问题？"],
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
  ]);
  const depthBalanced = limitEasyWarmupQuestions(frontloadSchoolExamPractice(ensureDailyDepthMix(ensureDailySchoolExamMix(generatedQuestions))));
  return prepareQuestionSet(depthBalanced.slice(0, dailyQuestionLimit()));
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

function renderAccounts() {
  $("accountList").innerHTML = accounts
    .map(
      (account) => `
        <button class="account-button ${account.id === state.accountId ? "active" : ""}" data-account="${account.id}">
          <strong>${account.label}</strong>
          <span>${account.description}</span>
        </button>
      `
    )
    .join("");
}

function renderAuth() {
  const panel = document.querySelector(".auth-panel");
  if (!panel) return;
  const signedIn = Boolean(state.authSession);
  panel.classList.toggle("signed-in", signedIn);
  $("signOutButton").disabled = !signedIn;
  $("signInButton").disabled = signedIn;
  $("signUpButton").disabled = signedIn;
  if (signedIn) {
    $("accountStatus").textContent = currentAuthUserLabel();
    setAuthStatus(`已登录：${currentAuthUserLabel()}`);
  }
  $("signupStudentWrap").style.display = $("signupRole").value === "student" ? "block" : "none";
  renderAuthGate();
}

function renderStudents() {
  $("studentList").innerHTML = students
    .map(
      (student) => `
        <button class="student-button ${student.id === state.studentId ? "active" : ""}" data-student="${student.id}" ${state.accountRole === "student" ? "disabled" : ""}>
          <strong>${student.name}</strong>
        </button>
      `
    )
    .join("");
}

function renderTodayPlan() {
  const student = activeStudent();
  const plan = planForStudent(student.id);
  const focusSubject = subjectById(plan.focusSubject) || activeSubject();
  const tasks = buildDailyTasks(student);
  const completion = todayCompletionState(tasks);
  const stats = dashboardStats(student, tasks);

  $("todayTitle").textContent = `${student.name} 今日学习课`;
  $("dashboardGreeting").textContent = `Good morning, ${student.name}.`;
  $("dashboardMissionText").textContent = `Today Mission：${focusSubject.label} ${plan.minutes} 分钟，完成 ${plan.questionTarget || dailyQuestionLimit(plan)} 题，并把错题变成复习任务。`;
  $("dashboardLevel").textContent = stats.level;
  $("dashboardLevelNote").textContent = `综合掌握度约 ${stats.averageMastery}%`;
  $("dashboardStreak").textContent = `${stats.streak} 天`;
  $("dashboardXp").textContent = `${stats.xp} XP`;
  $("dashboardWeakCount").textContent = `${stats.weakSkills.length} 个`;
  $("dashboardWeakNote").textContent = stats.weakSkills.length ? stats.weakSkills.join("、") : "暂无高频薄弱点";
  $("todayMinutes").textContent = `${plan.minutes} 分钟`;
  $("todayFocus").textContent = plan.minutes >= 90 || (plan.questionTarget || 8) >= 18
    ? `重点：${focusSubject.label} · 2 小时结构 · ${plan.questionTarget || 24} 题`
    : `重点：${focusSubject.label} · 先学再练 · ${plan.questionTarget || 8} 题`;
  $("todayProgress").textContent = `${completion.completed} / ${completion.total}`;
  $("todayProgressBar").style.width = `${completion.percent}%`;
  $("todayEncouragement").textContent =
    completion.complete ? "今日学习已完成，可以做错题复盘。" : `已完成 ${completion.percent}%，先学一点，再练几题，卡住时再找 AI。`;
  $("todayNextAction").textContent = nextStudentAction(tasks);
  $("todayTaskList").innerHTML = tasks
    .map(
      (task, index) => {
        const status = dailyMissionStatus(task, index, tasks);
        return `
        <li class="${task.done >= task.total ? "task-done" : "task-pending"} mission-status-${status.toLowerCase().replace(/\s+/g, "-")}">
          <span class="task-step">${task.step}</span>
          <span class="mission-status-chip">${status}</span>
          <strong>${task.title}</strong><br />
          ${task.minutes ? `<span class="task-minutes">预计 ${task.minutes} 分钟</span><br />` : ""}
          ${task.detail}<br />
          进度：${Math.min(task.done, task.total)} / ${task.total}
        </li>
      `;
      }
    )
    .join("");
  renderStudentWrapup(completion);
  renderStudentActionBar();
  renderMistakeReview();
  $("dashboardNextTraining").innerHTML = studentCoachQueue({ focusSubject, stats, completion })
    .map(
      (item) => `
        <li class="coach-queue-item ${item.active ? "active" : ""}">
          <span>${item.label}</span>
          <strong>${item.title}</strong>
          <p>${item.detail}</p>
        </li>
      `
    )
    .join("");
}

function studentCoachQueue({ focusSubject, stats, completion }) {
  const openMistakes = mistakesForStudent(state.studentId);
  const target = dailyQuestionLimit(planForStudent(state.studentId));
  const answered = Object.keys(state.selectedAnswers).length;
  const weakSkill = stats.weakSkills[0] || openMistakes[0]?.skill || "";
  const needsPractice = answered < target;
  const needsReview = openMistakes.length > 0;
  const needsWrapup = answered > 0;

  return [
    {
      label: "现在",
      title: needsPractice ? `完成 ${focusSubject.label} 当前练习` : "今日练习目标已达到",
      detail: needsPractice
        ? `还差 ${Math.max(0, target - answered)} 题。先独立作答，不确定就标记“猜的”。`
        : "可以进入错题复盘或生成今日总结。",
      active: needsPractice,
    },
    {
      label: "卡住时",
      title: needsReview ? `优先复习 ${weakSkill}` : "用 AI 教练讲清方法",
      detail: needsReview
        ? "先看错因，再做同技能变式题；写出第一步和原因后再继续。"
        : "答错后系统会要求复述和变式验证，不会直接给答案。",
      active: needsReview,
    },
    {
      label: "收尾",
      title: needsWrapup ? "生成今日总结" : "先完成第一题",
      detail: needsWrapup
        ? `当前进度 ${completion.percent}%。总结会把正确率、错题和明天建议同步给家长端。`
        : "完成第一题后，系统会开始记录 XP、掌握度和错题复习。更像正式上课的一小步。",
      active: !needsPractice && needsWrapup,
    },
  ];
}

function renderLearningPath() {
  const categories = [
    ["math", "Math"],
    ["reading", "Reading"],
    ["writing", "Writing"],
    ["vocabulary", "Vocabulary"],
    ["sat", "SAT / PSAT Foundation"],
  ];
  $("learningPathSubjects").innerHTML = categories
    .map(([id, label]) => `<button class="path-subject-button ${state.learningPathSubject === id ? "active" : ""}" type="button" data-path-subject="${id}">${label}</button>`)
    .join("");
  const localPath = localSchoolPathForStudent(activeStudent());
  $("localSchoolLabel").textContent = localPath.label;
  $("localSchoolFocus").textContent = localPath.focus;
  $("localSchoolPlan").textContent = localPath.plan;
  const modules = learningPathModulesFor(state.learningPathSubject);
  $("learningPathStatus").textContent = `${modules.length} 个模块 · ${activeStudent().name}`;
  $("learningPathModules").innerHTML = modules
    .map(
      (module) => `
        <article class="path-module-card ${module.status.toLowerCase().replace(/\s+/g, "-")}">
          <div>
            <span>${module.status}</span>
            <strong>${module.title}</strong>
          </div>
          <p>${module.skill}</p>
          <div class="progress"><span style="width:${module.mastery}%"></span></div>
          <small>${module.mastery}% mastery</small>
          <button class="secondary-button small-button" type="button" data-practice-module="${module.subjectId}" data-practice-skill="${module.skill}">练这个模块</button>
        </article>
      `
    )
    .join("");
}

function renderStudentWrapup(completion = todayCompletionState()) {
  const answered = Object.keys(state.selectedAnswers).length;
  const guided = guidedMasteryCount(state.studentId);
  const mistakes = mistakesForStudent(state.studentId).length;
  const target = dailyQuestionLimit(planForStudent(state.studentId));
  const ready = completion.complete || answered >= target;
  const session = todayPracticeSessionSummary(state.studentId);

  $("wrapupAnswered").textContent = answered;
  $("wrapupGuided").textContent = guided;
  $("wrapupMistakes").textContent = mistakes;
  $("wrapupAccuracy").textContent = `${session.accuracy}%`;
  $("wrapupTime").textContent = `${session.minutes} 分钟`;
  $("finishTodayButton").disabled = answered === 0;
  $("finishTodayButton").textContent = ready ? "生成今日总结" : "先生成阶段总结";
  $("wrapupMessage").textContent = ready
    ? "今日目标已达到。生成总结后，家长端可以看到今天表现和明天建议。"
    : `今天目标是 ${target} 题，目前已答 ${answered} 题。正确率 ${session.accuracy || 0}%，使用提示 ${session.hints} 次；可以继续学习，也可以生成阶段总结。`;
}

function renderChallengeProofSummary(studentId = state.studentId) {
  const list = $("studentChallengeProofs");
  if (!list) return;
  const summary = challengeProofSummary(studentId);
  list.innerHTML = summary.recent.length
    ? summary.recent
        .map(
          (proof) =>
            `<li><strong>${proof.mission}</strong>：${proof.subject} · ${proof.skill}。${proof.outcome === "guided" ? "AI 引导后完成" : "独立答对后完成"}。</li>`
        )
        .join("")
    : "<li>还没有挑战证明。答题太轻松时，系统会安排解释型或学校深度题来验证真正掌握。</li>";
}

function renderStudentActionBar() {
  $("startDiagnosticButton").textContent = "开始今日学习";
  $("reviewMistakesButton").textContent = "复习错题";
  $("askCoachButton").textContent = "AI 教练";
  $("reviewMistakesButton").disabled = !mistakesForStudent().length;
}

function renderMistakeReview() {
  const openMistakes = mistakesForStudent();
  if (!openMistakes.length) {
    $("mistakeReviewList").innerHTML = "<li>暂无待复习错题。答错或未作答的题会自动进入这里。</li>";
    return;
  }

  $("mistakeReviewList").innerHTML = openMistakes
    .slice(0, 5)
    .map(
      (item) => `
        <li>
          <strong>${item.skill}</strong> · ${item.subjectLabel}<br />
          ${item.prompt}<br />
          已错 ${item.attempts || 1} 次；建议先复述概念，再做同类变式题。
          <br /><button class="secondary-button small-button" type="button" data-review-mistake="${item.key}">复习这题</button>
        </li>
      `
    )
    .join("");
}

function mistakeTypeFor(item = {}) {
  const text = `${item.reason || ""} ${item.skill || ""} ${item.prompt || ""}`.toLowerCase();
  if (/猜|confidence|不确定|careless/.test(text)) return "careless";
  if (/计算|方程|斜率|equation|slope|rate|除|乘/.test(text)) return "calculation";
  if (/阅读|文本|证据|作者|中心|reading|evidence|claim/.test(text)) return "reading";
  if (/逻辑|推理|证明|because|why|reason/.test(text)) return "logic";
  if (/概念|知识点|不清/.test(text)) return "concept";
  return "unknown";
}

function nextReviewDateForMistake(item = {}) {
  const last = item.lastMissedIso ? new Date(item.lastMissedIso) : new Date();
  const days = Math.min(7, Math.max(1, item.attempts || 1));
  last.setDate(last.getDate() + days);
  return last.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function similarPracticePackForMistake(item = {}, limit = 3) {
  const bank = mergeQuestions(
    localQuestionBank[item.subjectId] || [],
    (expandedQuestionBank[item.subjectId] || []).concat(challengeQuestionBank[item.subjectId] || [], twoHourExpansionQuestionBank[item.subjectId] || [])
  );
  const sameSkill = bank.filter((question) => question.skill === item.skill && question.prompt !== item.prompt);
  const nearby = bank.filter((question) => question.skill !== item.skill && difficultyScore(question.difficulty) <= difficultyScore(item.difficulty || "中等") + 1);
  return mergeQuestions(sameSkill, nearby).slice(0, limit);
}

function renderMistakeNotebook() {
  const mistakes = mistakesForStudent();
  const subjectFilter = $("mistakeSubjectFilter");
  const skillFilter = $("mistakeSkillFilter");
  const typeFilter = $("mistakeTypeFilter");
  const subjectOptions = [["all", "全部科目"], ...subjects[state.grade].map((subject) => [subject.id, subject.label])];
  const selectedSubject = subjectFilter.value || "all";
  subjectFilter.innerHTML = subjectOptions
    .map(([value, label]) => `<option value="${value}" ${value === selectedSubject ? "selected" : ""}>${label}</option>`)
    .join("");
  const skills = [...new Set(mistakes.map((item) => item.skill).filter(Boolean))];
  const selectedSkill = skillFilter.value || "all";
  skillFilter.innerHTML = [["all", "全部技能点"], ...skills.map((skill) => [skill, skill])]
    .map(([value, label]) => `<option value="${value}" ${value === selectedSkill ? "selected" : ""}>${label}</option>`)
    .join("");
  const selectedType = typeFilter.value || "all";
  const filtered = mistakes.filter((item) => {
    const subjectMatch = selectedSubject === "all" || item.subjectId === selectedSubject;
    const skillMatch = selectedSkill === "all" || item.skill === selectedSkill;
    const typeMatch = selectedType === "all" || mistakeTypeFor(item) === selectedType;
    return subjectMatch && skillMatch && typeMatch;
  });
  $("mistakeNotebookStatus").textContent = `${filtered.length} 条待复习`;
  $("mistakeNotebookList").innerHTML = filtered.length
    ? filtered
        .map(
          (item) => `
            <article class="mistake-note-card">
              <div>
                <span>${item.subjectLabel || subjectById(item.subjectId)?.label || "学习科目"}</span>
                <strong>${item.skill}</strong>
              </div>
              <p>${item.prompt}</p>
              <ul>
                <li>错误类型：${mistakeTypeFor(item)}</li>
                <li>错题次数：${item.attempts || 1}</li>
                <li>下次复习：${nextReviewDateForMistake(item)}</li>
              </ul>
              <p class="form-note">AI 复习重点：先解释为什么错，再做 3 道同类题，不直接背答案。</p>
              <div class="similar-practice-pack">
                <strong>同类练习包</strong>
                <ol>
                  ${similarPracticePackForMistake(item)
                    .map((question) => `<li>${question.skill} · ${question.difficulty}</li>`)
                    .join("") || "<li>题库正在补充同类题，先从当前错题复习开始。</li>"}
                </ol>
              </div>
              <button class="primary-button small-button" type="button" data-review-mistake="${item.key}">重新练习</button>
            </article>
          `
        )
        .join("")
    : `<article class="mistake-note-card empty-state"><strong>暂无符合条件的错题</strong><p>答错或选择“不确定/猜的”后，题目会自动进入这里。</p></article>`;
}

function openMistakeReviewLesson(mistakeKeyValue) {
  const mistake = state.mistakeLog.find((item) => item.key === mistakeKeyValue) || mistakesForStudent()[0];
  if (!mistake) return;
  state.subject = mistake.subjectId || state.subject;
  state.grade = mistake.grade || state.grade;
  const questions = activeQuestions();
  const matchingIndex = questions.findIndex((question) => question.prompt === mistake.prompt || question.skill === mistake.skill);
  state.currentQuestion = Math.max(0, matchingIndex);
  state.guidanceLock = null;
  state.inlineCoachHistory = [
    {
      role: "coach",
      text: `错题复习课：这次只复习 ${mistake.skill}。先不要急着选答案，请先说这类题第一步要看什么。`,
    },
  ];
  renderSelectors();
  renderDiagnostic();
  switchView("diagnostic");
  $("answerFeedback").textContent = `错题复习课：先看上方小课，再完成 ${mistake.skill} 的同类题。`;
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

function renderParentPlanControls() {
  $("planStudent").innerHTML = students
    .map((student) => `<option value="${student.id}" ${student.id === state.studentId ? "selected" : ""}>${student.name}</option>`)
    .join("");

  const selectedStudent = students.find((student) => student.id === $("planStudent").value) || activeStudent();
  const plan = planForStudent(selectedStudent.id);
  $("planMinutes").value = String(plan.minutes);
  $("planQuestionTarget").value = String(plan.questionTarget || 8);
  $("planDifficultyMode").value = plan.difficultyMode || "adaptive";
  $("planFocusSubject").innerHTML = subjects[selectedStudent.grade]
    .map((subject) => `<option value="${subject.id}" ${subject.id === plan.focusSubject ? "selected" : ""}>${subject.label}</option>`)
    .join("");

  const isParent = state.accountRole === "parent";
  $("parentPlanForm").style.display = isParent ? "block" : "none";
}

function renderDiagnostic() {
  const student = activeStudent();
  const subject = activeSubject();
  const diagnostic = activeDiagnostic();
  const questions = activeQuestions();
  const question = questions[state.currentQuestion] || questions[0];
  const adaptiveLevel = adaptiveLevelForSubject();
  const adaptiveLabel = difficultyLevels[adaptiveLevel];
  const challengeMode = challengeBoostForSubject(state.subject) > 0;
  const challengeModeLabel = challengeMode ? " · 挑战模式：优先做解释型/学校考试深度题" : "";
  const learningBlock = learningBlockForQuestionIndex(state.currentQuestion);
  const progressKey = questionProgressKey();
  markQuestionTimer(progressKey);
  const selectedAnswer = state.selectedAnswers[state.currentQuestion];
  const confidence = state.answerConfidence[progressKey] || "sure";
  const locked = hasActiveGuidanceLock();
  const guidedComplete = Boolean(state.guidedMastery[progressKey]);
  const { needsPreAnswer, preAnswerReady } = preAnswerGateState(question, progressKey);
  const showLessonAfterAttempt = locked || guidedComplete;
  const lesson = conceptMiniLesson(question);

  $("diagnosticTitle").textContent = `${student.name} · ${subject.label} 今日学习课`;
  $("practiceSubject").textContent = subject.label;
  $("practiceSkill").textContent = question.skill || diagnostic.skills[0][0];
  $("practiceDifficulty").textContent = `${question.difficulty} / ${adaptiveLabel}${challengeModeLabel} · ${questionTypeLabel(question)}`;
  $("practiceProgress").textContent = `${state.currentQuestion + 1}/${questions.length}`;
  $("standardTag").textContent = question.standard;
  $("difficultyTag").textContent = `${question.difficulty} · ${questionTypeLabel(question)} · 当前目标：${adaptiveLabel}${challengeModeLabel} · 当前环节：${learningBlock.label}`;
  $("questionProgress").textContent = `${state.currentQuestion + 1} / ${questions.length}`;
  renderChallengeMissionQueue(question);
  $("lessonConcept").textContent = lesson.concept;
  $("workedExample").textContent = lesson.example;
  $("methodHint").textContent = lesson.method;
  $("lessonSteps").innerHTML = lesson.steps.map((step) => `<li>${step}</li>`).join("");
  $("commonTrap").textContent = lesson.trap;
  $("quickCheck").textContent = lesson.quickCheck;
  $("miniLessonCard").classList.toggle("hidden", !showLessonAfterAttempt);
  $("questionPrompt").textContent = question.prompt;
  $("confidenceSelect").value = confidence;
  const plan = planForStudent(student.id);
  const focusSubject = subjectById(plan.focusSubject) || subject;
  $("dailySuggestion").textContent = `${student.name} 今天计划学习 ${plan.minutes} 分钟，重点完成 ${focusSubject.label}。当前目标难度：${adaptiveLabel}${challengeModeLabel}；系统会根据答题表现自动升降。`;

  $("answerGrid").innerHTML = question.answers
    .map(
      (answer, index) => `
        <button class="answer-option ${selectedAnswer === index ? "selected" : ""} ${locked ? "locked" : ""} ${!preAnswerReady ? "locked-choice" : ""}" data-answer-index="${index}" ${!preAnswerReady ? "aria-disabled=\"true\"" : ""}>
          ${answer}
        </button>
      `
    )
    .join("");

  $("prevQuestion").disabled = state.currentQuestion === 0;
  $("nextQuestion").disabled = state.currentQuestion === questions.length - 1 || hasActiveGuidanceLock();
  setAnswerSyncStatus(state.answerSyncStatus.state, state.answerSyncStatus.text);
  if (locked) {
    $("answerFeedback").textContent = "这题还在 AI 引导中。完成讲解和变式验证后，下一题会自动解锁。";
  } else if (needsPreAnswer && !preAnswerReady) {
    $("answerFeedback").textContent = "这是一道深度题。先写一句自己的解题思路，再选择答案。";
  } else if (selectedAnswer === undefined) {
    $("answerFeedback").textContent =
      state.lastAdvanceNotice || "先独立作答。不会、不确定或猜的，提交后系统再讲解和引导。";
  } else if (guidedComplete) {
    $("answerFeedback").textContent = state.lastAdvanceNotice || "这题已经通过 AI 引导和变式验证，可以进入下一题。";
  } else if (selectedAnswer === question.correct) {
    $("answerFeedback").textContent = state.lastAdvanceNotice || "这题通过了，可以继续下一题。";
  } else {
    $("answerFeedback").textContent = "这题需要完成引导后再进入下一题。";
  }
  renderStudentNextStep({ selectedAnswer, question, locked, guidedComplete, confidence });
  renderPreAnswerGate(question, progressKey);
  renderInlineCoachPanel();
  renderLearningRouteMap();

  $("knowledgeGrid").innerHTML = diagnostic.skills
    .map(([skill, score]) => {
      const tracked = masteryForSkill(state.subject, skill);
      const displayScore = tracked?.mastery ?? score;
      const level = displayScore >= 70 ? "high" : displayScore >= 55 ? "mid" : "low";
      const status = tracked?.status ? tracked.status.replace("_", " ") : lessonMasteryStatus(skill, score);
      return `
        <div class="skill-card ${level}">
          <strong>${skill}</strong>
          <span class="mastery-status">${status}</span>
          <p>${displayScore}% 掌握${tracked ? ` · ${tracked.accuracy}% 正确率` : ""}</p>
          <div class="progress"><span style="width:${displayScore}%"></span></div>
        </div>
      `;
    })
    .join("");
}

function studentNextStepState({ selectedAnswer, question, locked, guidedComplete, confidence }) {
  const challengeMission = activeChallengeMission();
  if (locked) {
    const status = state.guidanceLock?.status === "variant" ? "完成变式验证" : "回答 AI 的问题";
    return {
      tone: "warning",
      badge: "AI 引导中",
      title: status,
      body: "先用自己的话说出方法。通过变式验证后，系统会解锁下一题。",
    };
  }
  if (selectedAnswer === undefined) {
    if (challengeMission) {
      return {
        tone: "learning",
        badge: "挑战证明",
        title: `先完成${challengeMission.label}`,
        body: `这题不是普通选择题：${activeChallengeMission()?.detail || challengeMission.detail} 目标是证明你不是靠选项猜对。先写思路，再作答。`,
      };
    }
    return {
      tone: "learning",
      badge: "当前任务",
      title: "先独立作答",
      body: `先读题、圈关键词，再选择答案。讲解和方法步骤会在答错或不确定后出现。`,
    };
  }
  if (guidedComplete) {
    return {
      tone: "success",
      badge: "已弄懂",
      title: "可以进入下一题",
      body: "这题已经完成 AI 引导和变式验证。继续保持写理由的习惯。",
    };
  }
  if (selectedAnswer === question.correct && confidence === "sure") {
    return {
      tone: "success",
      badge: "答对了",
      title: "继续下一题",
      body: "这题通过。下一题会继续根据表现调整难度。",
    };
  }
  if (selectedAnswer === question.correct) {
    return {
      tone: "warning",
      badge: "需要确认",
      title: "答对了，但要证明不是猜的",
      body: "请进入 AI 引导，用自己的话说清楚为什么这样做，再做一道变式题。",
    };
  }
  return {
    tone: "warning",
    badge: "需要补会",
    title: "先别跳过，完成 AI 引导",
    body: "这题暴露了一个知识点缺口。系统会先讲清概念，再让你复述和做变式。",
  };
}

function renderStudentNextStep(context) {
  const stateInfo = studentNextStepState(context);
  const card = $("studentNextStepCard");
  card.className = `student-next-step-card ${stateInfo.tone}`;
  $("studentNextStepBadge").textContent = stateInfo.badge;
  $("studentNextStepTitle").textContent = stateInfo.title;
  $("studentNextStepBody").textContent = stateInfo.body;
}

function focusGuidancePanel() {
  const panel = $("inlineCoachPanel");
  if (!panel || panel.classList.contains("hidden")) return;
  window.setTimeout(() => {
    panel.scrollIntoView({ behavior: "smooth", block: "start" });
    $("inlineCoachReply")?.focus({ preventScroll: true });
  }, 80);
}

function renderLearningRouteMap() {
  const plan = planForStudent(state.studentId);
  const blocks = learningRouteBlocks(plan);
  const targetQuestions = dailyQuestionLimit(plan);
  const completed = Math.min(Object.keys(state.selectedAnswers).length, targetQuestions);
  const progressPercent = Math.min(100, Math.round((completed / targetQuestions) * 100));
  $("learningRouteMap").innerHTML = `
    <div class="route-heading">
      <div class="route-title">学习路线</div>
      <div class="route-progress-label">今日进度 ${completed}/${targetQuestions}</div>
    </div>
    <div class="learning-progress" aria-label="今日进度">
      <span style="width: ${progressPercent}%"></span>
    </div>
    <div class="route-steps">
      ${blocks
        .map((block) => {
          const active = state.currentQuestion >= block.start && state.currentQuestion < block.end;
          const done = state.currentQuestion >= block.end;
          const className = active ? "route-step active" : done ? "route-step done" : "route-step";
          return `
            <div class="${className}">
              <strong>${block.label}</strong>
              <span>${block.start + 1}-${block.end} 题</span>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderInlineCoachPanel() {
  const panel = $("inlineCoachPanel");
  if (!panel) return;
  const lock = hasActiveGuidanceLock() ? state.guidanceLock : null;
  panel.classList.toggle("hidden", !lock);
  if (!lock) return;

  $("guidanceStatus").textContent = lock.status === "variant" ? "做变式验证" : "AI 引导中";
  const replyInput = $("inlineCoachReply");
  replyInput.placeholder = guidanceReplyPlaceholderForLock(lock);
  if (lock.replyDraft && !replyInput.value.trim()) replyInput.value = lock.replyDraft;
  renderGuidanceTask(lock);
  renderGuidanceLadder(lock);
  renderGuidanceUnlockProgress(lock);
  renderGuidanceInsight(lock);
  renderGuidanceScaffold(lock);
  renderReplyQuality();
  const activeStep = lock.status === "variant" ? 2 : state.inlineCoachHistory.some((message) => message.role === "student") ? 1 : 0;
  $("masteryStepList").innerHTML = ["讲解", "复述", "变式"]
    .map((label, index) => `<li class="${index < activeStep ? "done" : index === activeStep ? "active" : ""}">${label}</li>`)
    .join("");
  $("inlineCoachWindow").innerHTML = state.inlineCoachHistory
    .map((message) => `<div class="message ${message.role}">${message.text}</div>`)
    .join("");
  $("inlineCoachWindow").scrollTop = $("inlineCoachWindow").scrollHeight;

  const variantVisible = lock.status === "variant";
  $("variantChallenge").classList.toggle("hidden", !variantVisible);
  $("inlineCoachForm").style.display = variantVisible ? "none" : "grid";
  if (!variantVisible) return;

  $("variantPrompt").textContent = lock.variant.prompt;
  renderVariantVerification(lock);
}

function renderVariantVerification(lock = state.guidanceLock) {
  if (!lock?.variant) return;
  const question = activeQuestions()[lock.questionIndex] || activeQuestions()[state.currentQuestion];
  const checklist = variantMethodChecklistFor(lock.variant, question);
  $("variantMission").textContent = checklist.mission;
  $("variantMethodChecklist").innerHTML = checklist.steps.map((step) => `<li>${step}</li>`).join("");
  $("variantSelfCheck").textContent = checklist.selfCheck;
  $("variantStarterBar").innerHTML = variantSentenceStartersFor(lock.variant, question)
    .map(
      (starter) =>
        `<button class="starter-chip" type="button" data-starter-text="${starter.text}">${starter.label}</button>`
    )
    .join("");
  $("variantReply").value = lock.variantDraft || "";
  renderVariantRubricFeedback(lock.variantDraft || "", lock.variant);
  if (lock.variantFeedback) $("variantFeedback").textContent = lock.variantFeedback;
}

async function saveParentPlanSettings() {
  const studentId = $("planStudent").value;
  const student = students.find((item) => item.id === studentId) || activeStudent();
  state.planSettings[studentId] = {
    minutes: Number($("planMinutes").value),
    questionTarget: Number($("planQuestionTarget").value),
    difficultyMode: $("planDifficultyMode").value,
    focusSubject: $("planFocusSubject").value,
  };

  if (state.studentId === studentId) {
    state.subject = state.planSettings[studentId].focusSubject;
    applyDifficultyMode(studentId, state.subject);
  }

  saveData();
  renderAll();
  $("planSaveStatus").textContent = `已保存 ${student.name} 的学习计划。孩子下次打开今日任务会看到新安排。`;
  try {
    await savePlanSettingsToCloud(studentId);
    if (state.authSession && state.accountRole === "parent") {
      $("planSaveStatus").textContent = `已保存 ${student.name} 的学习计划，并同步到云端。`;
    }
  } catch (error) {
    console.error(error);
    $("planSaveStatus").textContent = `已本机保存 ${student.name} 的学习计划；云端同步失败，请稍后再试。`;
    setAuthStatus("计划已本机保存，但云端同步失败。");
  }
}

function applyTwoHourPlanPreset() {
  $("planMinutes").value = "120";
  $("planQuestionTarget").value = "24";
  $("planDifficultyMode").value = "adaptive";
  $("planSaveStatus").textContent = "已填入 2 小时学习结构：概念讲解、基础练习、错题复盘、挑战拔高、今日总结。确认后点击保存计划。";
}

function buildLearningInsights({ average, answeredCount, correctCount, questions, plan }) {
  const accuracy = answeredCount ? Math.round((correctCount / answeredCount) * 100) : 0;
  const targetLevel = adaptiveLevelForSubject();
  const levelLabel = difficultyLevels[targetLevel] || "中等";
  const settings = planForStudent(state.studentId);
  const targetQuestions = settings.questionTarget || 8;
  const plannedSkills = plan.map(([skill]) => skill).join("、") || "当前知识点";

  let difficultyFit = `难度基本合适：当前处在${levelLabel}，完成更多题后会继续判断。`;
  if (answeredCount < Math.max(3, Math.round(targetQuestions / 2))) {
    difficultyFit = `数据还不够：今天只完成 ${answeredCount} 题，建议至少完成 ${Math.max(3, Math.round(targetQuestions / 2))} 题后再判断难度。`;
  } else if (accuracy >= 85 && targetLevel < difficultyLevels.length - 1) {
    difficultyFit = `偏简单：正确率 ${accuracy}%，下一轮可以提高到${difficultyLevels[targetLevel + 1]}，加入解释型和变式题。`;
  } else if (accuracy < 55 && targetLevel > 0) {
    difficultyFit = `偏难：正确率 ${accuracy}%，建议先回到${difficultyLevels[targetLevel - 1]}，把核心概念讲清楚后再升难度。`;
  } else if (accuracy >= 75) {
    difficultyFit = `难度合适偏稳：正确率 ${accuracy}%，可以保持${levelLabel}，每天加 1 道稍难变式题。`;
  } else if (accuracy < 60) {
    difficultyFit = `难度略高：正确率 ${accuracy}%，先减少新题压力，把错题背后的概念讲透。`;
  }

  let issueType = "暂无判断：还没有完成诊断题。";
  if (answeredCount && accuracy >= 85) {
    issueType = "可以拔高：基础题完成顺利，需要更多解释理由、综合应用和挑战题。";
  } else if (answeredCount && accuracy < 55) {
    issueType = `概念不清：重点先补 ${plannedSkills}，AI 需要先讲概念，再让孩子复述。`;
  } else if (answeredCount && average < 65) {
    issueType = "理由薄弱：能做一部分题，但需要练“关键词 -> 证据 -> 结论”的说明过程。";
  } else if (answeredCount) {
    issueType = "稳定巩固：继续练变式题，避免只会熟悉题型。";
  }

  let nextAction = "明天先完成诊断题，再根据正确率自动调整学习计划。";
  if (issueType.includes("可以拔高")) {
    nextAction = `明天建议完成 ${targetQuestions + 2} 题，难度设为挑战拔高，并要求每题写一句理由。`;
  } else if (issueType.includes("概念不清")) {
    nextAction = `明天建议完成 ${Math.max(4, targetQuestions - 2)} 题，难度设为稳扎稳打，先补 1 个核心知识点。`;
  } else if (issueType.includes("理由薄弱")) {
    nextAction = `明天保持 ${targetQuestions} 题，难度自动调整，每题都让孩子写出关键词和理由。`;
  } else if (answeredCount) {
    nextAction = `明天保持 ${targetQuestions} 题和当前难度，加入 1 道挑战题检查迁移能力。`;
  }

  return { accuracy, difficultyFit, issueType, nextAction };
}

function buildReport() {
  const diagnostic = activeDiagnostic();
  const student = activeStudent();
  const subject = activeSubject();
  const questions = activeQuestions();
  const answered = questions.filter((_, index) => state.selectedAnswers[index] !== undefined);
  const correctCount = questions.filter((question, index) => state.selectedAnswers[index] === question.correct).length;
  questions.forEach((question, index) => {
    const selectedIndex = state.selectedAnswers[index];
    if (selectedIndex === undefined) {
      recordMistake(question, selectedIndex, "未作答");
    } else if (selectedIndex !== question.correct) {
      recordMistake(question, selectedIndex, "答错");
    }
  });
  const reportMistakes = mistakesForStudent(student.id).filter((item) => item.subjectId === state.subject);
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
  const insights = buildLearningInsights({
    average,
    answeredCount: answered.length,
    correctCount,
    questions,
    plan,
  });
  const targetQuestions = planForStudent(student.id).questionTarget || 8;

  state.reportReady = true;
  const record = {
    id: crypto.randomUUID(),
    date: new Date().toLocaleString("zh-CN", { dateStyle: "medium", timeStyle: "short" }),
    createdAt: new Date().toISOString(),
    student: student.name,
    grade: state.grade,
    subject: subject.label,
    score: average,
    weak: weak.map(([skill]) => skill),
    next: plan.map(([skill]) => skill),
    answered: answered.length,
    correct: correctCount,
    accuracy: insights.accuracy,
    difficultyFit: insights.difficultyFit,
    issueType: insights.issueType,
    nextAction: insights.nextAction,
    guidedMasteryCount: guidedMasteryCount(student.id),
    challengeProofCount: challengeProofSummary(student.id).total,
    mistakes: reportMistakes.map((item) => ({
      skill: item.skill,
      prompt: item.prompt,
      attempts: item.attempts,
      reason: item.reason,
    })),
  };
  state.records.unshift(record);
  state.records = state.records.slice(0, 20);
  saveData();
  $("reportStatus").textContent = "已生成";
  $("overallScore").textContent = `${average}%`;
  $("overallNote").textContent = `${insights.issueType} ${insights.difficultyFit}`;
  $("weaknessList").innerHTML = weak
    .map(([skill, score]) => `<li><strong>${skill}</strong>：当前 ${score}%，建议用讲解 + 变式题巩固。</li>`)
    .join("");
  $("studyPlan").innerHTML = plan
    .map(([skill], index) => `<li>第 ${index + 1} 天：学习 ${skill}，完成 ${targetQuestions} 道练习题，并用自己的话总结方法。</li>`)
    .join("");
  $("difficultyFit").textContent = insights.difficultyFit;
  $("issueType").textContent = insights.issueType;
  $("nextAction").textContent = insights.nextAction;
  $("reportMistakes").innerHTML = reportMistakes.length
    ? reportMistakes
        .slice(0, 5)
        .map((item) => `<li><strong>${item.skill}</strong>：${item.reason}，累计 ${item.attempts || 1} 次。明天优先复习这类题。</li>`)
        .join("")
    : "<li>暂无错题记录。</li>";
  renderChallengeProofSummary(student.id);

  renderEmail(average, weak, plan, insights, reportMistakes);
  renderActivity();
  renderWeeklyTrend();
  renderCoach();
  switchView("report");
  saveReportToCloud(record, $("goalSelect").value).catch((error) => {
    console.error(error);
    $("cloudStatus").textContent = "云端同步失败";
  });
}

function renderCoach() {
  const diagnostic = activeDiagnostic();
  const question = activeQuestions()[state.currentQuestion];
  state.chatHistory = [
    {
      role: "coach",
      text: "我们先不急着选答案。第一步，请你用自己的话说：这道题真正问的是什么？",
    },
    {
      role: "coach",
      text: question?.prompt || diagnostic.prompt,
    },
    {
      role: "coach",
      text: `这题主要练习：${question?.skill || diagnostic.skills[0][0]}。我会提示你思路，但不会直接报答案。`,
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

function appendInlineCoach(role, text) {
  state.inlineCoachHistory.push({ role, text });
  renderInlineCoachPanel();
}

function sanitizeCoachSupplement(text = "", history = [], question = activeQuestions()[state.currentQuestion]) {
  const raw = String(text || "").trim();
  const recentStudent = [...history].reverse().find((message) => message.role === "student")?.text || "";
  const tooLong = raw.length > 180;
  const repeatsMetaQuestion =
    /题目.*问什么|问题.*问.*什么|先说.*题目|describe.*question|what.*question/i.test(raw)
    && /不知道|不会|不懂|打不出来|说不出来|写不出来|知识点没吃透|没思路|idk|stuck/i.test(recentStudent);
  if (tooLong || repeatsMetaQuestion) {
    const gap = coachingGapForReply(recentStudent);
    const reason = tooLong ? "AI 补充太长" : "重复追问题目";
    return `${reason}，我先压缩成一小步：${localOneStepCoachPrompt(gap, question)}`;
  }
  return raw;
}

function appendCoachSupplement(history, text) {
  const supplement = `AI 补充：${sanitizeCoachSupplement(text, history)}`;
  if (history === state.inlineCoachHistory) {
    appendInlineCoach("coach", supplement);
  } else {
    appendChat("coach", supplement);
  }
}

function mistakesForCurrentSkill(question = activeQuestions()[state.currentQuestion]) {
  const skill = question?.skill || activeDiagnostic().skills[0][0];
  return mistakesForStudent()
    .filter((item) => item.subjectId === state.subject && item.skill === skill)
    .slice(0, 3);
}

function sameSkillMistakeSummary(question = activeQuestions()[state.currentQuestion]) {
  return mistakesForCurrentSkill(question).map((item) => ({
    skill: item.skill,
    prompt: item.prompt,
    reason: item.reason,
    attempts: item.attempts || 1,
    selectedAnswer: item.selectedAnswer,
  }));
}

function coachingGapForReply(studentReply = "") {
  const text = String(studentReply || "").trim().toLowerCase();
  const quality = evaluateGuidanceReplyQuality(studentReply);
  const questionConfusion = /题目.*(问什么|什么意思|看不懂)|问题.*(问什么|什么意思)|不懂.*(题|问题).*问什么|看不懂.*题|what.*question|question.*ask/.test(text);
  const methodConfusion = /第一步|先看什么|怎么开始|从哪|不知道.*步骤|不知道.*方法|first step|where.*start/.test(text);
  const reasonConfusion = /为什么|原因|because|why|不知道.*解释|说不出.*理由/.test(text);
  const conceptConfusion = /知识点|概念|没学过|没吃透|前置|打不出来|写不出来|说不出来|完全不会|不明白|confused/.test(text);
  if (/^[a-d]$|^选\s*[a-d]$|^choose\s*[a-d]$/i.test(text)) {
    return { label: "只写了答案", next: "先不选答案，先说第一步看什么。" };
  }
  if (!text) {
    return { label: "还没形成第一步", next: "先照老师示范句，说出题目真正问什么。" };
  }
  if (quality.asksForHelp && reasonConfusion) return { label: "原因说不出", next: "只补一句为什么这一步有用。" };
  if (quality.asksForHelp && methodConfusion) return { label: "第一步不会选", next: "只选第一步动作，不用完整解释。" };
  if (quality.asksForHelp && questionConfusion) return { label: "题意没拆开", next: "先把题目翻译成一句话。" };
  if (quality.asksForHelp && conceptConfusion) return { label: "概念没接上", next: "先补前置概念，再做半句填空。" };
  if (quality.asksForHelp) return { label: "还没形成第一步", next: "先照老师示范句，说出题目真正问什么。" };
  if (!quality.questionGoal) return { label: "题目目标不清楚", next: "补一句：这题要我判断什么。" };
  if (!quality.methodStep) return { label: "方法步骤不清楚", next: "补一句：我第一步先看什么。" };
  if (!quality.reasonWhy) return { label: "原因说明不完整", next: "补一句：为什么这一步有用。" };
  if (!quality.enoughDetail) return { label: "表达太短", next: "把题目目标、第一步和原因连成一句完整方法。" };
  return { label: "需要更精确", next: "把关键词、条件或证据说具体一点。" };
}

function localGapSentenceFrame(gap = coachingGapForReply(), question = activeQuestions()[state.currentQuestion]) {
  const skill = question?.skill || activeDiagnostic().skills[0][0];
  const hint = coachingHintForTurn(question, 0) || question?.coachHints?.[0] || "题目里的关键词或条件";
  const frames = {
    "只写了答案": `这题考的是 ${skill}。我第一步先看____，因为____。`,
    "还没形成第一步": `这题要我判断____。我可以先看 ${hint}。`,
    "题意没拆开": `这题要我判断____。题目里的____是在提醒我。`,
    "概念没接上": `先记住：${skill} 是____。这题要我判断____。`,
    "第一步不会选": `我第一步先看 ${hint}。`,
    "原因说不出": "因为这一步能帮我____，所以不能只凭感觉选。",
    "题目目标不清楚": `这题要我判断 ${skill} 里的____。`,
    "方法步骤不清楚": `我第一步先看 ${hint}，再判断____。`,
    "原因说明不完整": "因为这一步能帮我____，所以不能只凭感觉选。",
    "表达太短": "具体来说，题目里的____说明我的方法应该是____。",
    "需要更精确": "我还要点出题目里的关键词：____，它说明____。",
  };
  return frames[gap.label] || "这题要我判断____。我第一步先看____，因为____。";
}

function localStuckGapTeachingAction(gap = coachingGapForReply(), question = activeQuestions()[state.currentQuestion]) {
  if (gap.label === "题意没拆开") {
    return `卡点判断：${gap.label}。先把题目翻译成一句话。小讲解：${localStudentFriendlyConceptLine(question)} 现在只做一小步：${localGapSentenceFrame(gap, question)}`;
  }
  if (gap.label === "概念没接上") {
    return `卡点判断：${gap.label}。这不是写作问题，先补前置概念。小讲解：${localStudentFriendlyConceptLine(question)} 现在只做一小步：半句填空：这题要我判断____。`;
  }
  if (gap.label === "第一步不会选") {
    return `卡点判断：${gap.label}。只选第一步动作。小讲解：${localStudentFriendlyConceptLine(question)} 现在只做一小步：${localGapSentenceFrame(gap, question)}`;
  }
  if (gap.label === "原因说不出") {
    return `卡点判断：${gap.label}。只补因为。想一想这一步帮你找到什么线索：${localGapSentenceFrame(gap, question)}`;
  }
  return "";
}

function localOneStepCoachPrompt(gap = coachingGapForReply(), question = activeQuestions()[state.currentQuestion]) {
  return `我看到你现在缺的是：${gap.label}。${gap.next} 只补这一句：${localGapSentenceFrame(gap, question)}`;
}

function localStudentFriendlyConceptLine(question = activeQuestions()[state.currentQuestion]) {
  // 不要把英文解析原句直接给孩子，卡住时先给一条中文短概念。
  const skill = question?.skill || activeDiagnostic().skills[0][0];
  const text = `${skill} ${activeSubject().label} ${question?.explanation || ""}`.toLowerCase();
  if (/slope|rate|linear|斜率|变化率|函数|比例/.test(text)) return "斜率就是看 y 相对 x 怎么变，不能只看数字大小。";
  if (/evidence|claim|central|reading|english|rla|证据|主张|中心|作者/.test(text)) return "证据要支持观点，先找观点，再看证据是否直接相关。";
  if (/equation|algebra|方程|代数|表达式|逆运算/.test(text)) return "方程题先看未知数被做了什么运算，再用相反运算解开。";
  if (/experiment|variable|science|biology|实验|变量|数据|科学|生物/.test(text)) return "科学题先分清改变什么、测量什么，再看数据支持什么结论。";
  if (/geometry|triangle|proof|几何|三角形|证明|角/.test(text)) return "几何题先找已知边角关系，再判断能支持哪一步证明。";
  return `${skill} 要先分清题目目标和第一步线索。`;
}

function coachHistoryAlreadyUsed(history = [], pattern) {
  return history.some((message) => message.role === "coach" && pattern.test(String(message.text || "")));
}

async function askAiCoach(studentReply, history = state.chatHistory) {
  const question = activeQuestions()[state.currentQuestion];
  const payload = {
    studentName: activeStudent().name,
    grade: state.grade,
    subject: activeSubject().label,
    question: question?.prompt,
    answers: question?.answers || [],
    skill: question?.skill || activeDiagnostic().skills[0][0],
    explanation: question?.explanation || "",
    coachHints: question?.coachHints || [],
    layeredHints: [question?.aiHintLevel1, question?.aiHintLevel2, question?.aiHintLevel3].filter(Boolean),
    commonMistakes: question?.commonMistakes || [],
    recentSkillMistakes: sameSkillMistakeSummary(question),
    studentReply,
    history,
  };

  return postCoachPayload(payload, COACH_RESPONSE_TIMEOUT_MS);
}

async function postCoachPayload(payload, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch("/api/coach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error("AI coach request failed");
    return response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("AI 较慢，先使用本地引导。");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function askMasteryEvaluation(variantReply) {
  const question = activeQuestions()[state.currentQuestion];
  const payload = {
    mode: "mastery_evaluation",
    studentName: activeStudent().name,
    grade: state.grade,
    subject: activeSubject().label,
    question: question?.prompt,
    skill: question?.skill || activeDiagnostic().skills[0][0],
    explanation: question?.explanation || "",
    expectedMethod: state.guidanceLock?.variant?.expectedMethod || question?.explanation || "",
    variantReply,
    history: state.inlineCoachHistory,
  };

  return postCoachPayload(payload, MASTERY_RESPONSE_TIMEOUT_MS);
}

function buildLocalCoachReply(studentReply, history = state.chatHistory, question = activeQuestions()[state.currentQuestion]) {
  const rawReply = String(studentReply || "").trim();
  const reply = rawReply.toLowerCase();
  const studentTurns = history.filter((message) => message.role === "student").length;
  const coachTurns = history.filter((message) => message.role === "coach").length;
  const hintTurn = Math.max(0, Math.min(2, Math.max(studentTurns - 1, coachTurns - 1)));
  const hints = question?.coachHints || [];
  const recentSkillMistakes = mistakesForCurrentSkill(question);
  const mistakePrefix = recentSkillMistakes.length
    ? `你之前在同类题上卡过 ${recentSkillMistakes[0].attempts || 1} 次，`
    : "";
  const lesson = conceptMiniLesson(question);
  const gap = coachingGapForReply(rawReply);
  const repeatedAnswerPrompt = coachHistoryAlreadyUsed(history, /第一步看____|只写了答案|答案字母/);
  const repeatedReasonPrompt = coachHistoryAlreadyUsed(history, /原因说明不完整|为什么这一步|用这句补完整/);

  if (/^[a-d]$|^选\s*[a-d]$|^choose\s*[a-d]$/i.test(rawReply)) {
    return {
      reply: repeatedAnswerPrompt
        ? `${mistakePrefix}我们不重复刚才那句，直接做微练习：${localGapSentenceFrame(gap, question)}`
        : `${mistakePrefix}${localOneStepCoachPrompt(gap, question)}`,
    };
  }

  if (reply.length < 8 || /不知道|不会|不懂|打不出来|说不出来|写不出来|知识点没吃透|idk/.test(reply)) {
    const stuckAction = localStuckGapTeachingAction(gap, question);
    return {
      reply: `${mistakePrefix}${stuckAction || `卡点判断：${gap.label}。小讲解：${localStudentFriendlyConceptLine(question)} 小例子：${teachingMiniExampleForSkill(question?.skill || "")} 现在只做一小步：${localGapSentenceFrame(gap, question)}`}`,
    };
  }

  if (studentTurns <= 1) {
    return {
      reply: repeatedReasonPrompt
        ? `${mistakePrefix}不重复上一句，换成更小一步：${localGapSentenceFrame({ label: "原因说明不完整" }, question)}`
        : `${mistakePrefix}${coachingHintForTurn(question, 1) || hints[0] || ""} ${localOneStepCoachPrompt(gap, question)}`,
    };
  }

  if (studentTurns === 2) {
    return {
      reply: `我看到你现在缺的是：${gap.label}。${coachingHintForTurn(question, 2) || hints[1] || gap.next} 现在先排除一个不合理想法，并说出理由。`,
    };
  }

  if (studentTurns === 3) {
    return {
      reply: "现在请你写一句完整理由：因为题目问的是____，所以我选择____。先写理由，再最后选答案。",
    };
  }

  return {
    reply: `你的思路已经接近完成。最后检查一次：这个答案是否直接回应了“${question?.skill || "这个知识点"}”？如果是，请用一句话总结方法。`,
  };
}

function renderEmail(average = "--", weak = [], plan = [], insights = null, mistakes = []) {
  const student = activeStudent();
  const subject = activeSubject();
  const weakText = weak.length ? weak.map(([skill]) => skill).join("、") : "等待诊断生成";
  const planText = plan.length ? plan.map(([skill]) => skill).join("、") : "完成诊断后自动生成";
  const difficultyText = insights?.difficultyFit || "等待诊断生成";
  const issueText = insights?.issueType || "等待诊断生成";
  const nextText = insights?.nextAction || "完成诊断后自动生成";
  const mistakeText = mistakes.length
    ? mistakes.slice(0, 3).map((item) => `${item.skill}（${item.attempts || 1} 次）`).join("、")
    : "暂无待复习错题";

  $("emailPreview").innerHTML = `
    <p><strong>主题：</strong>${student.name} 今日学习报告 - ${subject.label}</p>
    <p>今天完成了 ${subject.label} 的诊断练习，当前综合掌握度为 <strong>${average}</strong>。</p>
    <p><strong>主要薄弱点：</strong>${weakText}</p>
    <p><strong>难度是否合适：</strong>${difficultyText}</p>
    <p><strong>主要问题：</strong>${issueText}</p>
    <p><strong>错题复习：</strong>${mistakeText}</p>
    <p><strong>明日建议：</strong>${planText}</p>
    <p><strong>明日调整：</strong>${nextText}</p>
    <p>辅导方式将继续采用提问引导：先让孩子解释题意，再提示关键概念，最后让孩子自己完成答案和总结。</p>
  `;
}

function parentDigestEmailAddress() {
  if (state.authProfile?.role === "parent" && state.authSession?.user?.email) return state.authSession.user.email;
  return "linbinmail@gmail.com";
}

function parentDigestMailtoUrl() {
  const student = activeStudent();
  const subject = `${student.name} 今日学习报告`;
  const body = $("emailPreview")?.innerText || "请先生成今日总结。";
  return `mailto:${encodeURIComponent(parentDigestEmailAddress())}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

async function sendParentDigestEmail() {
  const body = $("emailPreview")?.innerText.trim();
  if (!body) {
    $("cloudStatus").textContent = "请先生成日报";
    return false;
  }

  const student = activeStudent();
  const response = await fetch("/api/digest-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: parentDigestEmailAddress(),
      subject: `${student.name} 今日学习报告`,
      body,
    }),
  });

  if (!response.ok) throw new Error("Digest email provider unavailable");
  $("cloudStatus").textContent = "日报邮件已发送";
  return true;
}

function recordTimestamp(record) {
  if (record.createdAt) return Date.parse(record.createdAt);
  if (record.date) {
    const parsed = Date.parse(record.date);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return Date.now();
}

function isWithinLastWeek(timestamp) {
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  return Date.now() - timestamp <= oneWeek;
}

function topMistakeSkills(items) {
  const counts = new Map();
  items.forEach((item) => counts.set(item.skill, (counts.get(item.skill) || 0) + (item.attempts || 1)));
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
}

function buildWeeklyTrend(studentId = state.studentId) {
  const student = students.find((item) => item.id === studentId) || activeStudent();
  const weeklyRecords = state.records.filter((record) => {
    return record.student === student.name && isWithinLastWeek(recordTimestamp(record));
  });
  const weeklySessions = state.practiceSessions.filter((session) => {
    const timestamp = session.startedAt ? Date.parse(session.startedAt) : Date.now();
    return session.studentId === studentId && isWithinLastWeek(timestamp);
  });
  const weeklyMistakes = state.mistakeLog.filter((item) => {
    const timestamp = item.lastMissedIso ? Date.parse(item.lastMissedIso) : Date.now();
    return item.studentId === studentId && isWithinLastWeek(timestamp);
  });
  const averageScore = weeklyRecords.length
    ? Math.round(weeklyRecords.reduce((sum, record) => sum + (record.score || 0), 0) / weeklyRecords.length)
    : 0;
  const sessionQuestions = weeklySessions.reduce((sum, session) => sum + (session.questionsAnswered || 0), 0);
  const sessionCorrect = weeklySessions.reduce((sum, session) => sum + (session.correctCount || 0), 0);
  const completedQuestions = sessionQuestions || weeklyRecords.reduce((sum, record) => sum + (record.answered || 0), 0);
  const correctQuestions = sessionQuestions ? sessionCorrect : weeklyRecords.reduce((sum, record) => sum + (record.correct || 0), 0);
  const accuracy = completedQuestions ? Math.round((correctQuestions / completedQuestions) * 100) : 0;
  const hintsUsed = weeklySessions.reduce((sum, session) => sum + (session.hintsUsed || 0), 0);
  const slowCount = weeklySessions.reduce((sum, session) => sum + (session.slowCount || 0), 0);
  const guessingCount = weeklySessions.reduce((sum, session) => sum + (session.guessingCount || 0), 0);
  const frequentMistakes = topMistakeSkills(weeklyMistakes);
  const weakestSkill = frequentMistakes[0]?.[0] || weeklyRecords.find((record) => record.weak?.length)?.weak?.[0] || "";

  let nextPlan = "本周数据还不够，建议先完成 2 次诊断，系统再给出更稳定的下周计划。";
  if (guessingCount >= 2) {
    nextPlan = "下周先降低速度要求，每题必须写一句理由后再提交，减少靠排除法猜题。";
  } else if (slowCount >= 2) {
    nextPlan = "下周先做基础讲解和例题，再做限时练习，帮助孩子把慢掌握变成稳定掌握。";
  } else if ((weeklyRecords.length >= 2 || weeklySessions.length >= 2) && accuracy >= 80 && frequentMistakes.length <= 1) {
    nextPlan = "下周可以保持当前题量，并加入挑战题；重点训练解释理由和综合应用。";
  } else if ((weeklyRecords.length || weeklySessions.length) && weakestSkill) {
    nextPlan = `下周优先复习 ${weakestSkill}，题量保持稳定，AI 先讲概念再让孩子复述。`;
  } else if (weeklyRecords.length || weeklySessions.length) {
    nextPlan = "下周保持当前学习节奏，每次诊断后做 1 次错题复盘。";
  }

  return {
    studentName: student.name,
    sessions: Math.max(weeklyRecords.length, weeklySessions.length),
    averageScore,
    accuracy,
    completedQuestions,
    hintsUsed,
    slowCount,
    guessingCount,
    frequentMistakes,
    nextPlan,
  };
}

function renderWeeklyTrend() {
  const trend = buildWeeklyTrend(state.studentId);
  const weeklyTitle = "本周学习趋势";
  const frequentMistakeTitle = "高频错题知识点";
  $("weeklyStats").innerHTML = `
    <div><strong>${trend.sessions}</strong><span>本周学习次数</span></div>
    <div><strong>${trend.averageScore || "--"}${trend.averageScore ? "%" : ""}</strong><span>平均掌握度</span></div>
    <div><strong>${trend.accuracy || "--"}${trend.accuracy ? "%" : ""}</strong><span>本周正确率</span></div>
    <div><strong>${trend.completedQuestions}</strong><span>完成题目</span></div>
    <div><strong>${trend.hintsUsed}</strong><span>提示使用</span></div>
    <div><strong>${trend.slowCount}</strong><span>慢掌握</span></div>
    <div><strong>${trend.guessingCount}</strong><span>可能猜题</span></div>
  `;
  $("weeklyMistakes").innerHTML = trend.frequentMistakes.length
    ? trend.frequentMistakes.map(([skill, count]) => `<li><strong>${skill}</strong>：本周累计 ${count} 次，需要优先复习。</li>`).join("")
    : `<li>${weeklyTitle}暂无${frequentMistakeTitle}。</li>`;
  $("weeklyNextPlan").textContent = trend.nextPlan;
}

function renderParentDashboardSummary() {
  const student = activeStudent();
  const plan = planForStudent(student.id);
  const tasks = buildDailyTasks(student);
  const completion = todayCompletionState(tasks);
  const mistakes = mistakesForStudent(student.id);
  const session = todayPracticeSessionSummary(student.id);
  const proofSummary = challengeProofSummary(student.id);
  const weakSkills = [...new Set(weakSkillMasteryItems(student.id).map((item) => item.skill).concat(topMistakeSkills(mistakes).map(([skill]) => skill)))];
  const estimatedMinutes = session.minutes || Math.round((plan.minutes || 30) * (completion.percent / 100));
  $("parentTodayTime").textContent = `${estimatedMinutes}/${plan.minutes} 分钟`;
  $("parentCompletedTasks").textContent = `${completion.completed}/${completion.total}`;
  $("parentMistakeCount").textContent = `${mistakes.length}`;
  $("parentRecommendation").textContent = weakSkills.length
    ? `复习 ${weakSkills[0]}；今日正确率 ${session.accuracy || "--"}%，提示 ${session.hints || 0} 次。`
    : `保持今日计划；今日正确率 ${session.accuracy || "--"}%。`;
  renderParentChallengeProofSummary(proofSummary);
}

function renderParentChallengeProofSummary(summary = challengeProofSummary(state.studentId)) {
  const target = $("parentChallengeProofSummary");
  if (!target) return;
  target.textContent = summary.total
    ? `${summary.total} 个 · 深度 ${summary.schoolDepth} · 解释 ${summary.explanation}`
    : "暂无";
}

function renderQuestionQualityAudit() {
  const audit = buildQuestionQualityAudit();
  const totalSubjects = audit.coverage.length;
  const readySubjects = audit.coverage.filter((subject) => subject.meetsCount && subject.meetsAdvanced && subject.meetsQuality).length;
  const totalQuestions = audit.coverage.reduce((sum, subject) => sum + subject.questionCount, 0);
  const averageQuality = totalSubjects
    ? Math.round(audit.coverage.reduce((sum, subject) => sum + subject.averageQuality, 0) / totalSubjects)
    : 0;
  const weakSubjects = audit.weakSubjects;

  $("questionQualityStatus").textContent = audit.ready ? "题库质量达标" : `需要补强 ${weakSubjects.length} 科`;
  $("twoHourBankTarget").innerHTML = `
    <strong>2 小时学习目标</strong>
    每天约 ${audit.expansionTarget.dailyMinutes} 分钟，需要每科至少 ${audit.expansionTarget.minimumBankQuestionsPerSubject} 道高质量题，
    其中挑战题不少于 ${audit.expansionTarget.minimumChallengeQuestions} 道，开放解释/多步推理不少于 ${audit.expansionTarget.minimumOpenResponseTasks} 道。
    当前达到 2 小时题库规模的科目：${audit.twoHourReadiness}/${totalSubjects}。
  `;
  $("questionQualityStats").innerHTML = `
    <div><strong>${readySubjects}/${totalSubjects}</strong><span>达标科目</span></div>
    <div><strong>${averageQuality}%</strong><span>平均质量分</span></div>
    <div><strong>${totalQuestions}</strong><span>重点题目数</span></div>
    <div><strong>${weakSubjects.length}</strong><span>待补强科目</span></div>
  `;
  $("questionQualitySubjects").innerHTML = audit.coverage
    .map((subject) => {
      const label = subjectById(subject.subjectId)?.label || subject.subjectId;
      const scaleGap = audit.scaleGaps.find((item) => item.subjectId === subject.subjectId) || bankScaleGap(subject.subjectId);
      const gaps = [];
      if (!subject.meetsCount) gaps.push(`题量 ${subject.questionCount}/${subject.target.minimumQuestions}`);
      if (!subject.meetsAdvanced) gaps.push(`进阶题 ${subject.advancedCount}/${subject.target.minimumAdvancedQuestions}`);
      if (!subject.meetsQuality) gaps.push(`质量分 ${subject.averageQuality}/80`);
      if (!scaleGap.readyForTwoHours) {
        gaps.push(`2小时规模缺 ${scaleGap.questionGap} 题、${scaleGap.challengeGap} 挑战题、${scaleGap.openResponseGap} 解释题`);
      }
      const status = gaps.length ? "需要补强" : "达标";
      return `
        <article class="quality-subject ${gaps.length ? "needs-work" : "ready"}">
          <div>
            <strong>${label}</strong>
            <span>${status}</span>
          </div>
          <p>题量 ${subject.questionCount}；进阶 ${subject.advancedCount}；质量 ${subject.averageQuality}%</p>
          <div class="progress"><span style="width:${Math.min(100, subject.averageQuality)}%"></span></div>
          <small>${gaps.length ? gaps.join("；") : "可继续加入更高阶综合题。"}</small>
        </article>
      `;
    })
    .join("");
  $("questionQualityNextSteps").innerHTML = weakSubjects.length
    ? weakSubjects
        .slice(0, 4)
        .map((subject) => {
          const label = subjectById(subject.subjectId)?.label || subject.subjectId;
          const action = !subject.meetsCount
            ? "先补足基础和中等题量"
            : !subject.meetsAdvanced
              ? "补 1-2 道挑战题"
              : "加强讲解、提示和干扰项质量";
          return `<li><strong>${label}</strong>：${action}。</li>`;
        })
        .join("")
    : "<li>重点科目已达到当前质量门槛，下一步可以增加学校考试同等难度的综合题。</li>";
}

function studentAchievementBadges(studentId = state.studentId) {
  const masteryItems = Object.values(state.skillMastery).filter((item) => item.studentId === studentId);
  const masteredCount = masteryItems.filter((item) => item.status === "mastered" || item.mastery >= 82).length;
  const reviewedCount = masteryItems.reduce((sum, item) => sum + (item.reviewCount || 0), 0);
  const session = todayPracticeSessionSummary(studentId);
  const mistakePackCount = mistakesForStudent(studentId).length;
  return [
    {
      title: "Steady Starter",
      earned: session.answered >= 1,
      note: session.answered >= 1 ? "今天已经开始学习" : "完成今天第一题",
    },
    {
      title: "Mistake Fixer",
      earned: reviewedCount >= 1,
      note: reviewedCount >= 1 ? `已复盘 ${reviewedCount} 次` : "完成一次错题复盘",
    },
    {
      title: "Skill Master",
      earned: masteredCount >= 1,
      note: masteredCount >= 1 ? `掌握 ${masteredCount} 个技能点` : "把一个技能点提升到 Mastered",
    },
    {
      title: "Focus Builder",
      earned: session.hints <= 2 && session.answered >= 5,
      note: session.answered >= 5 ? `提示 ${session.hints} 次` : "完成 5 题并少用提示",
    },
    {
      title: "Challenge Ready",
      earned: session.accuracy >= 80 && session.answered >= 8,
      note: session.answered >= 8 ? `正确率 ${session.accuracy}%` : "完成 8 题且正确率 80%+",
    },
    {
      title: "Review Queue Clear",
      earned: mistakePackCount === 0 && session.answered > 0,
      note: mistakePackCount ? `还有 ${mistakePackCount} 条待复习` : "暂无待复习错题",
    },
  ];
}

function weeklyChallengeForStudent(studentId = state.studentId) {
  const session = todayPracticeSessionSummary(studentId);
  const weakSkill = weakSkillMasteryItems(studentId)[0]?.skill || mistakesForStudent(studentId)[0]?.skill || activeDiagnostic().skills[0][0];
  const target = Math.max(8, Math.min(24, planForStudent(studentId).questionTarget || 8));
  const progress = Math.min(100, Math.round((session.answered / target) * 100));
  return {
    text: `本周挑战：围绕 ${weakSkill} 完成 ${target} 题，并把每道错题写出第一步和原因。当前 ${session.answered}/${target} 题。`,
    progress,
  };
}

function renderStudentAchievements() {
  const badgeGrid = $("studentBadgeGrid");
  if (!badgeGrid) return;
  badgeGrid.innerHTML = studentAchievementBadges(state.studentId)
    .map(
      (badge) => `
        <article class="achievement-badge ${badge.earned ? "earned" : "locked"}">
          <strong>${badge.earned ? "已获得" : "未解锁"} · ${badge.title}</strong>
          <span>${badge.note}</span>
        </article>
      `
    )
    .join("");
  const challenge = weeklyChallengeForStudent(state.studentId);
  $("weeklyChallengeText").textContent = challenge.text;
  $("weeklyChallengeProgress").style.width = `${challenge.progress}%`;
}

function speechRecognitionFactory() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function startVoiceInput(targetId, statusId) {
  const Recognition = speechRecognitionFactory();
  const target = $(targetId);
  const status = $(statusId);
  if (!Recognition || !target) {
    if (status) status.textContent = "当前浏览器不支持语音输入，请继续打字。";
    return;
  }
  const recognition = new Recognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  if (status) status.textContent = "正在听，请说出你的思路...";
  recognition.onresult = (event) => {
    const transcript = event.results?.[0]?.[0]?.transcript || "";
    target.value = [target.value, transcript].filter(Boolean).join(" ").trim();
    target.dispatchEvent(new Event("input", { bubbles: true }));
    if (status) status.textContent = "已填入语音内容，可以继续修改后提交。";
  };
  recognition.onerror = () => {
    if (status) status.textContent = "语音没有识别成功，请再试一次或打字。";
  };
  recognition.onend = () => {
    if (status?.textContent.includes("正在听")) status.textContent = "语音已结束，可以检查文字。";
  };
  recognition.start();
}

async function renderProductionReadiness() {
  const list = $("productionReadinessList");
  const status = $("productionReadinessStatus");
  if (!list || !status) return;
  status.textContent = "检查中";
  list.innerHTML = `
    <article class="readiness-item"><strong>正在检查</strong><span>系统会检查云端数据表和邮件服务。</span></article>
  `;

  const [systemStatus, masteryStatus, practiceStatus] = await Promise.all([
    loadSystemStatus(),
    checkCloudTable("skill_mastery"),
    checkCloudTable("practice_sessions"),
  ]);
  const requiredScripts = systemStatus.requiredSupabaseScripts || ["000_run_all_learning_platform.sql"];
  const items = [
    {
      title: "一键数据库脚本",
      ready: requiredScripts.includes("000_run_all_learning_platform.sql"),
      note: "Supabase SQL Editor 运行 supabase/000_run_all_learning_platform.sql",
    },
    {
      title: "知识点掌握度云端表",
      ready: masteryStatus.ready,
      note: masteryStatus.ready ? "孩子的掌握度可长期保存" : "运行 supabase/010_skill_mastery.sql",
    },
    {
      title: "学习行为云端表",
      ready: practiceStatus.ready,
      note: practiceStatus.ready ? "用时、提示、正确率可长期保存" : "运行 supabase/011_practice_sessions.sql",
    },
    {
      title: "完整学习闭环表",
      ready: requiredScripts.includes("012_learning_closure_tables.sql"),
      note: "包含今日计划、错题本、掌握记录、家长报告等正式表结构",
    },
    {
      title: "标准学习 API",
      ready: systemStatus.learningApiConfigured,
      note: systemStatus.learningApiConfigured
        ? "今日计划、答题提交、错题复习、掌握报告接口已启用"
        : "需要检查 Vercel API 部署",
    },
    {
      title: "自动日报邮件",
      ready: systemStatus.emailConfigured,
      note: systemStatus.emailConfigured ? "已配置自动发送" : "未配置 RESEND_API_KEY，会打开邮件草稿",
    },
    {
      title: "发件人域名",
      ready: systemStatus.digestEmailFromConfigured,
      note: systemStatus.digestEmailFromConfigured ? "已配置发件人" : "可先测试，正式发送建议配置 DIGEST_EMAIL_FROM",
    },
    {
      title: "每日自动日报",
      ready: systemStatus.scheduledDigestConfigured,
      note: systemStatus.scheduledDigestConfigured
        ? "Vercel Cron 可自动发送日报"
        : "配置 RESEND_API_KEY、SUPABASE_SERVICE_ROLE_KEY 和 PARENT_DIGEST_EMAIL 后启用",
    },
    ...((systemStatus.launchChecklist || []).map((item) => ({
      title: `上线验收 · ${item.label}`,
      ready: item.ready,
      note: item.action,
    }))),
  ];

  const readyCount = items.filter((item) => item.ready).length;
  const totalCount = items.length;
  const nextAction = items.find((item) => !item.ready);
  if (nextAction) {
    items.unshift({
      title: "下一步最优先",
      ready: false,
      note: nextAction.note,
    });
  } else {
    items.unshift({
      title: "下一步最优先",
      ready: true,
      note: "核心上线配置已完成，可以让孩子连续使用并观察报告。",
    });
  }

  status.textContent = readyCount === totalCount ? "正式可用" : `${readyCount}/${totalCount} 已准备`;
  list.innerHTML = items
    .map(
      (item) => `
        <article class="readiness-item ${item.ready ? "ready" : "needs-setup"}">
          <strong>${item.ready ? "已完成" : "待设置"} · ${item.title}</strong>
          <span>${item.note}</span>
        </article>
      `
    )
    .join("");
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
          掌握度 ${record.score}%；题目 ${record.correct ?? "--"} / ${record.answered ?? "--"}；薄弱点：${record.weak.length ? record.weak.join("、") : "暂无明显薄弱点"}。${record.issueType ? `<br />${record.issueType}` : ""}
        </li>
      `
    )
    .join("");
}

function switchView(viewName) {
  if (!viewAllowedForRole(viewName)) {
    viewName = state.accountRole === "parent" ? "parent" : "today";
  }
  refreshViewData(viewName);
  document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.view === viewName));
  document.querySelectorAll(".view").forEach((view) => view.classList.remove("active"));
  $(`${viewName}View`).classList.add("active");
}

function refreshViewData(viewName) {
  if (viewName === "today") renderTodayPlan();
  if (viewName === "learningPath") renderLearningPath();
  if (viewName === "diagnostic") renderDiagnostic();
  if (viewName === "mistakes") renderMistakeNotebook();
  if (viewName === "report") {
    renderStudentAchievements();
    renderChallengeProofSummary();
  }
  if (viewName === "coach") renderCoach();
  if (viewName === "parent") renderParentDashboardSummary();
}

function bindEvents() {
  $("authForm").addEventListener("submit", (event) => {
    event.preventDefault();
    signInWithPassword();
  });

  $("signupForm").addEventListener("submit", (event) => {
    event.preventDefault();
    signUp();
  });
  $("showSignupButton").addEventListener("click", showSignupMode);
  $("showLoginButton").addEventListener("click", showLoginMode);
  $("signOutButton").addEventListener("click", signOut);
  $("signupRole").addEventListener("change", renderAuth);

  $("studentList").addEventListener("click", (event) => {
    if (state.accountRole === "student") return;
    const button = event.target.closest("[data-student]");
    if (!button) return;
    state.studentId = button.dataset.student;
    state.grade = activeStudent().grade;
    state.subject = subjects[state.grade][0].id;
    resetDiagnosticProgress();
    saveData();
    renderAll();
    loadCloudQuestions();
  });

  $("gradeSelect").addEventListener("change", (event) => {
    state.grade = event.target.value;
    state.subject = subjects[state.grade][0].id;
    resetDiagnosticProgress();
    saveData();
    renderAll();
    loadCloudQuestions();
  });

  $("subjectSelect").addEventListener("change", (event) => {
    state.subject = event.target.value;
    resetDiagnosticProgress();
    saveData();
    renderAll();
    loadCloudQuestions();
  });

  $("confidenceSelect").addEventListener("change", (event) => {
    state.answerConfidence[questionProgressKey()] = event.target.value;
    saveData();
  });

  $("preAnswerThought").addEventListener("input", (event) => {
    state.preAnswerThoughts[questionProgressKey()] = event.target.value;
    saveData();
    renderPreAnswerGate();
  });

  $("answerGrid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-answer-index]");
    if (!button) return;
    const selectedIndex = Number(button.dataset.answerIndex);
    const questionsAtAnswerTime = activeQuestions();
    const question = questionsAtAnswerTime[state.currentQuestion];
    const progressKey = questionProgressKey();
    const confidence = $("confidenceSelect").value || "sure";
    state.answerConfidence[progressKey] = confidence;
    if (hasActiveGuidanceLock()) {
      $("answerFeedback").textContent = "这题正在引导中。请先完成 AI 引导和变式验证。";
      return;
    }
    const preAnswerThought = state.preAnswerThoughts[progressKey] || "";
    if (requiresPreAnswerThought(question) && state.selectedAnswers[state.currentQuestion] === undefined && !isPreAnswerThoughtReady(preAnswerThought, question)) {
      $("answerFeedback").textContent = "先写一句自己的解题思路，再选择答案。不要只写答案字母。";
      $("preAnswerThought").focus();
      return;
    }
    state.lastAdvanceNotice = "";
    setAnswerSyncStatus("pending", "准备保存记录");
    state.selectedAnswers[state.currentQuestion] = selectedIndex;
    markQuestionAnswered(question);
    const issue = shouldStartGuidance(selectedIndex, question, confidence);
    const adaptiveResult = updateAdaptiveDifficulty(question, selectedIndex);
    const preferredNextIndex = nextAdaptiveQuestionIndex(questionsAtAnswerTime, state.currentQuestion, adaptiveResult);
    const practiceEvent = recordPracticeAttempt(question, selectedIndex, confidence, adaptiveResult);
    syncAnswerSubmitToApi(question, selectedIndex, confidence, practiceEvent);
    if (!issue) {
      updateSkillMastery(question, { correct: true, seconds: practiceEvent.seconds });
      markMistakeReviewed(question);
      advanceToNextQuestionAfterCompletion(state.currentQuestion, "correct", preferredNextIndex);
    } else {
      if (issue !== "school_verification") recordMistake(question, selectedIndex, guidanceIssueText(issue));
      startGuidedMastery(question, selectedIndex, "", confidence, issue);
    }
    saveData();
    renderDiagnostic();
    if (issue) focusGuidancePanel();
    if (adaptiveResult.message) {
      $("dailySuggestion").textContent = `${adaptiveResult.message} 当前目标难度：${difficultyLevels[adaptiveResult.level]}。`;
    }
  });

  $("prevQuestion").addEventListener("click", () => {
    state.lastAdvanceNotice = "";
    state.currentQuestion = Math.max(0, state.currentQuestion - 1);
    renderDiagnostic();
  });

  $("nextQuestion").addEventListener("click", () => {
    if (hasActiveGuidanceLock()) {
      $("answerFeedback").textContent = "请先完成这题的 AI 引导和变式验证，再进入下一题。";
      return;
    }
    state.lastAdvanceNotice = "";
    state.currentQuestion = Math.min(activeQuestions().length - 1, state.currentQuestion + 1);
    renderDiagnostic();
  });

  $("startDiagnosticButton").addEventListener("click", () => switchView("diagnostic"));
  $("continueLearningButton").addEventListener("click", () => switchView("diagnostic"));
  $("reviewMistakesButton").addEventListener("click", () => {
    const firstMistake = mistakesForStudent()[0];
    if (firstMistake?.key) openMistakeReviewLesson(firstMistake.key);
    else switchView("mistakes");
  });
  $("mistakeReviewList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-review-mistake]");
    if (!button) return;
    openMistakeReviewLesson(button.dataset.reviewMistake);
  });
  $("askCoachButton").addEventListener("click", () => switchView("coach"));
  $("inlineVoiceButton").addEventListener("click", () => startVoiceInput("inlineCoachReply", "inlineVoiceStatus"));
  $("coachVoiceButton").addEventListener("click", () => startVoiceInput("studentReply", "coachVoiceStatus"));
  $("learningPathSubjects").addEventListener("click", (event) => {
    const button = event.target.closest("[data-path-subject]");
    if (!button) return;
    state.learningPathSubject = button.dataset.pathSubject;
    saveData();
    renderLearningPath();
  });
  $("learningPathModules").addEventListener("click", (event) => {
    const button = event.target.closest("[data-practice-module]");
    if (!button) return;
    state.subject = button.dataset.practiceModule;
    state.grade = activeStudent().grade;
    resetDiagnosticProgress();
    saveData();
    renderSelectors();
    renderDiagnostic();
    switchView("diagnostic");
    $("answerFeedback").textContent = `现在练习：${button.dataset.practiceSkill}。先独立作答，答错后再进入 AI 引导。`;
  });
  ["mistakeSubjectFilter", "mistakeSkillFilter", "mistakeTypeFilter"].forEach((id) => {
    $(id).addEventListener("change", renderMistakeNotebook);
  });
  $("mistakeNotebookList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-review-mistake]");
    if (!button) return;
    openMistakeReviewLesson(button.dataset.reviewMistake);
  });
  $("practiceHintButton").addEventListener("click", () => {
    const question = activeQuestions()[state.currentQuestion];
    state.hintUsage[questionProgressKey()] = true;
    saveData();
    $("answerFeedback").textContent = question.coachHints?.[0] || "先说题目真正问什么，再圈关键词。";
  });
  $("practiceExplainButton").addEventListener("click", () => {
    if (!state.selectedAnswers[state.currentQuestion] && state.selectedAnswers[state.currentQuestion] !== 0) {
      $("answerFeedback").textContent = "先独立选择一次。讲解会在答错、不确定或提交后出现。";
      return;
    }
    const question = activeQuestions()[state.currentQuestion];
    $("answerFeedback").textContent = question.explanation || "先判断题目类型，再写第一步和原因。";
  });
  $("practiceSimilarButton").addEventListener("click", () => {
    const question = activeQuestions()[state.currentQuestion];
    const similarIndex = activeQuestions().findIndex((item, index) => index !== state.currentQuestion && item.skill === question.skill);
    if (similarIndex >= 0) {
      state.currentQuestion = similarIndex;
      renderDiagnostic();
    } else {
      $("answerFeedback").textContent = "当前题库里同技能题较少，先完成这题后系统会安排变式验证。";
    }
  });
  $("raiseDifficultyButton").addEventListener("click", raiseDifficultyOnDemand);

  $("runDiagnostic").addEventListener("click", buildReport);
  $("finishTodayButton").addEventListener("click", buildReport);

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      if (tab.classList.contains("role-hidden")) return;
      switchView(tab.dataset.view);
    });
  });

  $("chatForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = $("studentReply");
    const reply = input.value.trim();
    if (!reply) return;
    appendChat("student", reply);
    input.value = "";
    const localReply = buildLocalCoachReply(reply, state.chatHistory).reply;
    appendChat("coach", `AI 正在深度检查，我先给你一个提示：${localReply}`);

    askAiCoach(reply, state.chatHistory.slice(0, -1))
      .then((data) => {
        appendCoachSupplement(state.chatHistory, data.reply);
      })
      .catch(() => {
        const fallbackText = `先按这个提示继续：${localReply}`;
        state.chatHistory[state.chatHistory.length - 1].text = fallbackText;
        $("chatWindow").lastElementChild.textContent = fallbackText;
      });
  });

  $("inlineCoachForm").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!hasActiveGuidanceLock()) return;
    const input = $("inlineCoachReply");
    const reply = input.value.trim();
    if (!reply) return;
    const quality = evaluateGuidanceReplyQuality(reply);
    if (state.guidanceLock?.conceptBridgeReady && !quality.ready) {
      continueConceptBridgeSentence(input);
      return;
    }
    if (quality.asksForHelp) {
      rescueIncompleteGuidanceReply(reply, input);
      return;
    }
    if (!quality.ready) {
      rescueIncompleteGuidanceReply(reply, input);
      return;
    }
    appendInlineCoach("student", reply);
    state.guidanceLock.replyDraft = "";
    state.guidanceLock.microChoiceReady = false;
    state.guidanceLock.conceptBridgeReady = false;
    state.guidanceLock.microChoiceNote = "";
    input.value = "";
    renderReplyQuality("");
    const immediateReply = buildLocalCoachReply(reply, state.inlineCoachHistory).reply;
    const canMoveToVariant = shouldMoveToVariantAfterReply(reply);
    if (canMoveToVariant) transitionGuidanceToVariantImmediately(reply, immediateReply);
    else appendInlineCoach("coach", `AI 正在深度检查，我先给你一个提示：${immediateReply}`);
    setGuidanceWaitingAction(immediateReply, canMoveToVariant);

    askAiCoach(reply, state.inlineCoachHistory.slice(0, -1))
      .then((data) => {
        if (!state.guidanceLock) return;
        const teachingMove = buildGuidedTeachingMove(reply, state.guidanceLock);
        if (!canMoveToVariant) state.guidanceLock.teachingTurns = (state.guidanceLock.teachingTurns || 0) + 1;
        if (canMoveToVariant) {
          appendCoachSupplement(state.inlineCoachHistory, `${data.reply} ${teachingMove}`);
        } else {
          appendCoachSupplement(state.inlineCoachHistory, `${data.reply} ${teachingMove}`);
        }
        saveData();
        renderDiagnostic();
        renderGuidanceNextAction();
      })
      .catch(() => {
        if (!state.guidanceLock) return;
        const teachingMove = buildGuidedTeachingMove(reply, state.guidanceLock);
        if (!canMoveToVariant) state.guidanceLock.teachingTurns = (state.guidanceLock.teachingTurns || 0) + 1;
        if (canMoveToVariant) {
          appendCoachSupplement(state.inlineCoachHistory, `远端 AI 暂时没有返回，但你已经进入变式验证。${teachingMove}`);
          saveData();
          renderDiagnostic();
          renderGuidanceNextAction();
          return;
        }
        state.inlineCoachHistory[state.inlineCoachHistory.length - 1].text = `先按这个提示继续：${immediateReply} ${teachingMove}`;
        saveData();
        renderDiagnostic();
        renderGuidanceNextAction();
      });
  });

  $("inlineCoachReply").addEventListener("input", () => {
    if (state.guidanceLock) {
      state.guidanceLock.replyDraft = $("inlineCoachReply").value;
      state.guidanceLock.microChoiceReady = false;
    }
    renderReplyQuality();
  });
  $("coachQuickReplies").addEventListener("click", (event) => {
    const button = event.target.closest("[data-guidance-quick-reply]");
    if (!button) return;
    submitGuidanceQuickReply(button.dataset.guidanceQuickReply, $("inlineCoachReply"));
  });
  $("applyReplyStarterButton").addEventListener("click", () => {
    const input = $("inlineCoachReply");
    input.value = guidanceReplyStarterForLock(state.guidanceLock);
    if (state.guidanceLock) state.guidanceLock.replyDraft = input.value;
    input.focus();
    renderReplyQuality(input.value);
  });
  $("applyNextSentenceButton").addEventListener("click", () => {
    const input = $("inlineCoachReply");
    const nextSentence = guidanceNextMissingSentence(input.value, state.guidanceLock);
    input.value = `${input.value.trim()} ${nextSentence}`.trim();
    if (state.guidanceLock) state.guidanceLock.replyDraft = input.value;
    input.focus();
    renderReplyQuality(input.value);
  });
  $("applyConceptExampleButton").addEventListener("click", () => {
    requestConceptExampleReteach($("inlineCoachReply"));
  });
  $("applyTeacherModelButton").addEventListener("click", () => {
    const input = $("inlineCoachReply");
    input.value = guidanceTeacherModelForLock(state.guidanceLock);
    if (state.guidanceLock) state.guidanceLock.replyDraft = input.value;
    input.focus();
    renderReplyQuality(input.value);
  });
  $("applyQuestionGoalButton").addEventListener("click", () => {
    applyGuidanceStepBuilder("goal", $("inlineCoachReply"));
  });
  $("replyMicroChoiceCard").addEventListener("click", (event) => {
    const button = event.target.closest("[data-micro-choice]");
    if (!button) return;
    applyGuidanceMicroChoice(button.dataset.microChoice, $("inlineCoachReply"));
  });
  $("conceptBridgeCard").addEventListener("click", (event) => {
    const button = event.target.closest("[data-concept-bridge]");
    if (!button) return;
    applyConceptBridgeChoice(button.dataset.conceptBridge, $("inlineCoachReply"));
  });
  $("replyStepBuilderCard").addEventListener("click", (event) => {
    const button = event.target.closest("[data-reply-step]");
    if (!button) return;
    applyGuidanceStepBuilder(button.dataset.replyStep, $("inlineCoachReply"));
  });
  $("variantReply").addEventListener("input", () => {
    if (state.guidanceLock) {
      state.guidanceLock.variantDraft = $("variantReply").value;
      state.guidanceLock.variantFeedback = "";
    }
    renderVariantRubricFeedback();
  });
  $("variantStarterBar").addEventListener("click", (event) => {
    const starter = event.target.closest("[data-starter-text]");
    if (!starter) return;
    applyVariantStarter(starter.dataset.starterText);
  });
  $("applyVariantNextStepButton").addEventListener("click", () => {
    applyVariantStarter(variantNextStepStarterFor($("variantReply").value, state.guidanceLock?.variant));
  });
  $("variantReteachButton").addEventListener("click", requestVariantReteach);

  $("variantForm").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!hasActiveGuidanceLock()) return;
    const reply = $("variantReply").value.trim();
    if (!reply) return;
    if (!isVariantRubricReady(reply, state.guidanceLock?.variant)) {
      renderVariantRubricFeedback(reply, state.guidanceLock?.variant);
      $("variantFeedback").textContent = "先补完整各项变式说明，再提交给 AI 批改。";
      $("variantReply").focus();
      return;
    }
    $("variantFeedback").textContent = "AI 正在批改你的方法解释...";
    const rubricFeedback = renderVariantRubricFeedback(reply, state.guidanceLock?.variant);
    askMasteryEvaluation(reply)
      .then((evaluation) => {
        const passed = Boolean(evaluation.passed) || isVariantExplanationStrong(reply, state.guidanceLock?.variant);
        if (passed) {
          completeGuidedMastery(reply);
          $("answerFeedback").textContent = `${rubricFeedback}。${evaluation.reply || "变式解释通过。现在可以进入下一题。"}`;
          saveData();
          renderDiagnostic();
          return;
        }
        state.guidanceLock.status = "variant";
        state.guidanceLock.variantDraft = reply;
        state.guidanceLock.variantFeedback = variantTargetedRetryText(reply, state.guidanceLock?.variant, evaluation);
        appendInlineCoach("coach", `${rubricFeedback}。${state.guidanceLock.variantFeedback}`);
        saveData();
        renderDiagnostic();
      })
      .catch(() => {
        if (isVariantExplanationStrong(reply, state.guidanceLock.variant)) {
          completeGuidedMastery(reply);
          $("answerFeedback").textContent = `${rubricFeedback}。AI 较慢，本地判断变式解释通过。现在可以进入下一题。`;
          saveData();
          renderDiagnostic();
          return;
        }
        state.guidanceLock.status = "variant";
        state.guidanceLock.variantDraft = reply;
        state.guidanceLock.variantFeedback = variantTargetedRetryText(reply, state.guidanceLock?.variant);
        appendInlineCoach("coach", `${rubricFeedback}。${state.guidanceLock.variantFeedback}`);
        saveData();
        renderDiagnostic();
      });
  });

  $("copyDigest").addEventListener("click", async () => {
    const text = $("emailPreview").innerText;
    await navigator.clipboard.writeText(text);
    $("copyDigest").textContent = "已复制";
    setTimeout(() => ($("copyDigest").textContent = "复制日报内容"), 1200);
  });

  $("emailDigestButton").addEventListener("click", async () => {
    if (!$("emailPreview").innerText.trim()) {
      $("cloudStatus").textContent = "请先生成日报";
      return;
    }
    $("cloudStatus").textContent = "正在发送日报...";
    try {
      await sendParentDigestEmail();
    } catch (error) {
      console.warn(error);
      $("cloudStatus").textContent = "未配置自动邮件，已打开邮件草稿";
      window.location.href = parentDigestMailtoUrl();
    }
  });

  $("planStudent").addEventListener("change", (event) => {
    state.studentId = event.target.value;
    state.grade = activeStudent().grade;
    state.subject = planForStudent(state.studentId).focusSubject || subjects[state.grade][0].id;
    applyDifficultyMode(state.studentId, state.subject);
    renderSelectors();
    renderParentPlanControls();
    renderParentDashboardSummary();
    renderTodayPlan();
  });

  $("parentPlanForm").addEventListener("submit", (event) => {
    event.preventDefault();
    saveParentPlanSettings();
  });

  $("applyTwoHourPlanPreset").addEventListener("click", applyTwoHourPlanPreset);
}

function renderAll() {
  renderAuth();
  renderStudents();
  renderSelectors();
  renderTodayPlan();
  renderLearningPath();
  renderDiagnostic();
  renderMistakeNotebook();
  renderEmail();
  renderCoach();
  renderStudentAchievements();
  renderParentPlanControls();
  renderParentDashboardSummary();
  renderWeeklyTrend();
  renderQuestionQualityAudit();
  renderProductionReadiness();
  applyRoleVisibility();
  $("reportStatus").textContent = state.reportReady ? "已生成" : "等待诊断";
  $("overallScore").textContent = state.reportReady ? $("overallScore").textContent : "--";
  $("overallNote").textContent = state.reportReady ? $("overallNote").textContent : "完成诊断后生成";
  $("weaknessList").innerHTML = state.reportReady ? $("weaknessList").innerHTML : "<li>完成诊断后显示薄弱点。</li>";
  $("studyPlan").innerHTML = state.reportReady ? $("studyPlan").innerHTML : "<li>完成诊断后生成 7 天学习方案。</li>";
  $("difficultyFit").textContent = state.reportReady ? $("difficultyFit").textContent : "完成诊断后显示。";
  $("issueType").textContent = state.reportReady ? $("issueType").textContent : "完成诊断后显示。";
  $("nextAction").textContent = state.reportReady ? $("nextAction").textContent : "完成诊断后显示。";
  $("reportMistakes").innerHTML = state.reportReady ? $("reportMistakes").innerHTML : "<li>完成诊断后显示错题知识点。</li>";
  $("cloudStatus").textContent = "云端未同步";
  renderActivity();
}

loadSavedData();
bindEvents();
renderAll();
initAuth();
loadCloudQuestions();

