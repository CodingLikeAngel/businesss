import type { Meta, StoryObj } from '@storybook/angular';
import { UIGalleryComponent } from './gallery.component';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<UIGalleryComponent> = {
  component: UIGalleryComponent,
  title: 'UIGalleryComponent',
};
export default meta;
type Story = StoryObj<UIGalleryComponent>;

export const Primary: Story = {
  args: {
    images: [
      {
        src: 'https://via.placeholder.com/800x400?text=Image+1',
        alt: 'Image 1',
        caption: 'First Image',
      },
      {
        src: 'https://via.placeholder.com/800x400?text=Image+2',
        alt: 'Image 2',
        caption: 'Second Image',
      },
      {
        src: 'https://via.placeholder.com/800x400?text=Image+3',
        alt: 'Image 3',
        caption: 'Third Image',
      },
    ],
    variant: 'default',
    autoSlide: false,
    slideInterval: 3000,
    customStyles: {},
  },
};

export const Heading: Story = {
  args: {
    images: [
      {
        src: 'https://via.placeholder.com/800x400?text=Image+1',
        alt: 'Image 1',
        caption: 'First Image',
      },
      {
        src: 'https://via.placeholder.com/800x400?text=Image+2',
        alt: 'Image 2',
        caption: 'Second Image',
      },
      {
        src: 'https://via.placeholder.com/800x400?text=Image+3',
        alt: 'Image 3',
        caption: 'Third Image',
      },
    ],
    variant: 'default',
    autoSlide: false,
    slideInterval: 3000,
    customStyles: {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/gallery works!/gi)).toBeTruthy();
  },
};
