import type { Meta, StoryObj } from '@storybook/angular';
import { UITooltipComponent } from './tooltip.component';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<UITooltipComponent> = {
  component: UITooltipComponent,
  title: 'UITooltipComponent',
};
export default meta;
type Story = StoryObj<UITooltipComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/tooltip works!/gi)).toBeTruthy();
  },
};
