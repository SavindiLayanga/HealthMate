import { FormErrors, NewHealthRecord } from '../types';

/**
 * Validates date string in YYYY-MM-DD format
 */
export function isValidDate(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

/**
 * Helper to get today's date formatted as YYYY-MM-DD
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Helper to format date nicely (e.g., "18 August 2026")
 */
export function formatDisplayDate(dateString: string): string {
  if (!isValidDate(dateString)) return dateString;
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// date card eke dinaya pennanna
export function formatDateWithWeekday(dateString: string): string {
  if (!isValidDate(dateString)) return dateString;
  const [year, month, dat] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US' ,{
    weekday: 'long',
    month: 'short',
    day:'numeric',
    year: 'numeric',
  });
}



/**
 * Validates a health record entry form.
 * Returns an object with field-specific error messages.
 */
export function validateHealthRecordForm(data: {
  date: string;
  steps: string;
  calories: string;
  water: string;
}): { isValid: boolean; errors: FormErrors } {
  const errors: FormErrors = {};

  // Date validation
  if (!data.date || !data.date.trim()) {
    errors.date = 'Date is required (YYYY-MM-DD).';
  } else if (!isValidDate(data.date.trim())) {
    errors.date = 'Please enter a valid date in YYYY-MM-DD format.';
  }

  // Steps validation
  if (data.steps === undefined || data.steps === null || data.steps.trim() === '') {
    errors.steps = 'Steps count is required.';
  } else {
    const stepsNum = Number(data.steps);
    if (isNaN(stepsNum) || !Number.isInteger(stepsNum)) {
      errors.steps = 'Steps must be a whole number.';
    } else if (stepsNum < 0) {
      errors.steps = 'Steps cannot be negative.';
    } else if (stepsNum > 100000) {
      errors.steps = 'Steps count cannot exceed 100,000.';
    }
  }

  // Calories validation
  if (data.calories === undefined || data.calories === null || data.calories.trim() === '') {
    errors.calories = 'Calories burned is required.';
  } else {
    const calNum = Number(data.calories);
    if (isNaN(calNum) || !Number.isInteger(calNum)) {
      errors.calories = 'Calories must be a whole number.';
    } else if (calNum < 0) {
      errors.calories = 'Calories cannot be negative.';
    } else if (calNum > 20000) {
      errors.calories = 'Calories cannot exceed 20,000 kcal.';
    }
  }

  // Water validation
  if (data.water === undefined || data.water === null || data.water.trim() === '') {
    errors.water = 'Water intake is required.';
  } else {
    const waterNum = Number(data.water);
    if (isNaN(waterNum) || !Number.isInteger(waterNum)) {
      errors.water = 'Water intake must be a whole number.';
    } else if (waterNum < 0) {
      errors.water = 'Water intake cannot be negative.';
    } else if (waterNum > 15000) {
      errors.water = 'Water intake cannot exceed 15,000 ml.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
