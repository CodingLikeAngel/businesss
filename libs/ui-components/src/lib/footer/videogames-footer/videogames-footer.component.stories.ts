import type { Meta, StoryObj } from '@storybook/angular';
import { UIVideogamesFooterComponent } from './videogames-footer.component';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<UIVideogamesFooterComponent> = {
  component: UIVideogamesFooterComponent,
  title: 'UIVideogamesFooterComponent',
};
export default meta;
type Story = StoryObj<UIVideogamesFooterComponent>;

export const Primary: Story = {
  args: {
    variant: 'arcade',
    title: 'Your Business',
    description: 'Impulsa tu éxito con nosotros',
    exploreLinks: [
      { label: 'Servicios', href: '#', icon: '⚙️' },
      { label: 'Productos', href: '#', icon: '🛍️' },
      { label: 'Nosotros', href: '#', icon: '👥' },
      { label: 'Contacto', href: '#', icon: '📞' },
    ],
    trendLinks: [
      { label: 'Blog', href: '#', icon: '📝' },
      { label: 'FAQ', href: '#', icon: '❓' },
      { label: 'Soporte', href: '#', icon: '🛠️' },
    ],
    socialIcons: [
      { name: 'twitter', href: '#' },
      { name: 'facebook', href: '#' },
      { name: 'instagram', href: '#' },
      { name: 'linkedin', href: '#' },
    ],
    copyrightText:
      '© {{currentYear}} Your Business - Todos los derechos reservados',
    showParticles: true,
    customStyles: {},
  },
};

export const Heading: Story = {
  args: {
    variant: 'arcade',
    title: 'Your Business',
    description: 'Impulsa tu éxito con nosotros',
    exploreLinks: [
      { label: 'Servicios', href: '#', icon: '⚙️' },
      { label: 'Productos', href: '#', icon: '🛍️' },
      { label: 'Nosotros', href: '#', icon: '👥' },
      { label: 'Contacto', href: '#', icon: '📞' },
    ],
    trendLinks: [
      { label: 'Blog', href: '#', icon: '📝' },
      { label: 'FAQ', href: '#', icon: '❓' },
      { label: 'Soporte', href: '#', icon: '🛠️' },
    ],
    socialIcons: [
      { name: 'twitter', href: '#' },
      { name: 'facebook', href: '#' },
      { name: 'instagram', href: '#' },
      { name: 'linkedin', href: '#' },
    ],
    copyrightText:
      '© {{currentYear}} Your Business - Todos los derechos reservados',
    showParticles: true,
    customStyles: {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/videogames-footer works!/gi)).toBeTruthy();
  },
};
