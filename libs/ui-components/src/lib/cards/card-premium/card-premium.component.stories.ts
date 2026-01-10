import type { Meta, StoryObj } from '@storybook/angular';
import { UICardPremiumComponent } from './card-premium.component';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<UICardPremiumComponent> = {
  component: UICardPremiumComponent,
  title: 'UICardPremiumComponent',
};
export default meta;
type Story = StoryObj<UICardPremiumComponent>;

export const Primary: Story = {
  args: {
    config: {
      icon: 'heroStar',
      title: 'Card Title',
      description: 'This is a premium card description.',
      image: '',
      price: '',
      discount: '',
      tooltip: ''
    },
    variant: 'primary',
    customStyles: {},
  },
};

export const Heading: Story = {
  args: {
    config: {
      icon: 'heroStar',
      title: 'Card Title',
      description: 'This is a premium card description.',
      image: '',
      price: '',
      discount: '',
      tooltip: ''
    },
    variant: 'primary',
    customStyles: {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/card-premium works!/gi)).toBeTruthy();
  },
};
