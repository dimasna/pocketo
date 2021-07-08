import React from 'react';
import { ScrollView, Alert } from 'react-native';
import {Restart} from 'fiction-expo-restart';
import { Button, StyleService, useStyleSheet } from '@ui-kitten/components';
import { ProfileAvatar } from './extra/profile-avatar.component';
import { ProfileSetting } from './extra/profile-setting.component';
import { CameraIcon } from './extra/icons';
import { Profile } from './extra/data';
import * as firebase from 'firebase';

const profile: Profile = Profile.jenniferGreen();

export default ({ navigation }): React.ReactElement => {

  const styles = useStyleSheet(themedStyle);

  const onDoneButtonPress = async (): Promise<void> => {
    try {
      await firebase.default.auth().signOut();
      //Restart();
    } catch (err) {
      Alert.alert('There is something wrong!', err.message);
    }
  };

  const renderPhotoButton = (): React.ReactElement => (
    <Button
      style={styles.editAvatarButton}
      status='primary'
      accessoryLeft={CameraIcon}
    />
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}>
      <ProfileAvatar
        style={styles.profileAvatar}
        source={require('./assets/ava2.png')}
        
      />
      <ProfileSetting
        style={[styles.profileSetting, styles.section]}
        hint='Full Name'
        value={profile.firstName}
      />
      <ProfileSetting
        style={styles.profileSetting}
        hint='Email'
        value={profile.email}
      />
      
      <Button
        style={styles.doneButton}
        onPress={onDoneButtonPress}>
        Logout
      </Button>
    </ScrollView>
  );
};

const themedStyle = StyleService.create({
  container: {
    flex: 1,
    backgroundColor: 'background-basic-color-2',
  },
  contentContainer: {
    paddingVertical: 24,
  },
  profileAvatar: {
    aspectRatio: 1.0,
    height: 124,
    alignSelf: 'center',
  },
  editAvatarButton: {
    aspectRatio: 1.0,
    height: 48,
    borderRadius: 24,
  },
  profileSetting: {
    padding: 16,
  },
  section: {
    marginTop: 24,
  },
  doneButton: {
    marginHorizontal: 24,
    marginTop: 24,
  },
});
