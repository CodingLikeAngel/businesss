import type { Meta, StoryObj } from '@storybook/angular';
import { UIImageComponent } from './image.component';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<UIImageComponent> = {
  component: UIImageComponent,
  title: 'UIImageComponent',
};
export default meta;
type Story = StoryObj<UIImageComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/image works!/gi)).toBeTruthy();
  },
};
