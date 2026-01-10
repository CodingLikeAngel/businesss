import type { Meta, StoryObj } from '@storybook/angular';
import { UIChipComponent } from './chip.component';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<UIChipComponent> = {
  component: UIChipComponent,
  title: 'UIChipComponent',
};
export default meta;
type Story = StoryObj<UIChipComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/chip works!/gi)).toBeTruthy();
  },
};
