import type { Meta, StoryObj } from '@storybook/angular';
import { UITabsComponent } from './tabs.component';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<UITabsComponent> = {
  component: UITabsComponent,
  title: 'UITabsComponent',
};
export default meta;
type Story = StoryObj<UITabsComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/tabs works!/gi)).toBeTruthy();
  },
};
