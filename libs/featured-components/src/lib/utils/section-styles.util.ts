import { CustomStyles } from '../models/custom-styles.interface';

/**
 * Maps CustomStyles to a style object that sets theme and component CSS variables
 * plus common properties. Use in section components for consistent theming.
 */
export function applySectionStyles(customStyles: CustomStyles = {}): Record<string, string | number> {
  const styles: Record<string, string | number> = {};

  if (customStyles['backgroundColor']) {
    styles['--theme-bg'] = customStyles['backgroundColor'];
    styles['--component-bg'] = customStyles['backgroundColor'];
    styles['background-color'] = customStyles['backgroundColor'];
  }

  if (customStyles['color']) {
    styles['--theme-color'] = customStyles['color'];
    styles['--component-text'] = customStyles['color'];
    styles['color'] = customStyles['color'];
  }

  Object.keys(customStyles).forEach((key) => {
    if (key !== 'backgroundColor' && key !== 'color' && customStyles[key] != null) {
      styles[key] = customStyles[key] as string;
    }
  });

  return styles;
}
