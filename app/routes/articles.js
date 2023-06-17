import Route from '@ember/routing/route';

export default class ArticlesRoute extends Route {
  async model() {
    const response = await fetch('http://example.com/articles');
    return await response.json();
  }
}
