with seed_questions as (
  select
    s.id as subject_id,
    kp.id as knowledge_point_id,
    q.prompt,
    q.difficulty,
    q.source_type,
    q.explanation,
    q.coach_hint_1,
    q.coach_hint_2,
    q.correct_label,
    q.options
  from (
    values
      (
        '7th Grade Math',
        'Proportional reasoning',
        'A jacket costs $80 before a 25% discount. What should you find first to calculate the sale price?',
        'foundation',
        'in_house',
        'Find the discount amount first, then subtract it from the original price.',
        'What does 25% of 80 represent in this problem?',
        'After you know the discount amount, what operation gives the sale price?',
        'A',
        array['The discount amount', 'The sales tax rate', 'The number of sizes', 'The original color']
      ),
      (
        '7th Grade RLA',
        'Character analysis',
        'When analyzing a character motivation, which evidence is most useful?',
        'medium',
        'in_house',
        'Actions, dialogue, and changes in thinking reveal motivation.',
        'Look for what the character does or says.',
        'Which choice points to evidence inside the text?',
        'B',
        array['The page number only', 'The character actions and dialogue', 'The font size', 'The paragraph length']
      ),
      (
        '7th Grade Science',
        'Ecosystems',
        'Which pair best describes parts of an ecosystem?',
        'foundation',
        'in_house',
        'Ecosystems include living and nonliving components interacting together.',
        'Which items include both living and nonliving factors?',
        'Think about organisms plus the physical environment.',
        'C',
        array['Only predators and prey', 'Only weather and rocks', 'Organisms and nonliving factors', 'Only plants']
      ),
      (
        '8th Grade Math',
        'Proportional relationships',
        'A graph of y = 3x represents a proportional relationship. What must be true?',
        'foundation',
        'in_house',
        'A proportional relationship has a constant rate and passes through the origin.',
        'Where does a proportional graph cross the axes?',
        'What does the 3 tell you about the rate?',
        'A',
        array['It passes through the origin with rate 3', 'It is always curved', 'It has no unit rate', 'It cannot be a table']
      ),
      (
        '8th Grade RLA',
        'Compare texts',
        'When comparing two argumentative texts, what should you identify first?',
        'medium',
        'in_house',
        'Claims and evidence are the foundation for comparison.',
        'What is each author trying to prove?',
        'Which details show how the author supports the claim?',
        'A',
        array['Each author claim and supporting evidence', 'The number of pictures', 'The longest paragraph', 'The last sentence only']
      ),
      (
        '8th Grade Science',
        'Experimental design',
        'A student wants to know if sunlight affects plant growth. What should be controlled?',
        'medium',
        'in_house',
        'A fair test changes one variable while keeping other conditions consistent.',
        'What variable is being tested?',
        'What conditions should stay the same for both plants?',
        'D',
        array['Only the conclusion', 'Only the title', 'The color of the notebook', 'Water, soil, and plant type']
      ),
      (
        'Algebra I',
        'Linear functions',
        'A line passes through (2, 7) and (5, 16). What should you calculate first?',
        'medium',
        'in_house',
        'Slope shows the rate of change between two points.',
        'Which value compares the change in y to the change in x?',
        'Use rise over run before finding the intercept.',
        'A',
        array['Slope', 'Maximum value', 'Square root', 'Area']
      ),
      (
        'English I',
        'Use text evidence',
        'Before choosing evidence for an answer, what should you identify?',
        'foundation',
        'in_house',
        'Evidence should match the central idea or claim being supported.',
        'What is the question asking you to prove?',
        'Which sentence directly supports that idea?',
        'B',
        array['The longest sentence', 'The central idea or claim', 'The paragraph number', 'The author name only']
      ),
      (
        'Biology',
        'Cell structure and energy',
        'A cell cannot produce enough usable energy. Which structure should you review first?',
        'foundation',
        'in_house',
        'Mitochondria are closely tied to cellular respiration and usable energy.',
        'Which organelle is often called the powerhouse of the cell?',
        'What process releases usable energy from food molecules?',
        'A',
        array['Mitochondria', 'Cell wall color', 'Chromosome count', 'Taxonomy level']
      )
  ) as q(subject_title, knowledge_title, prompt, difficulty, source_type, explanation, coach_hint_1, coach_hint_2, correct_label, options)
  join public.subjects s on s.title = q.subject_title
  left join public.knowledge_points kp on kp.subject_id = s.id and kp.title = q.knowledge_title
),
inserted_questions as (
  insert into public.questions (
    subject_id,
    knowledge_point_id,
    prompt,
    difficulty,
    source_type,
    explanation,
    coach_hint_1,
    coach_hint_2
  )
  select
    subject_id,
    knowledge_point_id,
    prompt,
    difficulty,
    source_type,
    explanation,
    coach_hint_1,
    coach_hint_2
  from seed_questions
  where not exists (
    select 1 from public.questions existing
    where existing.prompt = seed_questions.prompt
  )
  returning id, prompt
)
insert into public.question_options (question_id, label, option_text, is_correct)
select
  q.id,
  chr((64 + option_index)::int)::text,
  option_text,
  chr((64 + option_index)::int)::text = seed.correct_label
from inserted_questions q
join seed_questions seed on seed.prompt = q.prompt
cross join lateral unnest(seed.options) with ordinality as option_values(option_text, option_index);
