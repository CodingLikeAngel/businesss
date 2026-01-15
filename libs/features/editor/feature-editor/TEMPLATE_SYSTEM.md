# 🎨 Template System - Phase 2 Implementation

## Overview

The Template System provides users with pre-built, professional layouts and themes to kickstart their page building experience. Users can browse, preview, and apply templates across multiple categories.

## ✨ Features

### 1. **Template Gallery**

- **Beautiful UI**: Gradient background with smooth animations
- **Category Filtering**: Business, E-commerce, Portfolio, Restaurant, Landing Pages, Blog
- **Search Functionality**: Find templates by name, description, or tags
- **Preview Modal**: Full-screen template previews before applying
- **Premium Badge**: Visual indicator for premium templates
- **Responsive Design**: Works on mobile, tablet, and desktop

### 2. **Template Service**

- **6 Pre-built Templates**:

  - Modern Business (Free)
  - Creative Agency (Free)
  - Fashion Store (Premium)
  - Minimal Portfolio (Free)
  - Gourmet Restaurant (Premium)
  - SaaS Landing (Free)

- **Template Categories**:
  - 💼 Business
  - 🛒 E-commerce
  - 🎨 Portfolio
  - 🍽️ Restaurant
  - 🚀 Landing Pages
  - 📝 Blog

### 3. **Global Style Presets**

Each template includes customized global styles:

- Primary, secondary, and accent colors
- Typography (font families and sizes)
- Spacing system
- Border radius and shadows
- Custom CSS support

## 📁 File Structure

```
libs/features/editor/feature-editor/src/lib/
├── services/
│   └── template.service.ts          # Template management service
├── components/
│   └── template-gallery/
│       └── template-gallery.component.ts  # Gallery UI component
└── models/
    └── editor.model.ts               # Template interfaces
```

## 🚀 Usage

### Opening the Template Gallery

```typescript
import { TemplateGalleryComponent } from '@negocio/feature-editor';

// In your component template
<lib-template-gallery
  (templateSelected)="onTemplateSelected($event)"
  (closed)="onGalleryClosed()"
></lib-template-gallery>
```

### Using the Template Service

```typescript
import { TemplateService } from '@negocio/feature-editor';

export class YourComponent {
  constructor(private templateService: TemplateService) {}

  applyTemplate(templateId: string): void {
    const sections = this.templateService.applyTemplate(templateId);
    // Use the sections in your page builder
  }

  getTemplatesByCategory(category: string): Template[] {
    return this.templateService.getTemplatesByCategory(category);
  }
}
```

## 🎯 Template Structure

Each template includes:

```typescript
interface Template {
  id: string; // Unique identifier
  name: string; // Display name
  description: string; // Short description
  category: string; // Category ID
  thumbnail: string; // Thumbnail image URL
  preview: string; // Full preview image URL
  tags: string[]; // Search tags
  sections: Section[]; // Page sections
  globalStyles: GlobalStyles; // Style configuration
  popularity: number; // Popularity score (0-100)
  author: string; // Template author
  createdAt: Date; // Creation date
  updatedAt: Date; // Last update
  premium: boolean; // Premium flag
}
```

## 🎨 Adding New Templates

To add a new template:

1. **Create Section Definitions**:

```typescript
private getMyTemplateSections(): any[] {
  return [
    {
      id: 'hero-custom',
      type: 'hero',
      name: 'Custom Hero',
      position: { x: 0, y: 0 },
      styles: { minHeight: '100vh', backgroundColor: '#yourColor' },
      content: { title: 'Your Title', subtitle: 'Your Subtitle' },
      // ... other properties
    }
  ];
}
```

2. **Define Global Styles**:

```typescript
private getMyGlobalStyles(): any {
  return {
    primaryColor: '#667eea',
    secondaryColor: '#764ba2',
    accentColor: '#f093fb',
    backgroundColor: '#ffffff',
    textColor: '#2d3748',
    fontFamily: "'Inter', sans-serif",
    // ... other styles
  };
}
```

3. **Add to Template List**:

```typescript
{
  id: 'my-template',
  name: 'My Template',
  description: 'Description here',
  category: 'business',
  thumbnail: '/path/to/thumb.png',
  preview: '/path/to/preview.png',
  tags: ['modern', 'clean'],
  sections: this.getMyTemplateSections(),
  globalStyles: this.getMyGlobalStyles(),
  popularity: 85,
  author: 'Your Name',
  createdAt: new Date(),
  updatedAt: new Date(),
  premium: false
}
```

## 🎭 Style Presets

### Business Modern

- Primary: `#667eea` (Purple Blue)
- Secondary: `#764ba2` (Deep Purple)
- Font: Inter

### Creative Agency

- Primary: `#ff6b6b` (Coral Red)
- Secondary: `#4ecdc4` (Turquoise)
- Font: Poppins

### Fashion Store

- Primary: `#c9ada7` (Dusty Rose)
- Secondary: `#9a8c98` (Mauve)
- Font: Playfair Display

### Minimal Portfolio

- Primary: `#000000` (Black)
- Secondary: `#666666` (Gray)
- Font: Helvetica Neue

### Restaurant

- Primary: `#8b4513` (Saddle Brown)
- Secondary: `#d4a574` (Tan)
- Font: Cormorant Garamond

### SaaS Landing

- Primary: `#667eea` (Purple Blue)
- Secondary: `#764ba2` (Deep Purple)
- Font: Inter

## 🔧 Integration with Editor

The template system integrates seamlessly with the page builder:

1. **Template Selection**: User browses and selects a template
2. **Section Conversion**: Template sections are converted to PageSections
3. **Style Application**: Global styles are applied to the page
4. **Customization**: User can then customize the applied template

## 📊 Template Analytics

Track template usage:

- Most popular templates
- Category preferences
- Premium vs free usage
- Search queries

## 🎯 Next Steps (Phase 2 Continuation)

- [ ] Export/Import functionality (JSON, HTML, PDF)
- [ ] Collaboration features (real-time editing, comments)
- [ ] Template versioning
- [ ] User-created templates
- [ ] Template marketplace

## 🐛 Known Issues

None currently. Report issues to the development team.

## 📝 Notes

- Templates use placeholder images that should be replaced with actual assets
- Premium templates require authentication/payment integration
- Template thumbnails and previews should be generated automatically in production

---

**Created**: January 2024  
**Last Updated**: January 2024  
**Version**: 1.0.0
