/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import ReactDOM from 'react-dom/client';
import CioAsaPdpComponent from './components/CioAsaPdp/CioAsaPdp';
import './styles.css';

const CioAsaPdp = ({ selector, includeCSS = true, ...rest }) => {
  if (document) {
    const stylesheet = document.getElementById('cio-asa-pdp-styles');
    const containerElement = document.querySelector(selector);

    if (!containerElement) {
      // eslint-disable-next-line no-console
      console.error(`CioAsaPdp: There were no elements found for the provided selector`);

      return;
    }

    if (stylesheet) {
      if (!includeCSS) {
        stylesheet.disabled = true;
      } else {
        stylesheet.disabled = false;
      }
    }

    ReactDOM.createRoot(containerElement).render(
      <React.StrictMode>
        <CioAsaPdpComponent {...rest} />
      </React.StrictMode>,
    );
  }
};

if (window) {
  window.CioAsaPdp = CioAsaPdp;
}

export default CioAsaPdp;
