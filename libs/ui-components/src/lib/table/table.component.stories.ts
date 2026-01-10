import type { Meta, StoryObj } from '@storybook/angular';
import { UITableComponent } from './table.component';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<UITableComponent> = {
  component: UITableComponent,
  title: 'UITableComponent',
};
export default meta;
type Story = StoryObj<UITableComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/table works!/gi)).toBeTruthy();
  },
};
