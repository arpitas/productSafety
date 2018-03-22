import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Scrape } from 'src/features/crawl/Scrape';

describe('crawl/Scrape', () => {
  it('renders node with correct class name', () => {
    const props = {
      crawl: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <Scrape {...props} />
    );

    expect(
      renderedComponent.find('.crawl-scrape').getElement()
    ).to.exist;
  });
});
