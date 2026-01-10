import type { Meta, StoryObj } from '@storybook/angular';
import { UIHeaderComponent } from './header.component';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<UIHeaderComponent> = {
  component: UIHeaderComponent,
  title: 'UIHeaderComponent',
};
export default meta;
type Story = StoryObj<UIHeaderComponent>;

export const Primary: Story = {
  args: {
    title: 'Header Title',
    subtitle: '',
    variant: 'primary',
    align: 'center',
    dark: false,
    navItems: [],
    customStyles: {},
  },
};

export const Heading: Story = {
  args: {
    title: 'Header Title',
    subtitle: '',
    variant: 'primary',
    align: 'center',
    dark: false,
    navItems: [],
    customStyles: {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/header works!/gi)).toBeTruthy();
  },
};
