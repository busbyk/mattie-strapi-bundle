import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import useConfig from '../../hooks/useConfig';
import IndexCollectionButton from '../IndexCollectionButton';

function ListViewInjectedComponent() {
  const {
    params: { slug, kind },
  } = useRouteMatch('/content-manager/:kind/:slug?');

  const { config } = useConfig();
  const { contentTypes } = config;

  let shouldDisplayButton = false;

  if (contentTypes) {
    shouldDisplayButton = contentTypes.find(({ name }) => name === slug);
  }

  if (!config || !shouldDisplayButton) return null;

  return <IndexCollectionButton contentType={slug} />;
}

export default ListViewInjectedComponent;
