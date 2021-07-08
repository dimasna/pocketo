import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { RouteProp } from '@react-navigation/core';

import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { ThemeProvider, Button } from '@ui-kitten/components';
import { LayoutsNavigator } from './layouts.navigator';
import { ComponentsNavigator } from './components.navigator';
import { ThemesNavigator } from './themes.navigator';
import { HomeBottomNavigation } from '../scenes/home/home-bottom-navigation.component';
import { Profile6Screen as HomeScreen} from '../scenes/social/profile-6.component';
import { Profile5Screen as RapydWebview} from '../scenes/social/profile-5.component';
import {ProfileSettings1Screen as AccountScreen}  from '../scenes/social/profile-settings-1.component';
import {ProfileSettings2Screen as PayScreen}  from '../scenes/social/profile-settings-2.component';
import {ProfileSettings3Screen as AddPocketScreen}  from '../scenes/social/profile-settings-3.component';
import { ProductDetails4Screen as DetailPocketScreen } from '../scenes/ecommerce/product-details-4.component';
import { Theming } from '../services/theme.service';
import { createStackNavigator } from '@react-navigation/stack';
import * as firebase from 'firebase'
import { getBalanceWallet } from '../services/rapydAPI';

const BottomTab = createBottomTabNavigator();
const Stack = createStackNavigator();

/*
 * When dev is true in .expo/settings.json (started via `start:dev`),
 * open Components tab as default.
 */
const initialTabRoute: string = __DEV__ ? 'Components' : 'Layouts';

/*
 * Can we access it from `HomeNavigator`?
 */
const ROOT_ROUTES: string[] = ['Home', 'Pay', 'Account', 'Themes'];

const isOneOfRootRoutes = (currentRoute: RouteProp<any, any>): boolean => {
  return ROOT_ROUTES.find(route => currentRoute.name === route) !== undefined;
};

const TabBarVisibleOnRootScreenOptions = ({ route }): BottomTabNavigationOptions => {
  const currentRoute = route.state && route.state.routes[route.state.index];
  return { tabBarVisible: currentRoute && isOneOfRootRoutes(currentRoute) };
};



const HomeStackNavigator = (props) => {

  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Home">
        {() => <HomeScreen  uid={props.uid} isVerifed={props.isVerified} idWallet={props.idWallet} pockets={props.pockets} pocketsBusiness={props.pocketsBusiness} refreshing={props.refreshing} availableBalance={props.availableBalance} setRefreshing={props.setRefreshing}/>}
      </Stack.Screen>
      <Stack.Screen name="DetailPocket">
        {(prop) => <DetailPocketScreen {...prop} idWallet={props.idWallet} />}
      </Stack.Screen>
      <Stack.Screen name="AddPocket">
        {(prop) => <AddPocketScreen {...prop} uid={props.uid} />}
      </Stack.Screen>
      <Stack.Screen name="RapydWebview" >
        {(prop) => <RapydWebview {...prop} idContact={props.idContact} idWallet={props.idWallet} />}
      </Stack.Screen>
      
      
    </Stack.Navigator>
  )
}


export const HomeNavigator = (props): React.ReactElement => {
  const brandTheme = Theming.useTheme('brand');
  const [pockets, setPockets] = React.useState([]);
  const [idWallet, setIdWallet] = React.useState('');
  const [idContact, setIdContact] = React.useState('');
  const [pocketsBusiness, setPocketsBusiness] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [isVerifed, setIsVerified] = React.useState(false);
  const [availableBalance, setAvalaibleBalance] = React.useState(0);

  React.useEffect(
    () => {
      console.log('data user from child :' + props.uid)
      const usersRef = firebase.default.database().ref();

 
      usersRef
        .child('/users/' + props.uid)
        .get()
        .then(async snapshot => {
          if (snapshot.exists()) {
            const userObj = snapshot.val();
            console.log('main balance :' + userObj.walletId)
            let pocketObj = userObj.personalPocket;
            let pocketBusinessObj = userObj.businessPocket;
            let resultPocket = pocketObj != undefined ? Object.keys(pocketObj).map((key) => pocketObj[key]):[];
            let resultPocketBusiness = pocketBusinessObj != undefined ? Object.keys(pocketBusinessObj).map((key) => pocketBusinessObj[key]):[];
            console.log('pocket'+resultPocket)
            setIdWallet(userObj.walletId)
            setIdContact(userObj.contactId)
            setPockets(resultPocket);
            setIsVerified(userObj.isVerified)
            setPocketsBusiness(resultPocketBusiness);

            const balance = await getBalanceWallet(userObj.walletId);
            const balanceParse = JSON.parse(balance);
            if (balanceParse.status.status == 'SUCCESS') {
              setAvalaibleBalance(balanceParse.data.length != 0 ? balanceParse.data[0].balance : 0)
            }
          } else {
            console.log('not exist')
          }
        })
        .catch(error => {
          console.log(error)
        });



    }, [refreshing]
  );
  return(
  <ThemeProvider theme={brandTheme}>
  <BottomTab.Navigator
    screenOptions={TabBarVisibleOnRootScreenOptions}
    initialRouteName={initialTabRoute}
    tabBar={props => <HomeBottomNavigation {...props} />}>
   <BottomTab.Screen  name='Home' children={(prop)=><HomeStackNavigator {...prop} uid={props.uid} isVerified={isVerifed} idContact={idContact} idWallet={idWallet} pockets={pockets} pocketsBusiness={pocketsBusiness} refreshing={refreshing} availableBalance={availableBalance} setRefreshing={setRefreshing} /> } />
    <BottomTab.Screen name='Pay' children={(prop) => <PayScreen {...prop} pockets={pockets} idWallet={idWallet} setRefreshing={setRefreshing}/>}/>
    <BottomTab.Screen name='Account' component={AccountScreen}/>
  </BottomTab.Navigator>
  </ThemeProvider>
)};






// export const HomeNavigator = (): React.ReactElement => (
//   <Drawer.Navigator drawerContent={props => <HomeDrawer {...props}/>}>
//     <Drawer.Screen name='Home' component={HomeTabsNavigator}/>
//     <Drawer.Screen name='Libraries' component={LibrariesScreen}/>
//   </Drawer.Navigator>
// );
