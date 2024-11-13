import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function checkThemeVariables() {
  const root = document.documentElement;
  const style = getComputedStyle(root);
  
  const requiredVariables = [
    '--background',
    '--foreground',
    '--card',
    '--card-foreground',
    '--primary',
    '--primary-foreground'
  ];

  requiredVariables.forEach(variable => {
    if (!style.getPropertyValue(variable)) {
      console.warn(`Chybí CSS proměnná: ${variable}`);
    }
  });
}
