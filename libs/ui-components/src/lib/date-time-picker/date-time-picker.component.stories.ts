import type { Meta, StoryObj } from '@storybook/angular';
import { UIDateTimePickerComponent } from './date-time-picker.component';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<UIDateTimePickerComponent> = {
  component: UIDateTimePickerComponent,
  title: 'UIDateTimePickerComponent',
};
export default meta;
type Story = StoryObj<UIDateTimePickerComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/date-time-picker works!/gi)).toBeTruthy();
  },
};
