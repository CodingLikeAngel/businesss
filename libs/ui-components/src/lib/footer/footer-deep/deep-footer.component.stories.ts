import type { Meta, StoryObj } from '@storybook/angular';
import { UIDeepFooterComponent } from './deep-footer.component';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<UIDeepFooterComponent> = {
  component: UIDeepFooterComponent,
  title: 'UIDeepFooterComponent',
};
export default meta;
type Story = StoryObj<UIDeepFooterComponent>;

export const Primary: Story = {
  args: {
    theme: 'theme-mario',
  },
};

export const Heading: Story = {
  args: {
    theme: 'theme-mario',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/deep-footer works!/gi)).toBeTruthy();
  },
};
