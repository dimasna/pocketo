import React from 'react';
import { StyleSheet } from 'react-native';
import { TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { ArrowIosBackIcon, CloseIcon } from '../../components/icons';
import ContentView from '../../layouts/social/profile-settings-2';

export const ProfileSettings2Screen = ({ navigation, pockets, setRefreshing, idWallet }): React.ReactElement => {

  const renderBackAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={CloseIcon}
      onPress={navigation.goBack}
    />
  );

  return (
    <SafeAreaLayout
      style={styles.container}
      insets='top'>
      <TopNavigation
        title='Scan QR Payment'
        accessoryLeft={renderBackAction}
      />
      <ContentView navigation={navigation} idWallet={idWallet} pockets={pockets} setRefreshing={setRefreshing}/>
    </SafeAreaLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
