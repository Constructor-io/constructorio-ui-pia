/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import ReactDOM from 'react-dom/client';
import CioPiaComponent from './components/CioPia/CioPia';
import './styles.css';

const CioPia = ({ selector, includeCSS = true, ...rest }) => {
  if (document) {
    const stylesheet = document.getElementById('cio-pia-styles');
    const containerElement = document.querySelector(selector);

    if (!containerElement) {
      // eslint-disable-next-line no-console
      console.error(`CioPia: There were no elements found for the provided selector`);

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
        <CioPiaComponent {...rest} />
      </React.StrictMode>,
    );
  }
};

if (window) {
  window.CioPia = CioPia;
}

export default CioPia;
