/**
 * Validation utilities for forms and user input
 */

export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!password) {
    errors.push('Password is required');
    return { isValid: false, errors };
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validatePasswordConfirmation = (
  password: string,
  confirmPassword: string
): { isValid: boolean; error?: string } => {
  if (!confirmPassword) {
    return { isValid: false, error: 'Please confirm your password' };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }
  
  return { isValid: true };
};

export const validateUsername = (username: string): { isValid: boolean; error?: string } => {
  if (!username) {
    return { isValid: false, error: 'Username is required' };
  }
  
  if (username.length < 3) {
    return { isValid: false, error: 'Username must be at least 3 characters long' };
  }
  
  if (username.length > 20) {
    return { isValid: false, error: 'Username must be less than 20 characters' };
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { isValid: false, error: 'Username can only contain letters, numbers, and underscores' };
  }
  
  return { isValid: true };
};

export const validateName = (name: string): { isValid: boolean; error?: string } => {
  if (!name) {
    return { isValid: false, error: 'Name is required' };
  }
  
  if (name.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters long' };
  }
  
  if (name.length > 50) {
    return { isValid: false, error: 'Name must be less than 50 characters' };
  }
  
  return { isValid: true };
};

export const validatePhoneNumber = (phone: string): { isValid: boolean; error?: string } => {
  if (!phone) {
    return { isValid: true }; // Phone is optional
  }
  
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length !== 10) {
    return { isValid: false, error: 'Phone number must be exactly 10 digits' };
  }
  
  if (!/^[6-9]/.test(cleanPhone)) {
    return { isValid: false, error: 'Phone number must start with 6, 7, 8, or 9' };
  }
  
  return { isValid: true };
};

export const validateLocation = (location: string): { isValid: boolean; error?: string } => {
  if (!location || location.trim().length === 0) {
    return { isValid: false, error: 'Location is required' };
  }
  
  if (location.length < 3) {
    return { isValid: false, error: 'Please enter a valid location' };
  }
  
  return { isValid: true };
};

export const validatePrice = (price: string | number): { isValid: boolean; error?: string } => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice) || numPrice <= 0) {
    return { isValid: false, error: 'Please enter a valid price' };
  }
  
  if (numPrice > 10000) {
    return { isValid: false, error: 'Price cannot exceed ₹10,000' };
  }
  
  return { isValid: true };
};

export const validateSeats = (seats: number, min: number = 1, max: number = 6): { isValid: boolean; error?: string } => {
  if (!Number.isInteger(seats)) {
    return { isValid: false, error: 'Seats must be a whole number' };
  }
  
  if (seats < min) {
    return { isValid: false, error: `Minimum ${min} seat(s) required` };
  }
  
  if (seats > max) {
    return { isValid: false, error: `Maximum ${max} seats allowed` };
  }
  
  return { isValid: true };
};
