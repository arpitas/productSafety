import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';

import {
  CRAWL_SCRAPE_BEGIN,
  CRAWL_SCRAPE_SUCCESS,
  CRAWL_SCRAPE_FAILURE,
  CRAWL_SCRAPE_DISMISS_ERROR,
} from 'src/features/crawl/redux/constants';

import {
  scrape,
  dismissScrapeError,
  reducer,
} from 'src/features/crawl/redux/scrape';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('crawl/redux/scrape', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when scrape succeeds', () => {
    const store = mockStore({});

    return store.dispatch(scrape())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', CRAWL_SCRAPE_BEGIN);
        expect(actions[1]).to.have.property('type', CRAWL_SCRAPE_SUCCESS);
      });
  });

  it('dispatches failure action when scrape fails', () => {
    const store = mockStore({});

    return store.dispatch(scrape({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', CRAWL_SCRAPE_BEGIN);
        expect(actions[1]).to.have.property('type', CRAWL_SCRAPE_FAILURE);
        expect(actions[1]).to.have.nested.property('data.error').that.exist;
      });
  });

  it('returns correct action by dismissScrapeError', () => {
    const expectedAction = {
      type: CRAWL_SCRAPE_DISMISS_ERROR,
    };
    expect(dismissScrapeError()).to.deep.equal(expectedAction);
  });

  it('handles action type CRAWL_SCRAPE_BEGIN correctly', () => {
    const prevState = { scrapePending: false };
    const state = reducer(
      prevState,
      { type: CRAWL_SCRAPE_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.scrapePending).to.be.true;
  });

  it('handles action type CRAWL_SCRAPE_SUCCESS correctly', () => {
    const prevState = { scrapePending: true };
    const state = reducer(
      prevState,
      { type: CRAWL_SCRAPE_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.scrapePending).to.be.false;
  });

  it('handles action type CRAWL_SCRAPE_FAILURE correctly', () => {
    const prevState = { scrapePending: true };
    const state = reducer(
      prevState,
      { type: CRAWL_SCRAPE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.scrapePending).to.be.false;
    expect(state.scrapeError).to.exist;
  });

  it('handles action type CRAWL_SCRAPE_DISMISS_ERROR correctly', () => {
    const prevState = { scrapeError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: CRAWL_SCRAPE_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.scrapeError).to.be.null;
  });
});
