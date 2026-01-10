import type { Meta, StoryObj } from '@storybook/angular';
import { UIModalComponent } from './modal.component';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<UIModalComponent> = {
  component: UIModalComponent,
  title: 'UIModalComponent',
};
export default meta;
type Story = StoryObj<UIModalComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/modal works!/gi)).toBeTruthy();
  },
};
