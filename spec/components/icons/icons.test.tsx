import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as icons from '../../../src/components/icons';

const iconNames = Object.keys(icons) as (keyof typeof icons)[];

describe('icons', () => {
  // Pinning the export list makes this suite fail loudly when an icon is added
  // without extending the assertions below.
  it('exports every icon the library renders', () => {
    expect([...iconNames].sort()).toEqual(['QuestionIcon', 'SendIcon', 'SparklesIcon']);
  });

  it.each(iconNames)('%s renders an svg with a viewBox', (name) => {
    const Icon = icons[name];
    const { container } = render(<Icon />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox');
  });

  // Every icon here sits next to its own visible label, so all of them are
  // decorative. Add an allowlist here if a meaningful icon is ever introduced.
  it.each(iconNames)('%s is hidden from assistive technology', (name) => {
    const Icon = icons[name];
    const { container } = render(<Icon />);

    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it.each(iconNames)('%s exposes no accessible name of its own', (name) => {
    const Icon = icons[name];
    const { container } = render(<Icon />);

    expect(container.querySelector('svg')).not.toHaveAttribute('aria-label');
    expect(container.querySelector('title')).not.toBeInTheDocument();
  });
});
