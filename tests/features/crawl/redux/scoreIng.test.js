import { expect } from 'chai';

import {
  CRAWL_SCORE_ING,
} from 'src/features/crawl/redux/constants';

import {
  scoreIng,
  reducer,
} from 'src/features/crawl/redux/scoreIng';

describe('crawl/redux/scoreIng', () => {
  it('returns correct action by scoreIng', () => {
    expect(scoreIng()).to.have.property('type', CRAWL_SCORE_ING);
  });

  it('handles action type CRAWL_SCORE_ING correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: CRAWL_SCORE_ING }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
