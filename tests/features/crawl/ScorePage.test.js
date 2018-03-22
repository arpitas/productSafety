import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { ScorePage } from 'src/features/crawl/ScorePage';

describe('crawl/ScorePage', () => {
  it('renders node with correct class name', () => {
    const props = {
      crawl: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <ScorePage {...props} />
    );

    expect(
      renderedComponent.find('.crawl-score-page').getElement()
    ).to.exist;
  });
});
