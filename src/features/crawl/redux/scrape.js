import initialState from './initialState';
import ScorePage from './..';
import axios from 'axios';
import {
  CRAWL_SCRAPE_BEGIN,
  CRAWL_SCRAPE_SUCCESS,
  CRAWL_SCRAPE_FAILURE,
  CRAWL_SCRAPE_DISMISS_ERROR,
} from './constants';
const cheerio = require('cheerio');
import ReactHtmlParser from 'react-html-parser';

export function getScore(data) {
  const $ = cheerio.load(data);
  const a = $('a[class=preview]')
  .parent()
  .html();
  const options = {
    decodeEntities: true,
    transform: function transform(node, index) {
      if (node.type === 'tag' && node.name === 'img') {
        const val = node.attribs.src.split('score_image')[1].split('_')[0];
        console.log('score is : ' + val);
        return val;
      }
    },
  };
  const p = ReactHtmlParser(a, options);
  const l = p["0"].props.children;
  console.log('returning score: ' + l);
  return l;
}

// Rekit uses redux-thunk for async actions by default: https://github.com/gaearon/redux-thunk
// If you prefer redux-saga, you can use rekit-plugin-redux-saga: https://github.com/supnate/rekit-plugin-redux-saga
export function scrape(args = {}) {
  // console.log('state ing : ' + ScorePage.props.crawl.ing);
  // console.log('state initialState.ing  : ' + initialState.ing);

  return (dispatch, getState) => { // optionally you can have getState as the second argument
    const stat = getState();
    // console.log('state ing2  : ' + stat.crawl.ing);

    dispatch({
      type: CRAWL_SCRAPE_BEGIN,
    });
    let prom: [];
    for (var i = 0; i < stat.crawl.ing.length; i++) {


      // Return a promise so that you could control UI flow without states in the store.
      // For example: after submit a form, you need to redirect the page to another when succeeds or show some errors message if fails.
      // It's hard to use state to manage it, but returning a promise allows you to easily achieve it.
      // e.g.: handleSubmit() { this.props.actions.submitForm(data).then(()=> {}).catch(() => {}); }
      const promise = new Promise((resolve, reject) => {
        // doRequest is a placeholder Promise. You should replace it with your own logic.
        // See the real-word example at:  https://github.com/supnate/rekit/blob/master/src/features/home/redux/fetchRedditReactjsList.js
        // args.error here is only for test coverage purpose.
        // console.log('state ing3  : ' + stat.crawl.ing);

        const doRequest = axios.get('https://www.ewg.org/skindeep/search.php?query=' + stat.crawl.ing[i]);

        doRequest.then(
          (res) => {
            dispatch({
              type: CRAWL_SCRAPE_SUCCESS,
              data: getScore(res.data),
            });
            resolve(res);
          },
          // Use rejectHandler as the second argument so that render errors won't be caught.
          (err) => {
            dispatch({
              type: CRAWL_SCRAPE_FAILURE,
              data: { error: err },
            });
            reject(err);
          },
        );
      });
      prom[i] = promise;
    }
    return prom;
  };
}

// Async action saves request error by default, this method is used to dismiss the error info.
// If you don't want errors to be saved in Redux store, just ignore this method.
export function dismissScrapeError() {
  return {
    type: CRAWL_SCRAPE_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case CRAWL_SCRAPE_BEGIN:
    // Just after a request is sent
    return {
      ...state,
      scrapePending: true,
      scrapeError: null,
    };

    case CRAWL_SCRAPE_SUCCESS:
    // The request is success
    return {
      ...state,
      scrapePending: false,
      scrapeError: null,
      scoreList: action.map(x=> x.data),
    };

    case CRAWL_SCRAPE_FAILURE:
    // The request is failed
    return {
      ...state,
      scrapePending: false,
      scrapeError: action.data.error,
    };

    case CRAWL_SCRAPE_DISMISS_ERROR:
    // Dismiss the request failure error
    return {
      ...state,
      scrapeError: null,
    };

    default:
    return state;
  }
}
