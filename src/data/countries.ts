import { Country } from '@/types/policy';

export interface CountryMeta {
  flag: string;
}

export const COUNTRY_META: Record<Country, CountryMeta> = {
  argentina: { flag: '🇦🇷' },
  bolivia: { flag: '🇧🇴' },
  brazil: { flag: '🇧🇷' },
  chile: { flag: '🇨🇱' },
  colombia: { flag: '🇨🇴' },
  'costa-rica': { flag: '🇨🇷' },
  cuba: { flag: '🇨🇺' },
  'dominican-republic': { flag: '🇩🇴' },
  ecuador: { flag: '🇪🇨' },
  'el-salvador': { flag: '🇸🇻' },
  guatemala: { flag: '🇬🇹' },
  haiti: { flag: '🇭🇹' },
  honduras: { flag: '🇭🇳' },
  mexico: { flag: '🇲🇽' },
  nicaragua: { flag: '🇳🇮' },
  panama: { flag: '🇵🇦' },
  paraguay: { flag: '🇵🇾' },
  peru: { flag: '🇵🇪' },
  uruguay: { flag: '🇺🇾' },
  venezuela: { flag: '🇻🇪' },
  jamaica: { flag: '🇯🇲' },
};
