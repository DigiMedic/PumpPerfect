export const GLUCOSE_THRESHOLDS = {
    HYPO: 3.9,
    HYPER: 10.0,
    SEVERE_HYPO: 3.0,
    SEVERE_HYPER: 13.9
} as const;

export const TIME_RANGES = {
    "24h": "24 hodin",
    "7d": "7 dní",
    "30d": "30 dní"
} as const;

export const CHART_TYPES = {
    "line": "Spojnicový",
    "area": "Plošný",
    "scatter": "Bodový"
} as const;

export const REQUIRED_FILES = [
    'basal_data.csv',
    'bolus_data.csv',
    'cgm_data.csv'
] as const;

export const FILE_COLUMNS = {
    basal: ['Timestamp', 'Rate'],
    bolus: ['Timestamp', 'Insulin Delivered (U)'],
    cgm: ['Timestamp', 'CGM Glucose Value (mmol/l)']
} as const; 