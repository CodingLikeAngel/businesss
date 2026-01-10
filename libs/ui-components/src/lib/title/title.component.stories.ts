import type { Meta, StoryObj } from '@storybook/angular';
import { UITitleComponent } from './title.component';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<UITitleComponent> = {
  component: UITitleComponent,
  title: 'UITitleComponent',
};
export default meta;
type Story = StoryObj<UITitleComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/title works!/gi)).toBeTruthy();
  },
};
