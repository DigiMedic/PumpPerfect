import { GlucoseDataPoint } from "@/types/analytics";

interface GlucoseStats {
  average: number;
  gmi: number;
  timeInRange: number;
  timeBelow: number;
  timeAbove: number;
  cv: number;
  hypos: number;
}

interface GlucoseTrends {
  rising: number;
  falling: number;
  stable: number;
  patterns: Array<{
    description: string;
    frequency: number;
  }>;
}

interface DailyStats {
  hourlyAverages: Array<{
    hour: string;
    value: number;
  }>;
  insights: Array<{
    description: string;
    value: string;
  }>;
}

export function calculateStats(data: GlucoseDataPoint[]): GlucoseStats {
  const validData = data.filter(point => point.isValid);
  
  if (validData.length === 0) {
    return {
      average: 0,
      gmi: 0,
      timeInRange: 0,
      timeBelow: 0,
      timeAbove: 0,
      cv: 0,
      hypos: 0
    };
  }

  const values = validData.map(point => point.value);
  
  // Průměr
  const average = values.reduce((a, b) => a + b, 0) / values.length;
  
  // GMI (Glucose Management Indicator)
  const gmi = 3.31 + (0.02392 * average * 18);
  
  // Čas v rozmezí
  const inRange = values.filter(v => v >= 3.9 && v <= 10.0).length;
  const timeInRange = (inRange / values.length) * 100;
  
  // Čas pod a nad rozmezím
  const below = values.filter(v => v < 3.9).length;
  const timeBelow = (below / values.length) * 100;
  const above = values.filter(v => v > 10.0).length;
  const timeAbove = (above / values.length) * 100;
  
  // Variační koeficient
  const standardDeviation = Math.sqrt(
    values.reduce((sq, n) => sq + Math.pow(n - average, 2), 0) / (values.length - 1)
  );
  const cv = (standardDeviation / average) * 100;
  
  // Počet hypoglykémií
  const hypos = countHypos(validData);

  return {
    average,
    gmi,
    timeInRange,
    timeBelow,
    timeAbove,
    cv,
    hypos
  };
}

function countHypos(data: GlucoseDataPoint[]): number {
  let hypos = 0;
  let inHypo = false;

  for (const point of data) {
    if (point.value < 3.9) {
      if (!inHypo) {
        hypos++;
        inHypo = true;
      }
    } else {
      inHypo = false;
    }
  }

  return hypos;
}

export function calculateTrends(data: GlucoseDataPoint[]): GlucoseTrends {
  const validData = data.filter(point => point.isValid);
  
  if (validData.length === 0) {
    return {
      rising: 0,
      falling: 0,
      stable: 0,
      patterns: []
    };
  }

  // Výpočet procentuálního zastoupení trendů
  const trends = validData.reduce(
    (acc, point) => {
      if (point.trend === 'rising') acc.rising++;
      else if (point.trend === 'falling') acc.falling++;
      else acc.stable++;
      return acc;
    },
    { rising: 0, falling: 0, stable: 0 }
  );

  const total = validData.length;
  const trendPercentages = {
    rising: (trends.rising / total) * 100,
    falling: (trends.falling / total) * 100,
    stable: (trends.stable / total) * 100
  };

  // Analýza denních vzorců
  const patterns = analyzeDailyPatterns(validData);

  return {
    ...trendPercentages,
    patterns
  };
}

function analyzeDailyPatterns(data: GlucoseDataPoint[]): Array<{description: string; frequency: number}> {
  const patterns: Array<{description: string; frequency: number}> = [];
  
  // Rozdělení dne na časové úseky
  const timeSlots = {
    morning: { start: 6, end: 10 },
    noon: { start: 11, end: 14 },
    afternoon: { start: 15, end: 18 },
    evening: { start: 19, end: 22 },
    night: { start: 23, end: 5 }
  };

  // Analýza každého časového úseku
  for (const [period, time] of Object.entries(timeSlots)) {
    const slotData = data.filter(point => {
      const hour = new Date(point.timestamp).getHours();
      return (hour >= time.start && hour <= time.end);
    });

    if (slotData.length === 0) continue;

    const avgGlucose = slotData.reduce((sum, point) => sum + point.value, 0) / slotData.length;
    const risingTrend = slotData.filter(point => point.trend === 'rising').length / slotData.length * 100;

    // Identifikace vzorců
    if (avgGlucose > 10) {
      patterns.push({
        description: `Vysoké hodnoty v ${getPeriodName(period)}`,
        frequency: (slotData.filter(point => point.value > 10).length / slotData.length * 100)
      });
    }
    
    if (risingTrend > 60) {
      patterns.push({
        description: `Stoupající trend v ${getPeriodName(period)}`,
        frequency: risingTrend
      });
    }
  }

  return patterns.sort((a, b) => b.frequency - a.frequency);
}

function getPeriodName(period: string): string {
  const names: Record<string, string> = {
    morning: 'ranních hodinách',
    noon: 'poledních hodinách',
    afternoon: 'odpoledních hodinách',
    evening: 'večerních hodinách',
    night: 'nočních hodinách'
  };
  return names[period] || period;
}

export function calculateDailyStats(data: GlucoseDataPoint[]): DailyStats {
  const validData = data.filter(point => point.isValid);
  
  if (validData.length === 0) {
    return {
      hourlyAverages: [],
      insights: []
    };
  }

  // Výpočet hodinových průměrů
  const hourlyData: Record<number, number[]> = {};
  validData.forEach(point => {
    const hour = new Date(point.timestamp).getHours();
    if (!hourlyData[hour]) hourlyData[hour] = [];
    hourlyData[hour].push(point.value);
  });

  const hourlyAverages = Object.entries(hourlyData).map(([hour, values]) => ({
    hour: `${hour}:00`,
    value: values.reduce((a, b) => a + b, 0) / values.length
  })).sort((a, b) => parseInt(a.hour) - parseInt(b.hour));

  // Analýza denních vzorců
  const insights = generateInsights(validData, hourlyAverages);

  return {
    hourlyAverages,
    insights
  };
}

function generateInsights(
  data: GlucoseDataPoint[],
  hourlyAverages: Array<{hour: string; value: number}>
): Array<{description: string; value: string}> {
  const insights: Array<{description: string; value: string}> = [];

  // Nejvyšší a nejnižší hodnoty
  const maxValue = Math.max(...data.map(p => p.value));
  const minValue = Math.min(...data.map(p => p.value));
  insights.push(
    { description: "Nejvyšší hodnota", value: `${maxValue.toFixed(1)} mmol/L` },
    { description: "Nejnižší hodnota", value: `${minValue.toFixed(1)} mmol/L` }
  );

  // Nejstabilnější období
  const hourlyVariability = hourlyAverages.map(h => ({
    hour: h.hour,
    values: data.filter(p => new Date(p.timestamp).getHours() === parseInt(h.hour))
  }));

  const mostStableHour = hourlyVariability.reduce((prev, curr) => {
    const prevCV = calculateCV(prev.values.map(v => v.value));
    const currCV = calculateCV(curr.values.map(v => v.value));
    return prevCV < currCV ? prev : curr;
  });

  insights.push({
    description: "Nejstabilnější období",
    value: mostStableHour.hour
  });

  // Další statistiky...

  return insights;
}

function calculateCV(values: number[]): number {
  if (values.length === 0) return 0;
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sq, n) => sq + Math.pow(n - avg, 2), 0) / (values.length - 1);
  return Math.sqrt(variance) / avg * 100;
} 