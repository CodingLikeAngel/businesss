import type { Meta, StoryObj } from '@storybook/angular';
import { UICardComponent } from './card.component';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<UICardComponent> = {
  component: UICardComponent,
  title: 'UICardComponent',
};
export default meta;
type Story = StoryObj<UICardComponent>;

export const Primary: Story = {
  args: {
    variant: 'default',
    image: '',
    title: 'Card Title',
    description: 'This is a description for the card.',
    actions: [],
    animation: 'none',
    size: 'medium',
    customStyles: {},
  },
};

export const Heading: Story = {
  args: {
    variant: 'default',
    image: '',
    title: 'Card Title',
    description: 'This is a description for the card.',
    actions: [],
    animation: 'none',
    size: 'medium',
    customStyles: {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/card works!/gi)).toBeTruthy();
  },
};
