export const revenueData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Revenue',
      data: [4200, 5100, 3800, 6200, 5800, 7200],
      backgroundColor: '#3B82F6',
    },
    {
      label: 'Expenses',
      data: [2400, 2800, 2200, 3100, 2900, 3400],
      backgroundColor: '#EF4444',
    }
  ]
}

export const categoryData = {
  labels: ['Electronics', 'Clothing', 'Food', 'Books', 'Others'],
  datasets: [
    {
      data: [4500, 3200, 2800, 1900, 1600],
      backgroundColor: [
        '#3B82F6',
        '#10B981',
        '#F59E0B',
        '#EF4444',
        '#8B5CF6'
      ]
    }
  ]
}

export const trafficData = {
  labels: ['Direct', 'Social', 'Search', 'Email', 'Referral'],
  datasets: [
    {
      label: 'Visitors',
      data: [4200, 3800, 3200, 2400, 1800],
      backgroundColor: '#3B82F6',
    }
  ]
}