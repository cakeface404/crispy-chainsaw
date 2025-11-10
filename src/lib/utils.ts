import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Sanitizes a phone number to be used in a WhatsApp "wa.me" link.
 * It removes all non-digit characters and ensures it doesn't start with a '0'.
 * @param phone The raw phone number string.
 * @returns A sanitized phone number string.
 */
export function sanitizePhoneNumberForWhatsApp(phone: string): string {
  if (!phone) {
    return '';
  }
  // Remove all non-digit characters
  let sanitized = phone.replace(/\D/g, '');

  // If the number starts with '0', remove it.
  // This is a common convention in some countries for local calls.
  if (sanitized.startsWith('0')) {
    sanitized = sanitized.substring(1);
  }
  
  // Note: This function assumes the number, after sanitization,
  // is in a format that includes the country code minus the '+'.
  // For a more robust solution, a library like 'libphonenumber-js' would be needed
  // to handle various international formats and add country codes if missing.
  // For this project, we'll use this simpler sanitization.
  return sanitized;
}
