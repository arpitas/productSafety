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
  const l = p["0"].props.children["0"];
  console.log('returning score: ' + l);
  return l;
}

export function scrape(args = {}) {

  return (dispatch, getState) => {
    const stat = getState();

    dispatch({
      type: CRAWL_SCRAPE_BEGIN,
    });
    let prom = new Map();

    console.log('prom size init ' + prom.size);

    const promise = new Promise((resolve, reject) => {
      for (var i = 0; i < stat.crawl.ing.length; i++) {
        console.log('i is ' + i);

        const doRequest = axios.get('https://www.ewg.org/skindeep/search.php?query=' + stat.crawl.ing[i]);
        console.log('doRequest ' + stat.crawl.ing[i]);
        doRequest.then(
          (res) => {

            var score = getScore(res.data);
            var key1 = res.request.responseURL.split('https://www.ewg.org/skindeep/search.php?query=')[1];
            var key = stat.crawl.ing.indexOf(key1);
            console.log('setting prom ' + key + ',' + score);
            prom.set(key, score);
            console.log('prom size now ' + prom.size);

            stat.crawl.scoreList.push(score);
            console.log('scorelist size now ' + stat.crawl.scoreList.length);

            dispatch({
              type: CRAWL_SCRAPE_SUCCESS,
              data: prom,
              // data: stat.crawl.scoreList,
            });
            resolve(res);
          },
          (err) => {
            prom.set(i, "0");
            reject(err);
          },
        );
      }
    });

    return promise;
  };
}

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
    // action.data.map(x=>console.log('action.data ' + x.key + ', ' + x.value));
    console.log('action.data ' + action.data.length);
    return {
      ...state,
      scrapePending: false,
      scrapeError: null,
      scoreMap: action.data,
      // scoreList: action.data,
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
