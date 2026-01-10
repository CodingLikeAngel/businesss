import type { Meta, StoryObj } from '@storybook/angular';
import { UICardAnimatedComponent } from './card-animated.component';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<UICardAnimatedComponent> = {
  component: UICardAnimatedComponent,
  title: 'UICardAnimatedComponent',
};
export default meta;
type Story = StoryObj<UICardAnimatedComponent>;

export const Primary: Story = {
  args: {
    icon: '🌟',
    title: 'Título',
    id: 'id',
    subtitle: '',
    description: 'Descripción breve de la tarjeta.',
    variant: 'default',
    borderColor: '#22d3ee',
    textColor: '#f8fafc',
    backgroundColor: 'rgba(47, 79, 79, 0.9)',
    hoverColor: '#ffd700',
    animation: 'bounce',
    animationDelay: '0s',
    image: '',
    price: 0,
    tags: [],
    avatar: '',
    rating: 0,
    link: '',
    customStyles: {},
    frontContent: { title: '' },
    backContent: { description: '' },
    dark: false,
  },
};

export const Heading: Story = {
  args: {
    icon: '🌟',
    title: 'Título',
    id: 'id',
    subtitle: '',
    description: 'Descripción breve de la tarjeta.',
    variant: 'default',
    borderColor: '#22d3ee',
    textColor: '#f8fafc',
    backgroundColor: 'rgba(47, 79, 79, 0.9)',
    hoverColor: '#ffd700',
    animation: 'bounce',
    animationDelay: '0s',
    image: '',
    price: 0,
    tags: [],
    avatar: '',
    rating: 0,
    link: '',
    customStyles: {},
    frontContent: { title: '' },
    backContent: { description: '' },
    dark: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/card-animated works!/gi)).toBeTruthy();
  },
};
