# Isolated Modes Documentation

## Overview

Isolated Mode components provide a premium editing experience for section editors in the Visual Editor System. Each isolated mode offers a focused, distraction-free environment for editing specific types of content sections with comprehensive controls and real-time preview.

## Architecture

### Core Components

All isolated mode components follow a consistent architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                    Isolated Mode Container                    │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    Header (Breadcrumb)                    ││
│  ├─────────────────────────────────────────────────────────┤│
│  │  ┌──────────────────────┐ ┌─────────────────────────┐  ││
│  │  │   Sidebar Controls   │ │   Canvas Preview        │  ││
│  │  │  - Content Section   │ │  - Live Preview         │  ││
│  │  │  - Items Section     │ │  - Real-time Updates    │  ││
│  │  │  - Styling Section   │ │  - Info Dock            │  ││
│  │  └──────────────────────┘ └─────────────────────────┘  ││
│  ├─────────────────────────────────────────────────────────┤│
│  │                    Footer (Actions)                     ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Features

- **Premium Dark Theme**: Consistent styling across all isolated modes
- **Real-time Preview**: Live preview canvas with instant updates
- **Comprehensive Controls**: Sidebar with content, items, and styling sections
- **Keyboard Shortcuts**: Escape to close, Enter to apply
- **Responsive Design**: Works on various screen sizes
- **Accessibility**: Full keyboard navigation support

---

## Standard Isolated Modes

### 1. Hero Isolated Mode

**Location**: `libs/shared-components/src/lib/shared-components/variant-selector/hero-isolated-mode/`

**Component**: `EditorHeroIsolatedModeComponent`

**Features**:
- Title and subtitle editing
- Background image URL
- Button text and link
- Overlay opacity control
- Background/text/button colors

**Interface**:
```typescript
interface HeroIsolatedModeContent {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  buttonText?: string;
  buttonLink?: string;
  overlayOpacity?: number;
  variant?: string;
  backgroundColor?: string;
  textColor?: string;
  buttonColor?: string;
}
```

---

### 2. Features Isolated Mode

**Location**: `libs/shared-components/src/lib/shared-components/variant-selector/features-isolated-mode/`

**Component**: `EditorFeaturesIsolatedModeComponent`

**Features**:
- Section title and subtitle
- Feature items management (add/remove/reorder)
- Icon selection
- Feature title and description
- Grid layout options
- Styling controls

**Interface**:
```typescript
interface FeatureItem {
  title: string;
  description: string;
  icon: string;
  iconUrl?: string;
}

interface FeaturesIsolatedModeContent {
  title?: string;
  subtitle?: string;
  items?: FeatureItem[];
  variant?: string;
  columns?: number;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}
```

---

### 3. Testimonials Isolated Mode

**Location**: `libs/shared-components/src/lib/shared-components/variant-selector/testimonials-isolated-mode/`

**Component**: `EditorTestimonialsIsolatedModeComponent`

**Features**:
- Section title and subtitle
- Testimonial cards management
- Author name, role, and avatar
- Quote text
- Rating system
- Layout variants (grid, carousel, single)

**Interface**:
```typescript
interface TestimonialItem {
  author: string;
  role: string;
  quote: string;
  avatar?: string;
  rating?: number;
}

interface TestimonialsIsolatedModeContent {
  title?: string;
  subtitle?: string;
  items?: TestimonialItem[];
  variant?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}
```

---

### 4. Pricing Isolated Mode

**Location**: `libs/shared-components/src/lib/shared-components/variant-selector/pricing-isolated-mode/`

**Component**: `EditorPricingIsolatedModeComponent`

**Features**:
- Section title and subtitle
- Pricing plans management
- Plan name, price, and billing period
- Feature list per plan
- "Popular" badge toggle
- Call-to-action button

**Interface**:
```typescript
interface PricingPlan {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  isPopular?: boolean;
  buttonText?: string;
  buttonUrl?: string;
}

interface PricingIsolatedModeContent {
  title?: string;
  subtitle?: string;
  plans?: PricingPlan[];
  variant?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}
```

---

### 5. Gallery Isolated Mode

**Location**: `libs/shared-components/src/lib/shared-components/variant-selector/gallery-isolated-mode/`

**Component**: `EditorGalleryIsolatedModeComponent`

**Features**:
- Section title and subtitle
- Image management (add/remove)
- Image URL and alt text
- Hover effects options
- Layout variants (grid, masonry, carousel)
- Lightbox toggle

**Interface**:
```typescript
interface GalleryImage {
  src: string;
  alt?: string;
  title?: string;
  caption?: string;
}

interface GalleryIsolatedModeContent {
  title?: string;
  subtitle?: string;
  images?: GalleryImage[];
  variant?: string;
  columns?: number;
  backgroundColor?: string;
  textColor?: string;
}
```

---

### 6. Contact Isolated Mode

**Location**: `libs/shared-components/src/lib/shared-components/variant-selector/contact-isolated-mode/`

**Component**: `EditorContactIsolatedModeComponent`

**Features**:
- Section title and subtitle
- Contact information (email, phone, address)
- Social media links
- Form fields customization
- Map integration option
- Business hours

**Interface**:
```typescript
interface ContactIsolatedModeContent {
  title?: string;
  subtitle?: string;
  email?: string;
  phone?: string;
  address?: string;
  mapUrl?: string;
  socialLinks?: { platform: string; url: string }[];
  businessHours?: { day: string; hours: string }[];
  variant?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}
```

---

### 7. CTA Isolated Mode

**Location**: `libs/shared-components/src/lib/shared-components/variant-selector/cta-isolated-mode/`

**Component**: `EditorCtaIsolatedModeComponent`

**Features**:
- Section title and subtitle
- Button text and link
- Background options (color, gradient, image)
- Text alignment
- Secondary button option

**Interface**:
```typescript
interface CtaIsolatedModeContent {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  variant?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}
```

---

### 8. Stats Isolated Mode

**Location**: `libs/shared-components/src/lib/shared-components/variant-selector/stats-isolated-mode/`

**Component**: `EditorStatsIsolatedModeComponent`

**Features**:
- Section title and subtitle
- Stat items management
- Icon, value, and label per stat
- Animation options
- Layout variants

**Interface**:
```typescript
interface StatItem {
  icon?: string;
  value: string;
  label: string;
  suffix?: string;
  prefix?: string;
}

interface StatsIsolatedModeContent {
  title?: string;
  subtitle?: string;
  stats?: StatItem[];
  variant?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}
```

---

### 9. Products Isolated Mode

**Location**: `libs/shared-components/src/lib/shared-components/variant-selector/products-isolated-mode/`

**Component**: `EditorProductsIsolatedModeComponent`

**Features**:
- Section title and subtitle
- Product cards management
- Product name, price, and description
- Image URL
- Sale badge
- Quick view option

**Interface**:
```typescript
interface ProductItem {
  name: string;
  description?: string;
  price: string;
  salePrice?: string;
  imageUrl?: string;
  isOnSale?: boolean;
  badge?: string;
}

interface ProductsIsolatedModeContent {
  title?: string;
  subtitle?: string;
  products?: ProductItem[];
  variant?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}
```

---

### 10. Newsletter Isolated Mode

**Location**: `libs/shared-components/src/lib/shared-components/variant-selector/newsletter-isolated-mode/`

**Component**: `EditorNewsletterIsolatedModeComponent`

**Features**:
- Section title and subtitle
- Placeholder text
- Button text
- Success message
- Layout variants
- Social proof options

**Interface**:
```typescript
interface NewsletterIsolatedModeContent {
  title?: string;
  subtitle?: string;
  placeholder?: string;
  buttonText?: string;
  successMessage?: string;
  variant?: string;
  backgroundColor?: string;
  textColor?: string;
  buttonColor?: string;
}
```

---

### 11. FAQ Isolated Mode

**Location**: `libs/shared-components/src/lib/shared-components/variant-selector/faq-isolated-mode/`

**Component**: `EditorFaqIsolatedModeComponent`

**Features**:
- Section title and subtitle
- FAQ items management
- Question and answer
- Expandable/collapsible
- Multiple layout options

**Interface**:
```typescript
interface FaqItem {
  question: string;
  answer: string;
  isExpanded?: boolean;
}

interface FaqIsolatedModeContent {
  title?: string;
  subtitle?: string;
  items?: FaqItem[];
  variant?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}
```

---

### 12. Steps Isolated Mode

**Location**: `libs/shared-components/src/lib/shared-components/variant-selector/steps-isolated-mode/`

**Component**: `EditorStepsIsolatedModeComponent`

**Features**:
- Section title and subtitle
- Step items management
- Step number, title, and description
- Icon per step
- Timeline layout

**Interface**:
```typescript
interface StepItem {
  number: string;
  title: string;
  description?: string;
  icon?: string;
}

interface StepsIsolatedModeContent {
  title?: string;
  subtitle?: string;
  steps?: StepItem[];
  variant?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}
```

---

### 13. Reservation Isolated Mode

**Location**: `libs/shared-components/src/lib/shared-components/variant-selector/reservation-isolated-mode/`

**Component**: `EditorReservationIsolatedModeComponent`

**Features**:
- Section title and subtitle
- Form fields customization
- Date/time picker options
- Confirmation message
- Contact fields

**Interface**:
```typescript
interface ReservationIsolatedModeContent {
  title?: string;
  subtitle?: string;
  variant?: string;
  backgroundColor?: string;
  textColor?: string;
  buttonColor?: string;
}
```

---

### 14. Promotions Isolated Mode

**Location**: `libs/shared-components/src/lib/shared-components/variant-selector/promotions-isolated-mode/`

**Component**: `EditorPromotionsIsolatedModeComponent`

**Features**:
- Section title and subtitle
- Promotion cards management
- Discount and code
- Expiration date
- Image support
- Layout variants

**Interface**:
```typescript
interface PromotionItem {
  title: string;
  description: string;
  discount: string;
  code?: string;
  imageUrl?: string;
  expiresAt?: string;
}

interface PromotionsIsolatedModeContent {
  title?: string;
  subtitle?: string;
  promotions?: PromotionItem[];
  variant?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  buttonColor?: string;
}
```

---

## Industry-Specific Isolated Modes

### 15. Restaurant Isolated Mode

**Location**: `libs/shared-components/src/lib/shared-components/variant-selector/restaurant-isolated-mode/`

**Component**: `EditorRestaurantIsolatedModeComponent`

**Features**:
- Restaurant name and tagline
- Menu items management
  - Name, description, price, category
  - Dietary flags (vegetarian, vegan, gluten-free)
- Restaurant features
- Elegant styling options

**Interface**:
```typescript
interface MenuItem {
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl?: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
}

interface RestaurantIsolatedModeContent {
  restaurantName?: string;
  tagline?: string;
  description?: string;
  menuItems?: MenuItem[];
  features?: { title: string; description: string; icon: string }[];
  variant?: 'elegant' | 'casual' | 'moderno' | 'tradicional';
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  buttonColor?: string;
}
```

---

### 16. Gym Isolated Mode

**Location**: `libs/shared-components/src/lib/shared-components/variant-selector/gym-isolated-mode/`

**Component**: `EditorGymIsolatedModeComponent`

**Features**:
- Gym name and tagline
- Classes management
  - Name, description, duration
  - Intensity level (baja/media/alta)
  - Schedule and instructor
- Membership plans
- Stats display

**Interface**:
```typescript
interface GymClass {
  name: string;
  description: string;
  duration: string;
  intensity: 'baja' | 'media' | 'alta';
  schedule: string;
  instructor: string;
  imageUrl?: string;
}

interface GymMembershipPlan {
  name: string;
  price: string;
  features: string[];
  isPopular?: boolean;
}

interface GymIsolatedModeContent {
  gymName?: string;
  tagline?: string;
  description?: string;
  classes?: GymClass[];
  plans?: GymMembershipPlan[];
  variant?: 'energetic' | 'modern' | 'classic' | 'premium';
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  buttonColor?: string;
}
```

---

### 17. Spa Isolated Mode

**Location**: `libs/shared-components/src/lib/shared-components/variant-selector/spa-isolated-mode/`

**Component**: `EditorSpaIsolatedModeComponent`

**Features**:
- Spa name and tagline
- Treatments management
  - Name, description, duration, price
  - Benefits list
- Facilities/features
- Testimonial section
- Relaxing styling options

**Interface**:
```typescript
interface SpaTreatment {
  name: string;
  description: string;
  duration: string;
  price: string;
  benefits: string[];
  imageUrl?: string;
}

interface SpaIsolatedModeContent {
  spaName?: string;
  tagline?: string;
  description?: string;
  treatments?: SpaTreatment[];
  features?: { title: string; description: string; icon: string }[];
  testimonial?: { author: string; role: string; quote: string };
  variant?: 'relaxing' | 'luxury' | 'natural' | 'minimal';
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  buttonColor?: string;
}
```

---

## Integration Service

### IsolatedModeIntegrationService

**Location**: `libs/shared-components/src/lib/shared-components/variant-selector/isolated-mode-integration.service.ts`

**Purpose**: Connects isolated mode editors with actual featured components for seamless editing experience.

**Key Methods**:

```typescript
// Component Registration
registerComponent(
  componentId: string,
  componentType: IsolatedModeComponentType,
  instance: object,
  config?: Partial<ComponentRegistrationConfig>
): void

unregisterComponent(componentId: string): void
getRegisteredComponent<T>(componentId: string): T | null

// Session Management
openIsolatedMode(
  componentId: string,
  modeType: IsolatedModeComponentType,
  initialConfig?: Partial<IsolatedModeConfig>
): IsolatedModeSession | null

closeIsolatedMode(applyChanges: boolean): void
applyChangesToComponent(componentId: string, changes: object): void
```

**Supported Component Types**:
```typescript
type IsolatedModeComponentType =
  | 'hero' | 'features' | 'testimonials' | 'pricing' | 'gallery'
  | 'contact' | 'cta' | 'stats' | 'products' | 'newsletter'
  | 'faq' | 'steps' | 'reservation' | 'promotions'
  | 'restaurant' | 'gym' | 'spa';
```

---

## Usage Examples

### Opening an Isolated Mode

```typescript
import { IsolatedModeIntegrationService, IsolatedModeComponentType } from '@negocio/shared-components';

constructor(private integrationService: IsolatedModeIntegrationService) {}

openHeroEditor() {
  const session = this.integrationService.openIsolatedMode(
    'hero-section-1',
    'hero',
    { content: { title: 'Welcome' } }
  );
}
```

### Subscribing to Events

```typescript
this.integrationService.sessionEvents$.subscribe(event => {
  if (event) {
    console.log('Isolated mode event:', event.type);
    if (event.type === 'applied') {
      // Handle changes applied
    }
  }
});
```

### Registering a Component

```typescript
this.integrationService.registerComponent(
  'promotions-section-1',
  'promotions',
  this.promotionsComponent,
  {
    isEditable: true,
    supportedVariants: ['cards', 'banner', 'grid'],
    defaultConfig: { title: 'Special Offers' }
  }
);
```

---

## Styling

### CSS Variables

All isolated modes use consistent CSS variables:

```scss
--isolated-bg: #0f172a;
--isolated-text: #ffffff;
--isolated-border: rgba(255, 255, 255, 0.1);
--isolated-accent: #6366f1;
--isolated-success: #22c55e;
--isolated-warning: #eab308;
--isolated-error: #ef4444;
--isolated-dock-bg: rgba(15, 23, 42, 0.95);
```

### Common Classes

- `.isolated-mode-overlay` - Full-screen overlay
- `.isolated-mode-container` - Main container
- `.controls-sidebar` - Sidebar controls panel
- `.isolated-canvas` - Preview canvas area
- `.modern-position-dock` - Info dock at bottom right

---

## File Structure

```
libs/shared-components/src/lib/shared-components/variant-selector/
├── hero-isolated-mode/
│   ├── editor-hero-isolated-mode.component.ts
│   ├── editor-hero-isolated-mode.component.scss
│   └── index.ts
├── features-isolated-mode/
│   ├── editor-features-isolated-mode.component.ts
│   ├── editor-features-isolated-mode.component.scss
│   └── index.ts
├── testimonials-isolated-mode/
│   ├── editor-testimonials-isolated-mode.component.ts
│   ├── editor-testimonials-isolated-mode.component.scss
│   └── index.ts
├── pricing-isolated-mode/
│   ├── editor-pricing-isolated-mode.component.ts
│   ├── editor-pricing-isolated-mode.component.scss
│   └── index.ts
├── gallery-isolated-mode/
│   ├── editor-gallery-isolated-mode.component.ts
│   ├── editor-gallery-isolated-mode.component.scss
│   └── index.ts
├── contact-isolated-mode/
│   ├── editor-contact-isolated-mode.component.ts
│   ├── editor-contact-isolated-mode.component.scss
│   └── index.ts
├── cta-isolated-mode/
│   ├── editor-cta-isolated-mode.component.ts
│   ├── editor-cta-isolated-mode.component.scss
│   └── index.ts
├── stats-isolated-mode/
│   ├── editor-stats-isolated-mode.component.ts
│   ├── editor-stats-isolated-mode.component.scss
│   └── index.ts
├── products-isolated-mode/
│   ├── editor-products-isolated-mode.component.ts
│   ├── editor-products-isolated-mode.component.scss
│   └── index.ts
├── newsletter-isolated-mode/
│   ├── editor-newsletter-isolated-mode.component.ts
│   ├── editor-newsletter-isolated-mode.component.scss
│   └── index.ts
├── faq-isolated-mode/
│   ├── editor-faq-isolated-mode.component.ts
│   ├── editor-faq-isolated-mode.component.scss
│   └── index.ts
├── steps-isolated-mode/
│   ├── editor-steps-isolated-mode.component.ts
│   ├── editor-steps-isolated-mode.component.scss
│   └── index.ts
├── reservation-isolated-mode/
│   ├── editor-reservation-isolated-mode.component.ts
│   ├── editor-reservation-isolated-mode.component.scss
│   └── index.ts
├── promotions-isolated-mode/
│   ├── editor-promotions-isolated-mode.component.ts
│   ├── editor-promotions-isolated-mode.component.scss
│   └── index.ts
├── restaurant-isolated-mode/
│   ├── editor-restaurant-isolated-mode.component.ts
│   ├── editor-restaurant-isolated-mode.component.scss
│   └── index.ts
├── gym-isolated-mode/
│   ├── editor-gym-isolated-mode.component.ts
│   ├── editor-gym-isolated-mode.component.scss
│   └── index.ts
├── spa-isolated-mode/
│   ├── editor-spa-isolated-mode.component.ts
│   ├── editor-spa-isolated-mode.component.scss
│   └── index.ts
├── isolated-mode-integration.service.ts
└── enhanced-visual-editing.interfaces.ts
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-01 | Initial release with 14 standard isolated modes |
| 1.1.0 | 2024-02 | Added Restaurant, Gym, Spa isolated modes |
| 1.2.0 | 2024-02 | Added IsolatedModeIntegrationService |

---

## Best Practices

1. **Consistent Interface**: All isolated modes follow the same input/output patterns
2. **Signal-Based State**: Use Angular signals for reactive state management
3. **Accessibility**: Ensure keyboard navigation works in all modes
4. **Performance**: Lazy load isolated modes when possible
5. **Testing**: Write unit tests for each isolated mode component
6. **Documentation**: Keep interfaces and examples up to date
