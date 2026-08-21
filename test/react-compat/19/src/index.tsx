import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { CioPia } from '@constructor-io/constructorio-ui-pia';
import { DEMO_API_KEY, DEMO_ITEM_ID, DEMO_ITEM_NAME } from '../../constants';

const App = () => (
  <CioPia apiKey={DEMO_API_KEY} itemId={DEMO_ITEM_ID} itemName={DEMO_ITEM_NAME} />
);

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<App />);
}

