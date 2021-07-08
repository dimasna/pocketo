import React from 'react';
import { ImageProps, TextProps, TouchableWithoutFeedback, View } from 'react-native';
import {
  Button,
  CheckBox,
  Input,
  Layout,
  StyleService, Text,
  useStyleSheet,
} from '@ui-kitten/components';
import { ProfileAvatar } from './extra/profile-avatar.component';
import { EmailIcon, EyeIcon, EyeOffIcon, PersonIcon, PlusIcon, AddressIcon } from './extra/icons';
import { KeyboardAvoidingView } from './extra/3rd-party';
import * as firebase from 'firebase';
import { calcSignature } from '../../../services/calcSignature';
import { createWallet } from '../../../services/rapydAPI';



export default ({ navigation }): React.ReactElement => {

  const [lastName, setLastName] = React.useState<string>();
  const [firstName, setFirstName] = React.useState<string>();
  const [email, setEmail] = React.useState<string>();
  const [address, setAddress] = React.useState<string>();
  const [password, setPassword] = React.useState<string>();
  const [confirmPassword, setConfirmPassword] = React.useState<string>();
  const [termsAccepted, setTermsAccepted] = React.useState<boolean>(false);
  const [passwordVisible, setPasswordVisible] = React.useState<boolean>(false);

  const styles = useStyleSheet(themedStyles);

  const onSignUpButtonPress = async (): Promise<void> => {
    if (password !== confirmPassword) {
      alert("Passwords don't match.")
      return
    }

    let body = JSON.stringify({
      "first_name": firstName,
      "last_name": lastName,
      "email": email,
      "ewallet_reference_id": `${firstName+lastName}-MainWallet`,
      "metadata": {
          "merchant_defined": true
      },
      "phone_number": "",
      "type": "person",
      "contact": {
          "phone_number": "",
          "email": email,
          "first_name": firstName,
          "last_name": lastName,
          "mothers_name": "",
          "contact_type": "personal",
          "address": {
              "name": `${firstName+lastName}`,
              "line_1": `${address}`,
              "line_2": "",
              "line_3": "",
              "city": "",
              "state": "",
              "country": "",
              "zip": "",
              "phone_number": "",
              "metadata": {},
              "canton": "",
              "district": ""
          },
          "identification_type": "",
          "identification_number": "",
          "date_of_birth": "",
          "country": "",
          "nationality": "",
          "metadata": {
              "merchant_defined": true
          }
      }
  });
    const [accessKey, timestamp, salt, signature] = await calcSignature('post','/v1/user', body)
    const walletData = await createWallet(salt,signature,timestamp,accessKey,body)
    //console.log('new wallet :'+(newWallet))

    let newWallet = JSON.parse(walletData)
    console.log('parse wallet' + newWallet)
    // console.log('status :' + newWallet.status.status)
    if(newWallet && newWallet.status.status == 'SUCCESS'){

    firebase
      .default
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        const uid = response.user.uid
        const data = {
          id: uid,
          email,
          firstName,
          lastName,
          isVerified: false,
          mainBalance: 0,
          walletId: newWallet.data.id,
          walletRef: newWallet.data.ewallet_reference_id,
          contactId: newWallet.data.contacts.data[0].id
        };

        const dbRef = firebase.default.database().ref();
        dbRef
          .child("users/"+uid)
          .set(data)
          // .then(() => {
          //  //navigation.navigate('Home')
          // })
          

       
      })
      .catch((error) => {
        alert(error)
      });

    }else{
      alert('Failed to Register')
    }
  };

  const onSignInButtonPress = (): void => {
    navigation && navigation.navigate('Signin');
  };

  const onPasswordIconPress = (): void => {
    setPasswordVisible(!passwordVisible);
  };

  const renderEditAvatarButton = (): React.ReactElement => (
    <Button
      style={styles.editAvatarButton}
      status='basic'
      accessoryLeft={PlusIcon}
    />
  );

  const renderTermsText = (props: TextProps): React.ReactElement => (
    <Text {...props} style={[props.style, styles.termsCheckBoxText]}>
      By creating an account, I agree to the Pocketo Terms of
      Use and Privacy Policy
    </Text>
  );

  const renderPasswordIcon = (props: ImageProps): React.ReactElement => (
    <TouchableWithoutFeedback onPress={onPasswordIconPress}>
      {passwordVisible ? EyeIcon(props) : EyeOffIcon(props)}
    </TouchableWithoutFeedback>
  );

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.headerContainer}>
        <ProfileAvatar
          style={styles.profileAvatar}
          resizeMode='center'
          source={require('./assets/image-person.png')}
          
        />
      </View>
      <Layout
        style={styles.formContainer}
        level='1'>
        <Input
        
          autoCapitalize='none'
          placeholder='First Name'
          accessoryRight={PersonIcon}
          value={firstName}
          onChangeText={setFirstName}
        />
        <Input
        style={styles.passwordInput}
          autoCapitalize='none'
          placeholder='Last Name'
          accessoryRight={PersonIcon}
          value={lastName}
          onChangeText={setLastName}
        />
        <Input
        style={styles.passwordInput}
          autoCapitalize='none'
          placeholder='Address'
          accessoryRight={AddressIcon}
          value={address}
          onChangeText={setAddress}
        />
        <Input
          style={styles.emailInput}
          autoCapitalize='none'
          placeholder='Email'
          accessoryRight={EmailIcon}
          value={email}
          onChangeText={setEmail}
        />
        <Input
          style={styles.passwordInput}
          autoCapitalize='none'
          secureTextEntry={!passwordVisible}
          placeholder='Password'
          accessoryRight={renderPasswordIcon}
          value={password}
          onChangeText={setPassword}
        />
        <Input
          style={styles.passwordInput}
          autoCapitalize='none'
          secureTextEntry={!passwordVisible}
          placeholder='Confirm Password'
          accessoryRight={renderPasswordIcon}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <CheckBox
          style={styles.termsCheckBox}
          checked={termsAccepted}
          onChange={(checked: boolean) => setTermsAccepted(checked)}>
          {renderTermsText}
        </CheckBox>
      </Layout>
      <Button
        style={styles.signUpButton}
        size='giant'
        onPress={onSignUpButtonPress}
        disabled={!termsAccepted}
        >
        SIGN UP
      </Button>
      <Button
        style={styles.signInButton}
        appearance='ghost'
        status='basic'
        onPress={onSignInButtonPress}>
        Already have an account? Sign In
      </Button>
    </KeyboardAvoidingView>
  );
};

const themedStyles = StyleService.create({
  container: {
    backgroundColor: 'background-basic-color-1',
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 150,
    backgroundColor: 'color-primary-default',
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 58,
    alignSelf: 'center',
    backgroundColor: 'background-basic-color-1',
    tintColor: 'color-primary-default',
  },
  editAvatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  formContainer: {
    flex: 1,
    paddingTop: 32,
    paddingHorizontal: 16,
  },
  emailInput: {
    marginTop: 16,
  },
  passwordInput: {
    marginTop: 16,
  },
  termsCheckBox: {
    marginTop: 24,
  },
  termsCheckBoxText: {
    
    fontSize: 11,
    lineHeight: 14,
    color: 'text-hint-color',
  },
  signUpButton: {
    marginHorizontal: 16,
  },
  signInButton: {
    marginVertical: 12,
    marginHorizontal: 16,
  },
});

