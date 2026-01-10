import type { Meta, StoryObj } from '@storybook/angular';
import { WaterAnimationComponent } from './water-animation.component';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<WaterAnimationComponent> = {
  component: WaterAnimationComponent,
  title: 'WaterAnimationComponent',
};
export default meta;
type Story = StoryObj<WaterAnimationComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/water-animation works!/gi)).toBeTruthy();
  },
};
