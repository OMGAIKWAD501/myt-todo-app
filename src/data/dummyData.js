export const dummyTasks = [
  {
    id: '1',
    title: 'Design UI mockups',
    description: 'Create wireframes and high-fidelity mockups',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    category: 'design',
    priority: 'high',
    completed: false,
    color: 'purple',
  },
  {
    id: '2',
    title: 'Review pull requests',
    description: 'Check and merge pending PRs',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    category: 'development',
    priority: 'medium',
    completed: false,
    color: 'blue',
  },
  {
    id: '3',
    title: 'Team meeting',
    description: 'Weekly standup at 10 AM',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    category: 'meeting',
    priority: 'high',
    completed: false,
    color: 'pink',
  },
  {
    id: '4',
    title: 'Update documentation',
    description: 'Update API docs and README',
    startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    category: 'documentation',
    priority: 'low',
    completed: true,
    color: 'green',
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

export const categoryIcons = {
  design: 'Palette',
  development: 'Code',
  meeting: 'Users',
  documentation: 'FileText',
  personal: 'Heart',
  health: 'Activity',
};
