import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ArticlesRoute extends Route {
  @service store;

  async model() {
    const response = await this.store.request({
      url: 'http://example.com/articles',
    });
    return response.content;
  }
}
