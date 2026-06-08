import { describe, it, expect } from 'vitest';
import {
  isValidHex,
  hexColor,
  sanitizeHexColor,
  getLuminance,
  normalizeHexColor,
} from './sanitizer';
import { contrastRatio } from './themes/test-utils';

const darkColors = ['0d1117', '000000', '1a1a2e', '282828', '0a0a0a'];
const lightColors = ['ffffff', 'fbf1c7', 'eff1f5', 'fdf6e3', 'eceff4'];

describe('Sanitizer dark and light color cohesion', () => {
  it('accepts both dark and light hex colors as valid', () => {
    darkColors.forEach((c) => expect(isValidHex(c)).toBe(true));
    lightColors.forEach((c) => expect(isValidHex(c)).toBe(true));
  });

  it('computes distinctly different luminance for dark vs light backgrounds', () => {
    const darkLums = darkColors.map(getLuminance);
    const lightLums = lightColors.map(getLuminance);
    darkLums.forEach((lum) => expect(lum).toBeLessThan(0.1));
    lightLums.forEach((lum) => expect(lum).toBeGreaterThan(0.5));
  });

  it('produces WCAG AA compliant contrast for sampled dark-on-light pairs', () => {
    const pairs = [
      { bg: 'ffffff', text: '0d1117' },
      { bg: 'fbf1c7', text: '3c3836' },
      { bg: 'eff1f5', text: '4c4f69' },
    ];
    pairs.forEach(({ bg, text }) => {
      const ratio = contrastRatio(bg, text);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
  });

  it('normalizes both dark and light hex colors without altering the value', () => {
    darkColors.forEach((c) => expect(normalizeHexColor(c)).toBe(c));
    lightColors.forEach((c) => expect(normalizeHexColor(c)).toBe(c));
  });

  it('passes dark and light colors through hexColor and sanitizeHexColor unchanged', () => {
    [...darkColors, ...lightColors].forEach((c) => {
      expect(hexColor(c)).toBe(c);
      expect(sanitizeHexColor(c, '000000')).toBe(c);
    });
  });
});
