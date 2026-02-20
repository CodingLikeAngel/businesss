import type { Meta, StoryObj } from '@storybook/angular';
import { UIAccordionComponent } from './accordion.component';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<UIAccordionComponent> = {
  component: UIAccordionComponent,
  title: 'UI Components/Accordion',
};
export default meta;
type Story = StoryObj<UIAccordionComponent>;

export const Primary: Story = {
  args: {
    items: [
      { title: 'Section 1', content: 'Content for section 1.' },
      { title: 'Section 2', content: 'Content for section 2.' },
      { title: 'Section 3', content: 'Content for section 3.' },
    ],
  },
};

export const WithHeading: Story = {
  args: {
    items: [
      { title: 'First', content: 'First panel content.' },
      { title: 'Second', content: 'Second panel content.' },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/First/gi)).toBeTruthy();
  },
};
