import type { Meta, StoryObj } from '@storybook/angular';
import { UIFooterComponent } from './footer.component';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<UIFooterComponent> = {
  component: UIFooterComponent,
  title: 'UIFooterComponent',
};
export default meta;
type Story = StoryObj<UIFooterComponent>;

export const Primary: Story = {
  args: {
    dark: false,
    variant: 'primary',
    title: 'Outdoor Haven',
    description: 'Todo lo que necesitas para tus aventuras al aire libre',
    exploreLinks: [
      { label: 'Pesca', href: '#', icon: '🎣' },
      { label: 'Caza', href: '#', icon: '🏹' },
      { label: 'Senderismo', href: '#', icon: '🏔️' },
      { label: 'Comida', href: '#', icon: '🍖' },
    ],
    trendLinks: [
      { label: 'Ayuda', href: '#', icon: '❓' },
      { label: 'Devoluciones', href: '#', icon: '🔄' },
      { label: 'Contacto', href: '#', icon: '✉️' },
    ],
    socialIcons: [
      { name: 'twitter', href: '#' },
      { name: 'facebook', href: '#' },
      { name: 'instagram', href: '#' },
    ],
    copyrightText:
      '© {{currentYear}} Outdoor Haven - Equípate para la naturaleza',
    showParticles: true,
    customStyles: {},
  },
};

export const Heading: Story = {
  args: {
    dark: false,
    variant: 'primary',
    title: 'Outdoor Haven',
    description: 'Todo lo que necesitas para tus aventuras al aire libre',
    exploreLinks: [
      { label: 'Pesca', href: '#', icon: '🎣' },
      { label: 'Caza', href: '#', icon: '🏹' },
      { label: 'Senderismo', href: '#', icon: '🏔️' },
      { label: 'Comida', href: '#', icon: '🍖' },
    ],
    trendLinks: [
      { label: 'Ayuda', href: '#', icon: '❓' },
      { label: 'Devoluciones', href: '#', icon: '🔄' },
      { label: 'Contacto', href: '#', icon: '✉️' },
    ],
    socialIcons: [
      { name: 'twitter', href: '#' },
      { name: 'facebook', href: '#' },
      { name: 'instagram', href: '#' },
    ],
    copyrightText:
      '© {{currentYear}} Outdoor Haven - Equípate para la naturaleza',
    showParticles: true,
    customStyles: {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/footer works!/gi)).toBeTruthy();
  },
};
