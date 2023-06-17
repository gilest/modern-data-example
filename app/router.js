import EmberRouter from '@ember/routing/router';
import config from 'modern-ember-data-example/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('articles');
});
