import type { Meta, StoryObj } from '@storybook/angular';
import { UIInputComponent } from './input.component';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<UIInputComponent> = {
  component: UIInputComponent,
  title: 'UIInputComponent',
};
export default meta;
type Story = StoryObj<UIInputComponent>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    placeholder: '',
    disabled: false,
    type: 'text',
    customStyles: {},
    options: [],
    rows: 0,
  },
};

export const Heading: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    placeholder: '',
    disabled: false,
    type: 'text',
    customStyles: {},
    options: [],
    rows: 0,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/input works!/gi)).toBeTruthy();
  },
};
