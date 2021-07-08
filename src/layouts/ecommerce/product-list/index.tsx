import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Tab, TabBar, BottomNavigation, BottomNavigationTab } from '@ui-kitten/components';
import { ProductListScreen } from './product-list.component';

const ProductsTabBar = ({ navigation, state }): React.ReactElement => {

  const onTabSelect = (index: number): void => {
    navigation.navigate(state.routeNames[index]);
  };

  const renderTab = (route: string): React.ReactElement => (
    <BottomNavigationTab
      key={route}
      title={route.toUpperCase()}
    />
  );

  return (
    <BottomNavigation
    style={{backgroundColor: 'transparent'}}
    appearance="noIndicator"
      selectedIndex={state.index}
      onSelect={onTabSelect}>
      {state.routeNames.map(renderTab)}
    </BottomNavigation>
  );
};

const TopTabs = createMaterialTopTabNavigator();

export default (props): React.ReactElement => (
  <TopTabs.Navigator tabBar={(props) => <ProductsTabBar {...props}/>}>
    <TopTabs.Screen name='All' component={ProductListScreen}/>
    <TopTabs.Screen name='Income' component={ProductListScreen}/>
    <TopTabs.Screen name='Expense' component={ProductListScreen}/>
    <TopTabs.Screen name='Saving' component={ProductListScreen}/>
  </TopTabs.Navigator>
);
