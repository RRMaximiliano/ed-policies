// Country type - 20 Latin American countries
export type Country =
  | 'argentina'
  | 'bolivia'
  | 'brazil'
  | 'chile'
  | 'colombia'
  | 'costa-rica'
  | 'cuba'
  | 'dominican-republic'
  | 'ecuador'
  | 'el-salvador'
  | 'guatemala'
  | 'haiti'
  | 'honduras'
  | 'mexico'
  | 'nicaragua'
  | 'panama'
  | 'paraguay'
  | 'peru'
  | 'uruguay'
  | 'venezuela';

export const COUNTRY_LABELS: Record<Country, string> = {
  argentina: 'Argentina',
  bolivia: 'Bolivia',
  brazil: 'Brazil',
  chile: 'Chile',
  colombia: 'Colombia',
  'costa-rica': 'Costa Rica',
  cuba: 'Cuba',
  'dominican-republic': 'Dominican Republic',
  ecuador: 'Ecuador',
  'el-salvador': 'El Salvador',
  guatemala: 'Guatemala',
  haiti: 'Haiti',
  honduras: 'Honduras',
  mexico: 'Mexico',
  nicaragua: 'Nicaragua',
  panama: 'Panama',
  paraguay: 'Paraguay',
  peru: 'Peru',
  uruguay: 'Uruguay',
  venezuela: 'Venezuela',
};

// Policy type categories
export type PolicyType =
  | 'cct'
  | 'school-feeding'
  | 'digital-inclusion'
  | 'teacher-reform'
  | 'vouchers'
  | 'higher-ed-access'
  | 'early-childhood'
  | 'extended-day'
  | 'indigenous-ed'
  | 'tutoring'
  | 'curriculum'
  | 'infrastructure'
  | 'governance';

export const POLICY_TYPE_LABELS: Record<PolicyType, string> = {
  cct: 'Conditional Cash Transfers',
  'school-feeding': 'School Feeding',
  'digital-inclusion': 'Digital Inclusion',
  'teacher-reform': 'Teacher Reform',
  vouchers: 'Vouchers/School Choice',
  'higher-ed-access': 'Higher Education Access',
  'early-childhood': 'Early Childhood',
  'extended-day': 'Extended School Day',
  'indigenous-ed': 'Indigenous Education',
  tutoring: 'Tutoring & Remediation',
  curriculum: 'Curriculum Reform',
  infrastructure: 'Infrastructure',
  governance: 'Governance & Management',
};

// Affected populations
export type AffectedPopulation =
  | 'early-childhood'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'indigenous'
  | 'rural'
  | 'low-income'
  | 'women-girls'
  | 'teachers'
  | 'all';

export const AFFECTED_POPULATION_LABELS: Record<AffectedPopulation, string> = {
  'early-childhood': 'Early Childhood (0-5)',
  primary: 'Primary School',
  secondary: 'Secondary School',
  tertiary: 'Higher Education',
  indigenous: 'Indigenous Communities',
  rural: 'Rural Areas',
  'low-income': 'Low-Income Families',
  'women-girls': 'Women & Girls',
  teachers: 'Teachers',
  all: 'General Population',
};

// Evidence quality ratings
export type EvidenceQuality = 'high' | 'moderate' | 'emerging' | 'low' | 'none';

export const EVIDENCE_QUALITY_LABELS: Record<EvidenceQuality, string> = {
  high: 'High',
  moderate: 'Moderate',
  emerging: 'Emerging',
  low: 'Low',
  none: 'No Evidence',
};

export const EVIDENCE_QUALITY_DESCRIPTIONS: Record<EvidenceQuality, string> = {
  high: 'Multiple RCTs or rigorous quasi-experimental studies with consistent findings',
  moderate: 'At least one well-designed RCT or multiple high-quality quasi-experimental studies',
  emerging: 'Promising evidence from quasi-experimental studies or early-stage RCTs',
  low: 'Limited evidence, primarily descriptive or correlational studies',
  none: 'No systematic evaluation evidence available',
};

// Key outcomes from evaluations
export interface Outcome {
  metric: string;
  effect: string;
  source?: string;
}

// Study methodology types
export type StudyMethodology =
  | 'rct'
  | 'quasi-experimental'
  | 'regression-discontinuity'
  | 'difference-in-differences'
  | 'instrumental-variables'
  | 'propensity-score'
  | 'descriptive'
  | 'qualitative'
  | 'systematic-review'
  | 'meta-analysis';

export const STUDY_METHODOLOGY_LABELS: Record<StudyMethodology, string> = {
  rct: 'Randomized Controlled Trial',
  'quasi-experimental': 'Quasi-Experimental',
  'regression-discontinuity': 'Regression Discontinuity',
  'difference-in-differences': 'Difference-in-Differences',
  'instrumental-variables': 'Instrumental Variables',
  'propensity-score': 'Propensity Score Matching',
  descriptive: 'Descriptive',
  qualitative: 'Qualitative',
  'systematic-review': 'Systematic Review',
  'meta-analysis': 'Meta-Analysis',
};

// Evaluation study reference
export interface EvaluationStudy {
  authors: string;
  year: number;
  title: string;
  methodology: StudyMethodology;
  journal?: string;
  doi?: string;
  url?: string;
  keyFinding: string;
}

// General reference
export interface Reference {
  authors: string;
  year: number;
  title: string;
  source: string;
  url?: string;
  doi?: string;
}

// Main Policy interface
export interface Policy {
  id: string;
  name: string;
  nameLocal?: string;
  acronym?: string;

  country: Country;
  yearStart: number;
  yearEnd?: number;
  isActive: boolean;

  policyTypes: PolicyType[];
  affectedPopulations: AffectedPopulation[];

  summaryShort: string;
  summaryLong: string;
  objectives: string[];
  mechanisms: string;
  coverage?: string;

  evidenceQuality: EvidenceQuality;
  impactSummary: string;
  keyOutcomes: Outcome[];
  evaluations: EvaluationStudy[];
  keyReferences: Reference[];
}

// Filter state interface
export interface FilterState {
  searchQuery: string;
  countries: Country[];
  policyTypes: PolicyType[];
  affectedPopulations: AffectedPopulation[];
  evidenceQuality: EvidenceQuality[];
  activeOnly: boolean;
  yearRange: [number, number];
}

export const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  countries: [],
  policyTypes: [],
  affectedPopulations: [],
  evidenceQuality: [],
  activeOnly: false,
  yearRange: [1950, new Date().getFullYear()],
};
