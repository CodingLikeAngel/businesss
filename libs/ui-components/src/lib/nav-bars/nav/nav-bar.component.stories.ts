import type { Meta, StoryObj } from '@storybook/angular';
import { UINavBarComponent } from './nav-bar.component';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<UINavBarComponent> = {
  component: UINavBarComponent,
  title: 'UINavBarComponent',
};
export default meta;
type Story = StoryObj<UINavBarComponent>;

export const Primary: Story = {
  args: {
    variant: 'default',
    logoText: 'Foro León',
    navLinks: [
      { label: 'Inicio', href: '#home', icon: '🏠' },
      { label: 'Pesca', href: '#pesca', icon: '🎣' },
      { label: 'Senderismo', href: '#senderismo', icon: '🏞️' },
      { label: 'Foro', href: '#foro', icon: '💬' },
      { label: 'Contacto', href: '#contacto', icon: '✉️' },
    ],
    showMobileMenu: true,
    isFixed: true,
    customStyles: {},
  },
};

export const Heading: Story = {
  args: {
    variant: 'default',
    logoText: 'Foro León',
    navLinks: [
      { label: 'Inicio', href: '#home', icon: '🏠' },
      { label: 'Pesca', href: '#pesca', icon: '🎣' },
      { label: 'Senderismo', href: '#senderismo', icon: '🏞️' },
      { label: 'Foro', href: '#foro', icon: '💬' },
      { label: 'Contacto', href: '#contacto', icon: '✉️' },
    ],
    showMobileMenu: true,
    isFixed: true,
    customStyles: {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/nav-bar works!/gi)).toBeTruthy();
  },
};
