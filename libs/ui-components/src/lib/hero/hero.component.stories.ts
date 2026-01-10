import type { Meta, StoryObj } from '@storybook/angular';
import { UIHeroSectionComponent } from './hero.component';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<UIHeroSectionComponent> = {
  component: UIHeroSectionComponent,
  title: 'UIHeroSectionComponent',
};
export default meta;
type Story = StoryObj<UIHeroSectionComponent>;

export const Primary: Story = {
  args: {
    title: 'Foro Pesca León',
    subtitle:
      '¡Bienvenido al futuro de la pesca en León! Explora ríos, capturas y normativas en un espacio único.',
    variant: 'pesca',
    showDevelopmentMessage: true,
    showScrollIcon: true,
    navigationCards: [
      {
        icon: '📊',
        title: 'Encuestas',
        description: 'Opina sobre leyes',
        animationDelay: '0.2s',
        sectionId: 'encuestas-section',
      },
      {
        icon: '🏞️',
        title: 'Ríos',
        description: 'Ríos de León',
        animationDelay: '0.6s',
        sectionId: 'rios-section',
      },
      {
        icon: '🐟',
        title: 'Fauna',
        description: 'Especies locales',
        animationDelay: '0.8s',
        sectionId: 'fauna-section',
      },
      {
        icon: '🗺️',
        title: 'Rutas',
        description: 'Rutas de pesca',
        animationDelay: '1s',
        sectionId: 'rutas-section',
      },
      {
        icon: '📸',
        title: 'Galería',
        description: 'Fotos del foro',
        animationDelay: '1.2s',
        sectionId: 'galeria-section',
      },
      {
        icon: '📜',
        title: 'Normativas',
        description: 'Reglas oficiales',
        animationDelay: '1.4s',
        sectionId: 'normativas-section',
      },
      {
        icon: '🎣',
        title: 'Modalidades',
        description: 'Tipos de pesca',
        animationDelay: '1.6s',
        sectionId: 'modalidades-section',
      },
      {
        icon: '💬',
        title: 'Foro',
        description: 'Comunidad',
        animationDelay: '1.8s',
        sectionId: 'foro-section',
      },
    ],
    customStyles: {},
  },
};

export const Heading: Story = {
  args: {
    title: 'Foro Pesca León',
    subtitle:
      '¡Bienvenido al futuro de la pesca en León! Explora ríos, capturas y normativas en un espacio único.',
    variant: 'pesca',
    showDevelopmentMessage: true,
    showScrollIcon: true,
    navigationCards: [
      {
        icon: '📊',
        title: 'Encuestas',
        description: 'Opina sobre leyes',
        animationDelay: '0.2s',
        sectionId: 'encuestas-section',
      },
      {
        icon: '🏞️',
        title: 'Ríos',
        description: 'Ríos de León',
        animationDelay: '0.6s',
        sectionId: 'rios-section',
      },
      {
        icon: '🐟',
        title: 'Fauna',
        description: 'Especies locales',
        animationDelay: '0.8s',
        sectionId: 'fauna-section',
      },
      {
        icon: '🗺️',
        title: 'Rutas',
        description: 'Rutas de pesca',
        animationDelay: '1s',
        sectionId: 'rutas-section',
      },
      {
        icon: '📸',
        title: 'Galería',
        description: 'Fotos del foro',
        animationDelay: '1.2s',
        sectionId: 'galeria-section',
      },
      {
        icon: '📜',
        title: 'Normativas',
        description: 'Reglas oficiales',
        animationDelay: '1.4s',
        sectionId: 'normativas-section',
      },
      {
        icon: '🎣',
        title: 'Modalidades',
        description: 'Tipos de pesca',
        animationDelay: '1.6s',
        sectionId: 'modalidades-section',
      },
      {
        icon: '💬',
        title: 'Foro',
        description: 'Comunidad',
        animationDelay: '1.8s',
        sectionId: 'foro-section',
      },
    ],
    customStyles: {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/hero works!/gi)).toBeTruthy();
  },
};
