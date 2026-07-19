import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function scrollToElement(elementId: string, duration: number = 600) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const targetPosition = element.getBoundingClientRect().top + window.scrollY - 80; // Offset for navbar
  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;
  let start: number | null = null;
  
  window.requestAnimationFrame(function step(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    const percent = Math.min(progress / duration, 1);
    
    // Ease-in-out cubic function for premium feel
    const ease = percent < 0.5 
      ? 4 * percent * percent * percent 
      : 1 - Math.pow(-2 * percent + 2, 3) / 2;
      
    window.scrollTo(0, startPosition + distance * ease);
    
    if (progress < duration) {
      window.requestAnimationFrame(step);
    }
  });
}
