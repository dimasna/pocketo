import React from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { HomeNavigator } from './home.navigator';
import { ThemeProvider } from '@ui-kitten/components';
import { Theming } from '../services/theme.service';
import LoadingNavigator from './loading.navigator';
import { SignIn2Screen } from '../scenes/auth/sign-in-2.component';
import { SignUp2Screen } from '../scenes/auth/sign-up-2.component';
import { ForgotPasswordScreen } from '../scenes/auth/forgot-password.component';
import * as firebase from 'firebase'
const Stack = createStackNavigator();
/*
 * Navigation theming: https://reactnavigation.org/docs/en/next/themes.html
 */
const navigatorTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    // prevent layout blinking when performing navigation
    background: 'transparent',
  },
};

const NonAuth = (): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name="Signin" component={SignIn2Screen} options={{headerShown: false}} />
  
    <Stack.Screen name="Signup" component={SignUp2Screen} options={{headerShown: false}} />
      
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{headerShown: false}} />
   </Stack.Navigator>
);
export const AppNavigator = (): React.ReactElement => {
  const brandTheme = Theming.useTheme('brand');
  const [user, setUser] = React.useState(false);
  const [uid, setUid] = React.useState("");
  const [loading, setLoading] = React.useState(true)

  React.useEffect(
    () => {
     firebase.default.auth().onAuthStateChanged((userData) => {
       console.log('data user :'+ JSON.stringify(userData))
       if (userData) {
        setUser(true);
        setUid(userData.uid)
        setLoading(false)
       } else {
         setUser(false)
         setLoading(false)
       }
      })}
 );

 if (loading) {
  return (
    <></>
  )
}
 return(
  <ThemeProvider theme={brandTheme}>
  <NavigationContainer>
    {user ? <HomeNavigator uid={uid} /> : <NonAuth/>}

    {/* <Stack.Navigator headerMode='none'>
      <Stack.Screen name="Loading" component={LoadingNavigator} options={{headerShown: false}} />
    
      <Stack.Screen name="Home" component={HomeNavigator} options={{headerShown: false}} />
    
      <Stack.Screen name="Signup" component={SignUp2Screen} options={{headerShown: false}} />
    
      <Stack.Screen name="Signin" component={SignIn2Screen} options={{headerShown: false}} />
    
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{headerShown: false}} />
    
      
    </Stack.Navigator> */}
  </NavigationContainer>
  </ThemeProvider>
)

  };

