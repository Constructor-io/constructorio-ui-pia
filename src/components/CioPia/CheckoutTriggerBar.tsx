import React from 'react';
import { CioPiaRenderProps } from '../../types';
import { translate } from '../../utils/translate';
import type { CheckoutTrigger } from './types';

interface CheckoutTriggerBarProps {
  triggers: CheckoutTrigger[];
  state: CioPiaRenderProps;
  translations?: Parameters<typeof translate>[1];
}

export default function CheckoutTriggerBar({
  triggers,
  state,
  translations,
}: CheckoutTriggerBarProps) {
  const visible = triggers.filter((t) => (t.triggerWhen ? t.triggerWhen(state) : true));
  if (visible.length === 0) return null;

  return (
    <div className='cio-pia-checkout-triggers' data-testid='cio-pia-checkout-triggers'>
      {visible.map((trigger) => {
        const label = trigger.label ?? translate('Checkout', translations);
        const onClick = () => trigger.onTrigger(state);
        if (trigger.renderButton) {
          return (
            <React.Fragment key={trigger.id}>
              {trigger.renderButton({
                onClick,
                label,
                disabled: trigger.disabled,
                id: trigger.id,
              })}
            </React.Fragment>
          );
        }
        return (
          <button
            key={trigger.id}
            type='button'
            className='cio-pia-checkout-trigger'
            data-testid={`cio-pia-checkout-trigger-${trigger.id}`}
            disabled={trigger.disabled}
            onClick={onClick}>
            {label}
          </button>
        );
      })}
    </div>
  );
}
