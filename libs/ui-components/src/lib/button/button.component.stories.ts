import type { Meta, StoryObj } from '@storybook/angular';
import { UIButtonComponent } from './button.component';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<UIButtonComponent> = {
  component: UIButtonComponent,
  title: 'UIButtonComponent',
};
export default meta;
type Story = StoryObj<UIButtonComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/button works!/gi)).toBeTruthy();
  },
};
