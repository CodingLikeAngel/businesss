export interface CustomStyles {
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  borderRadius?: string;
  padding?: string;
  margin?: string;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: string;
  boxShadow?: string;
  opacity?: string;
  // CSS custom properties
  '--theme-bg'?: string;
  '--theme-color'?: string;
  '--component-bg'?: string;
  '--component-text'?: string;
  '--component-border'?: string;
  '--component-shadow'?: string;
  '--component-hover-bg'?: string;
  '--component-hover-color'?: string;
  // Component-specific custom properties
  '--hero-bg'?: string;
  '--hero-color'?: string;
  '--hero-border'?: string;
  '--hero-shadow'?: string;
  '--hero-hover-bg'?: string;
  '--hero-hover-shadow'?: string;
  '--business-bg-image'?: string;
  '--accordion-bg'?: string;
  '--accordion-color'?: string;
  '--accordion-border'?: string;
  '--accordion-shadow'?: string;
  '--accordion-hover-bg'?: string;
  '--accordion-hover-shadow'?: string;
  '--accordion-header-bg'?: string;
  '--accordion-header-hover-bg'?: string;
  '--accordion-content-bg'?: string;
  '--accordion-content-color'?: string;
  '--accordion-item-border'?: string;
  // Allow any other CSS properties
  [key: string]: string | undefined;
}