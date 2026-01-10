import type { Meta, StoryObj } from '@storybook/angular';
import { UIChartComponent } from './chart.component';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<UIChartComponent> = {
  component: UIChartComponent,
  title: 'UIChartComponent',
};
export default meta;
type Story = StoryObj<UIChartComponent>;

export const Primary: Story = {
  args: {
    customStyles: {},
  },
};

export const Heading: Story = {
  args: {
    customStyles: {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/chart works!/gi)).toBeTruthy();
  },
};
