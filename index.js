import { AppRegistry } from 'react-native';
import { install } from 'react-native-quick-crypto';

import { name as appName } from './app.json';
import App from './src/App';

install();

if (__DEV__) {
  import('@/reactotron.config');
}

AppRegistry.registerComponent(appName, () => App);
