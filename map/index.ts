import { PropSidebarItem } from '@docusaurus/plugin-content-docs';
import cafe from '@site/map/cafe';
import children from '@site/map/children';
import {
  mapItemToPlacemarkItems,
  mapItemToSidebarItem,
} from '@site/src/pages/map/lib/helpers';
import { MapCategory, PlacemarkItem } from '@site/src/pages/map/lib/types';

const rootItem: MapCategory = {
  id: '',
  label: 'Карта Самарканда',
  type: 'category',
  items: [cafe, children],
};

export function getSidebarItems(currentUrl = 'none'): PropSidebarItem[] {
  return rootItem.items.map((child) =>
    mapItemToSidebarItem(child, '#', currentUrl),
  );
}

export function getPlacemarkItems(): PlacemarkItem[] {
  return mapItemToPlacemarkItems(rootItem);
}
