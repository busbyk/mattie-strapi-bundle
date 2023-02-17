import pluginId from './pluginId';
import Initializer from './components/Initializer';
import ListViewInjectedComponent from './components/ListViewInjectedComponent';

const name = 'Search';

export default {
  register(app) {
    app.registerPlugin({
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    });
  },
  bootstrap(app) {
    app.injectContentManagerComponent('listView', 'actions', {
      name: 'ListViewInjectedComponent',
      Component: ListViewInjectedComponent,
    });
  },
};
