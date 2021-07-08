import React from 'react';
import { AppearanceProvider } from 'react-native-appearance';
import * as eva from '@eva-design/eva';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApplicationProvider, IconRegistry, ThemeProvider } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { MaterialIconsPack } from './materialC-icons.js';
import { AppLoading, LoadFontsTask, Task } from './app-loading.component';
import { appMappings, appThemes } from './app-theming';
import { AppIconsPack } from './app-icons-pack';
import { StatusBar } from '../components/status-bar.component';
import { SplashImage } from '../components/splash-image.component';
import { AppNavigator } from '../navigation/app.navigator';
import { AppStorage } from '../services/app-storage.service';
import { Mapping, Theme, Theming } from '../services/theme.service';
import {LogBox} from "react-native";
import ApiKeys from './constants/ApiKeys';
import * as firebase from 'firebase';


const loadingTasks: Task[] = [
  // Should be used it when running Expo.
  // In Bare RN Project this is configured by react-native.config.js
  () => LoadFontsTask({
    'OpenSans-Regular': require('../assets/fonts/OpenSans-Regular.ttf'),
    'OpenSans-SemiBold': require('../assets/fonts/OpenSans-SemiBold.ttf'),
    'OpenSans-Bold': require('../assets/fonts/OpenSans-Bold.ttf'),
    'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Medium': require('../assets/fonts/Roboto-Medium.ttf'),
    'Roboto-Bold': require('../assets/fonts/Roboto-Bold.ttf'),
  }),
  () => AppStorage.getMapping(defaultConfig.mapping).then(result => ['mapping', result]),
  () => AppStorage.getTheme(defaultConfig.theme).then(result => ['theme', result]),
];

const defaultConfig: { mapping: Mapping, theme: Theme } = {
  mapping: 'eva',
  theme: 'brand',
};

const App = ({ mapping, theme }): React.ReactElement => {

  const [mappingContext, currentMapping] = Theming.useMapping(appMappings, mapping);
  const [themeContext, currentTheme] = Theming.useTheming(appThemes, mapping, theme);
  LogBox.ignoreLogs(['Accessing the','YellowBox']);
  LogBox.ignoreAllLogs();
  console.disableYellowBox = true;
  

  const firebaseConfig = {
    apiKey: "AIzaSyA2iIqa8uHe6uMjF4CdK0Vp8G__KmulJGU",
    authDomain: "walleto-e0f6a.firebaseapp.com",
    databaseURL: "https://walleto-e0f6a-default-rtdb.firebaseio.com",
    projectId: "walleto-e0f6a",
    storageBucket: "walleto-e0f6a.appspot.com",
    messagingSenderId: "955330867265",
    appId: "1:955330867265:web:f9d0c9f152de82e9b6d6c0",
    measurementId: "G-KL6RV91EQE"
  };

  if (!firebase.default.apps.length) {
    firebase.default.initializeApp(firebaseConfig);
    
  }else{
    firebase.default.app()
      
  }
  
 

  return (
    <React.Fragment>
      <IconRegistry icons={[EvaIconsPack, AppIconsPack, MaterialIconsPack]}/>
      <AppearanceProvider>
        <ApplicationProvider {...eva} {...currentMapping} theme={currentTheme}>
          <Theming.MappingContext.Provider value={mappingContext}>
            <Theming.ThemeContext.Provider value={themeContext}>
              
              <SafeAreaProvider>
                <StatusBar/>
                <AppNavigator/>
              </SafeAreaProvider>
             
            </Theming.ThemeContext.Provider>
          </Theming.MappingContext.Provider>
        </ApplicationProvider>
      </AppearanceProvider>
    </React.Fragment>
  );
};

const Splash = ({ loading }): React.ReactElement => (
  <SplashImage
    loading={loading}
    source={require('../assets/images/image-splash.png')}
  />
);

export default (): React.ReactElement => (
  <AppLoading
    tasks={loadingTasks}
    initialConfig={defaultConfig}
    placeholder={Splash}>
    {props => <App {...props}/>}
  </AppLoading>
);
