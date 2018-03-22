// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import {
  CRAWL_SCORE_ING,
} from './constants';

export function scoreIng() {
  return {
    type: CRAWL_SCORE_ING,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case CRAWL_SCORE_ING:
      return {
        ...state,
        ing: 'arps ',
      };

    default:
      return state;
  }
}
