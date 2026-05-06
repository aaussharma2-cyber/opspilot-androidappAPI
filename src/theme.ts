export const COLORS = {
  blue:   '#0073ea',
  bg:     '#f5f7fa',
  card:   '#ffffff',
  text:   '#1a1a2e',
  muted:  '#666666',
  line:   '#e0e6ef',
  green:  '#00c875',
  yellow: '#e2a000',
  red:    '#e44258',
  purple: '#9b59b6',
};

export const FONT = { sm: 12, md: 14, lg: 16, xl: 20, xxl: 26 };

export const STATUS_COLOR: Record<string, string> = {
  'To Do':      COLORS.muted,
  'In Progress': COLORS.blue,
  'Done':       COLORS.green,
  'Blocked':    COLORS.red,
  'Draft':      COLORS.muted,
  'Sent':       COLORS.blue,
  'Paid':       COLORS.green,
  'Overdue':    COLORS.red,
  'Planning':   COLORS.yellow,
  'Active':     COLORS.blue,
  'Completed':  COLORS.green,
  'lead':       COLORS.purple,
  'customer':   COLORS.green,
  'prospect':   COLORS.blue,
  'info':       COLORS.blue,
  'warning':    COLORS.yellow,
  'danger':     COLORS.red,
};
