import { formatDate, addDays } from '../utils/dateUtils';

const today = new Date();
const todayStr = formatDate(today);
const twoDaysLater = formatDate(addDays(today, 2));
const yesterday = formatDate(addDays(today, -1));

export const dummyTasks = [
  {
    id: '1',
    title: 'Design UI mockups',
    description: 'Create wireframes and high-fidelity mockups',
    startDate: todayStr,
    endDate: twoDaysLater,
    category: 'work',
    priority: 'high',
    completed: false,
    color: 'work',
  },
  {
    id: '2',
    title: 'Review pull requests',
    description: 'Check and merge pending PRs',
    startDate: todayStr,
    endDate: todayStr,
    category: 'work',
    priority: 'medium',
    completed: false,
    color: 'work',
  },
  {
    id: '3',
    title: 'Team meeting',
    description: 'Weekly standup at 10 AM',
    startDate: todayStr,
    endDate: todayStr,
    category: 'personal',
    priority: 'high',
    completed: false,
    color: 'personal',
  },
  {
    id: '4',
    title: 'Update documentation',
    description: 'Update API docs and README',
    startDate: yesterday,
    endDate: todayStr,
    category: 'learning',
    priority: 'low',
    completed: true,
    color: 'learning',
  },
];

export const categoryColors = {
  design: '#a855f7',
  development: '#3b82f6',
  meeting: '#ec4899',
  documentation: '#10b981',
  personal: '#f59e0b',
  health: '#ef4444',
};
