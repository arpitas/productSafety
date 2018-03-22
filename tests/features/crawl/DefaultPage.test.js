import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { DefaultPage } from 'src/features/crawl/DefaultPage';

describe('crawl/DefaultPage', () => {
  it('renders node with correct class name', () => {
    const props = {
      crawl: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <DefaultPage {...props} />
    );

    expect(
      renderedComponent.find('.crawl-default-page').getElement()
    ).to.exist;
  });
});
