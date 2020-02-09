/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import routes from './lib/AppRoutes'
//react-native run-ios -- simulator='iPhone 11'
AppRegistry.registerComponent(appName, () =>routes);
