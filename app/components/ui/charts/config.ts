export const chartConfig = {
  colors: {
    risk: {
      low: 'hsl(142, 76%, 36%)',
      medium: 'hsl(48, 96%, 53%)',
      high: 'hsl(0, 84%, 60%)'
    },
    events: {
      hypo: 'hsl(0, 84%, 60%)',
      bolus: 'hsl(142, 76%, 36%)',
      meal: 'hsl(48, 96%, 53%)',
      basal: 'hsl(201, 96%, 53%)',
      warning: 'hsl(31, 96%, 53%)'
    }
  },
  thresholds: {
    riskScore: {
      low: 5,
      medium: 10
    },
    glucose: {
      hypo: 3.9,
      hyper: 10.0
    }
  }
}; 