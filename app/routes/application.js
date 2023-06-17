import Route from '@ember/routing/route';
import { setupWorker } from 'msw';

export default class ApplicationRoute extends Route {
  async beforeModel() {
    const worker = setupWorker();
    await worker.start();
    worker.printHandlers();
  }
}
