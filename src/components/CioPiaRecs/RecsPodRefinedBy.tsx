import React from 'react';
import { Translations } from '../../types';
import { formatRefinedBy } from '../../utils/recs';

interface RecsPodRefinedByProps {
  /**
   * The text the products on screen were narrowed by, already settled against `showRefinedBy` by the
   * caller. Empty until the shopper has refined something, and this renders nothing until it is not.
   */
  value: string;
  translations?: Translations;
}

/**
 * The line under the title naming what the products on screen were narrowed by.
 *
 * It describes the products it sits above rather than whatever was asked for most recently, which is
 * what keeps it honest in the two states where those differ: it holds through a refinement's
 * loading state, next to the products it still belongs to, and a rejected input leaves it alone.
 */
export default function RecsPodRefinedBy({ value, translations }: RecsPodRefinedByProps) {
  if (!value) return null;

  return (
    <span className='cio-pia-recs-pod__refined-by'>{formatRefinedBy(value, translations)}</span>
  );
}
