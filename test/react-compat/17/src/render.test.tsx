import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CioPia } from '@constructor-io/constructorio-ui-pia';
import { DEMO_API_KEY, DEMO_ITEM_ID, DEMO_ITEM_NAME } from '../../constants';

describe('react-compat-17: CioPia', () => {
  it('renders the CioPia container', () => {
    const { container } = render(
      <CioPia apiKey={DEMO_API_KEY} itemId={DEMO_ITEM_ID} itemName={DEMO_ITEM_NAME} />,
    );
    const el = container.querySelector('.cio-pia-container');
    expect(el).not.toBeNull();
  });
});
