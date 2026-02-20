import { CustomStyles } from './custom-styles.interface';

/**
 * Merges component custom styles into a single object suitable for [ngStyle] or @HostBinding('style').
 * Maps backgroundColor and color to theme/component CSS variables and inline styles.
 * Use the same prefix as your component's CSS vars (e.g. 'btn', 'card', 'spinner').
 */
export function mergeCustomStyles(
  customStyles: CustomStyles | Record<string, string | undefined> = {},
  componentPrefix?: string
): Record<string, string | number> {
  const result: Record<string, string | number> = {};
  const prefix = componentPrefix ? `--${componentPrefix}-` : '';

  if (customStyles['backgroundColor']) {
    const v = customStyles['backgroundColor'];
    result['--theme-bg'] = v;
    result['--component-bg'] = v;
    if (componentPrefix) result[`--${componentPrefix}-bg`] = v;
    result['background'] = v;
    result['background-color'] = v;
  }

  if (customStyles['color']) {
    const v = customStyles['color'];
    result['--theme-color'] = v;
    result['--component-text'] = v;
    if (componentPrefix) result[`--${componentPrefix}-color`] = v;
    result['color'] = v;
  }

  const skip = new Set(['backgroundColor', 'color']);
  Object.keys(customStyles).forEach((key) => {
    if (!skip.has(key) && customStyles[key] !== undefined) {
      result[key] = customStyles[key] as string;
    }
  });

  return result;
}
