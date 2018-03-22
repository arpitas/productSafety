// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html

import {
  DefaultPage,
  ScorePage,
} from './';

export default {
  path: 'crawl',
  name: 'Crawl',
  childRoutes: [
    { path: 'default-page', name: 'Default page', component: DefaultPage, isIndex: true },
    { path: 'score', name: 'Score page', component: ScorePage },
  ],
};
