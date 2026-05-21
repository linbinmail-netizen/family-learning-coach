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

function activeQuestions() {
  const cloudQuestions = state.cloudQuestions[state.subject] || [];
  const localQuestions = localQuestionBank[state.subject] || [];
  const expandedQuestions = expandedQuestionBank[state.subject] || [];
  if (cloudQuestions.length || localQuestions.length || expandedQuestions.length) {
    return prepareQuestionSet(mergeQuestions(cloudQuestions, localQuestions.concat(expandedQuestions)));
  }

  const diagnostic = activeDiagnostic();
  if (diagnostic.questions) return prepareQuestionSet(diagnostic.questions);
  const strongest = diagnostic.skills.reduce((best, skill) => (skill[1] > best[1] ? skill : best), diagnostic.skills[0]);
  const weakest = diagnostic.skills.reduce((low, skill) => (skill[1] < low[1] ? skill : low), diagnostic.skills[0]);
  return prepareQuestionSet([
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
  $("dailySuggestion").textContent = `${student.name} 今天建议完成 ${subject.label} 诊断，并用 20 分钟复习最低掌握度的知识点。当前题组 ${questions.length} 题，包含云端题库与本地强化题。`;

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

async function askAiCoach(studentReply) {
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

function buildLocalCoachReply(studentReply) {
  const question = activeQuestions()[state.currentQuestion];
  const reply = studentReply.toLowerCase();
  const studentTurns = state.chatHistory.filter((message) => message.role === "student").length;
  const hints = question?.coachHints || [];

  if (reply.length < 8 || reply.includes("不知道") || reply.includes("不会") || reply.includes("idk")) {
    return {
      reply: `${hints[0] || "先把题目中的关键词圈出来。"} 先不用选答案，请用自己的话说说题目真正问什么。`,
    };
  }

  if (studentTurns <= 1) {
    return {
      reply: `${hints[0] || "方向不错。"} 下一步找一个关键词，并说明它为什么重要。`,
    };
  }

  if (studentTurns === 2) {
    return {
      reply: `${hints[1] || "很好，继续缩小范围。"} 现在先排除一个不合理选项，并说出理由。`,
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
        appendChat("coach", buildLocalCoachReply(reply).reply);
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
