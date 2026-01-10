import type { Meta, StoryObj } from '@storybook/angular';
import { ForestAnimationComponent } from './forest-animation.component';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<ForestAnimationComponent> = {
  component: ForestAnimationComponent,
  title: 'ForestAnimationComponent',
};
export default meta;
type Story = StoryObj<ForestAnimationComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/forest-animation works!/gi)).toBeTruthy();
  },
};
