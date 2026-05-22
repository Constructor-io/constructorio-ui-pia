import React from 'react';
import { CarouselOverrides } from '@constructor-io/constructorio-ui-components';
import { Callbacks, Item } from '../../types';
interface PiaCustomCarouselProps {
    items: Array<Item>;
    componentOverrides?: CarouselOverrides<Item>;
    callbacks?: Callbacks;
}
export default function PiaCustomCarousel({ items, componentOverrides, callbacks, }: PiaCustomCarouselProps): React.JSX.Element | null;
export {};
