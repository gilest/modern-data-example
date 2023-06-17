import Route from '@ember/routing/route';
import { registerDestructor } from '@ember/destroyable';

async function setupMSW(context) {
  const { worker } = await import('/mocks/browser.js');

  await worker.start();
  // Prevent duplication in tests,
  // where the app is setup and torn down a lot
  registerDestructor(context, () => worker.stop());
}

export default class ApplicationRoute extends Route {
  async beforeModel() {
    await setupMSW(this);
  }
}
