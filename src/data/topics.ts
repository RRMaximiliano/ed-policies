import { PolicyType } from '@/types/policy';

// One-paragraph editorial descriptions for each policy instrument. Shown on
// /topics/[type] pages and used for their meta descriptions.
export const TOPIC_DESCRIPTIONS: Record<PolicyType, string> = {
  cct: 'Cash transfers paid to poor households on the condition that children attend school and receive health care. Pioneered in the region by Mexico and Brazil in the late 1990s, conditional cash transfers became Latin America’s most studied and most exported social policy.',
  'school-feeding':
    'Programs that provide meals in school to improve nutrition, attendance, and learning. Several of the world’s largest school feeding operations run in this region.',
  'digital-inclusion':
    'Device distribution, connectivity, and educational technology programs, from one-laptop-per-child schemes to national platforms for remote instruction.',
  'teacher-reform':
    'Reforms to how teachers are recruited, paid, evaluated, and promoted, including career ladders, performance pay, and professional development at scale.',
  vouchers:
    'School choice and subsidy schemes in which public funding follows students to public or private providers. Chile hosts the region’s longest-running universal voucher system.',
  'higher-ed-access':
    'Scholarships, tuition-free policies, affirmative action, and student finance programs that broaden who reaches and completes tertiary education.',
  'early-childhood':
    'Preschool expansion, comprehensive early-development systems, and parenting programs targeting children before primary school age.',
  'extended-day':
    'Reforms that lengthen the school day or year, adding instructional time, meals, and enrichment, often with major infrastructure investment.',
  'indigenous-ed':
    'Intercultural and bilingual education policies serving indigenous students in their own languages and contexts.',
  tutoring:
    'Targeted small-group or remote instruction for students who have fallen behind, including volunteer corps and phone-based tutoring tested during the pandemic.',
  curriculum:
    'National curriculum reforms, literacy programs, and structured pedagogy interventions that change what and how students are taught.',
  infrastructure:
    'School construction and facility investment programs, from rural one-room schools to flagship campus networks.',
  governance:
    'Reforms to who runs schools and how: decentralization, community management, accountability systems, and education financing rules.',
};
