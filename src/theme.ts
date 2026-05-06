export const COLORS = {
  blue: '#0B63F6',
  blueDark: '#073A86',
  teal: '#04A6A6',
  bg: '#F4F7FB',
  card: '#FFFFFF',
  text: '#142033',
  muted: '#697386',
  line: '#DDE5F0',
  green: '#06A77D',
  yellow: '#D88A00',
  red: '#D6455D',
  purple: '#7C3AED',
  ink: '#0E1726',
};

export const FONT = { xs: 11, sm: 12, md: 14, lg: 16, xl: 20, xxl: 28 };

export const SHADOW = {
  shadowColor: '#20304A',
  shadowOpacity: 0.08,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 6 },
  elevation: 3,
};

export const STATUS_COLOR: Record<string, string> = {
  Backlog: COLORS.muted,
  'To Do': COLORS.muted,
  'In Progress': COLORS.blue,
  Blocked: COLORS.red,
  Review: COLORS.purple,
  Done: COLORS.green,
  Draft: COLORS.muted,
  Sent: COLORS.blue,
  Paid: COLORS.green,
  Overdue: COLORS.red,
  Planning: COLORS.yellow,
  Active: COLORS.blue,
  Completed: COLORS.green,
  lead: COLORS.purple,
  customer: COLORS.green,
  prospect: COLORS.blue,
  info: COLORS.blue,
  warning: COLORS.yellow,
  danger: COLORS.red,
  Low: COLORS.muted,
  Medium: COLORS.blue,
  High: COLORS.yellow,
  Critical: COLORS.red,
};
