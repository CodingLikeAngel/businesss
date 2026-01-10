import type { Meta, StoryObj } from '@storybook/angular';
import { UICardRutasComponent } from './card-rutas.component';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<UICardRutasComponent> = {
  component: UICardRutasComponent,
  title: 'UICardRutasComponent',
};
export default meta;
type Story = StoryObj<UICardRutasComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/card-rutas works!/gi)).toBeTruthy();
  },
};
