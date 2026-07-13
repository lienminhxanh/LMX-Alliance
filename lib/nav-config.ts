export type NavChild =
  | { key: string; labelKey: string; type: 'anchor'; target: string }
  | { key: string; labelKey: string; type: 'route'; target: string };

export type NavItem = {
  key: string;
  labelKey: string;
  href: string;
  children?: NavChild[];
  dynamicChildren?: 'business-sectors';
};

export const NAV_CONFIG: NavItem[] = [
  { key: 'home', labelKey: 'home', href: '/' },
  {
    key: 'about',
    labelKey: 'about',
    href: '/about',
    children: [
      { key: 'about.intro', labelKey: 'intro', type: 'anchor', target: 'intro' },
      { key: 'about.openLetter', labelKey: 'openLetter', type: 'anchor', target: 'open-letter' },
      { key: 'about.values', labelKey: 'values', type: 'anchor', target: 'values' },
      { key: 'about.legal', labelKey: 'legal', type: 'anchor', target: 'legal-documents' },
      { key: 'about.leadership', labelKey: 'leadership', type: 'anchor', target: 'leadership' },
    ],
  },
  {
    key: 'business-segments',
    labelKey: 'business',
    href: '/business-segments',
    dynamicChildren: 'business-sectors',
  },
  {
    key: 'shareholder-relations',
    labelKey: 'investor',
    href: '/shareholder-relations',
    children: [
      { key: 'shareholder-relations.governance', labelKey: 'governance', type: 'route', target: '/shareholder-relations/governance' },
      { key: 'shareholder-relations.financial-reports', labelKey: 'financialReports', type: 'route', target: '/shareholder-relations/financial-reports' },
      { key: 'shareholder-relations.annual-reports', labelKey: 'annualReports', type: 'route', target: '/shareholder-relations/annual-reports' },
    ],
  },
  { key: 'news', labelKey: 'news', href: '/news' },
  { key: 'careers', labelKey: 'careers', href: '/careers' },
  {
    key: 'activities',
    labelKey: 'activities',
    href: '/activities',
    children: [
      { key: 'activities.internal', labelKey: 'internal', type: 'anchor', target: 'internal-activities' },
      { key: 'activities.social', labelKey: 'social', type: 'anchor', target: 'social-activities' },
    ],
  },
];

export function filterVisibleNav(config: NavItem[], hiddenKeys: Set<string>): NavItem[] {
  return config
    .filter((item) => !hiddenKeys.has(item.key))
    .map((item) => {
      if (!item.children) return item;
      return { ...item, children: item.children.filter((child) => !hiddenKeys.has(child.key)) };
    });
}
