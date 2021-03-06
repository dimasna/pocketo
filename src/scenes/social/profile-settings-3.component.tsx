import React from 'react';
import { StyleSheet } from 'react-native';
import { TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { ArrowIosBackIcon } from '../../components/icons';
import ContentView from '../../layouts/social/profile-settings-3';

export const ProfileSettings3Screen = ({ navigation,route, uid }): React.ReactElement => {

  const renderBackAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={ArrowIosBackIcon}
      onPress={navigation.goBack}
    />
  );

  console.log('uid dari seblum addcard'+uid)
  return (
    <SafeAreaLayout
      style={styles.container}
      insets='top'>
      <TopNavigation
        title={`Add ${route.params.isBusiness ? 'Business' : ''} Pocket`}
        accessoryLeft={renderBackAction}
      />
      <ContentView navigation={navigation} route={route} uid={uid}/>
    </SafeAreaLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
