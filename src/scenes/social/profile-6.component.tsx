import React from 'react';
import { StyleSheet } from 'react-native';
import { Divider, TopNavigation, TopNavigationAction,ThemeProvider } from '@ui-kitten/components';
import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { ArrowIosBackIcon } from '../../components/icons';
import ContentView from '../../layouts/social/profile-6';




export const Profile6Screen = (props): React.ReactElement => {
  
  const renderBackAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={ArrowIosBackIcon}
      onPress={props.navigation.goBack}
    />
  );

  return (

    <SafeAreaLayout
      style={styles.container}
      insets='top'>
      {/* <TopNavigation
        title='Profile'
        accessoryLeft={renderBackAction}
      /> */}
      <Divider/>
      <ContentView {...props} isVerified={props.isVerified} idWallet={props.idWallet} refreshing={props.refreshing} setRefreshing={props.setRefreshing} setPockets={props.setPockets} pocketsBusiness={props.pocketsBusiness} setPocketsBusiness={props.setPocketsBusiness} pockets={props.pockets} availableBalance={props.availableBalance} />
    </SafeAreaLayout>

  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
