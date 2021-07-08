import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity,TouchableHighlight, Modal, TouchableWithoutFeedback, Image } from 'react-native';
import { Text,Button, Input, Icon, Select, IndexPath, SelectItem, TopNavigation, TopNavigationAction, Spinner } from '@ui-kitten/components';
import { SafeAreaLayout } from '../../../components/safe-area-layout.component';
import { WebView } from 'react-native-webview';
import { KeyboardAvoidingView } from './extra/3rd-party';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as firebase from 'firebase';
import { transferToWallet } from '../../../services/rapydAPI';

const AlertIcon = (props) => (
  <Icon {...props} name='alert-circle-outline' />
);

export default ({ navigation, pockets,idWallet, setRefreshing }): React.ReactElement => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(true);
  const [amount, setAmount] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);
  const [modalVisible, setModalVisible] = useState(true);
  const [uri, setUri] = useState('https://google.com');
  const [selectedIndexPocketFrom, setSelectedIndexPocketFrom] = React.useState(new IndexPath(0));

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');

      
    })();
  }, []);
  useEffect(() => {
    if(uri != 'https://google.com'){
      console.log('uri'+uri)
      let userRef = firebase.default.database().ref('users');
      userRef.orderByChild('walletId').equalTo(uri).once('value').then(snapshot => {
        if (snapshot.hasChildren()) {
          let data = snapshot.val()
          // snapshot.forEach(function(child) {
          //   let data = child.ref.get();
            console.log('data :'+JSON.stringify(data))
          // });
          
        } 
      })
    }
  }, [modalVisible]);

  const onDoneButtonPress = async (): Promise<void> => {
    setLoading(true);

    let [walletDest, pocketDest] = uri.split("-");
    console.log('wallet dest :'+walletDest)
    console.log('pocket dest :'+pocketDest)
    console.log('source wallet :'+idWallet)

    
    
    const transfer = await transferToWallet(amount,"USD","ewallet_8c12d6a3dc4f4b75baed3b6d9cd8fc49",walletDest,pocketDest);
    console.log('transfer :'+JSON.stringify(transfer));
    let result = JSON.parse(transfer);
    if(result.status.status == "SUCCESS"){
      setLoading(false);
      alert('Success');
      setAmount("")
      setPassword("")
      setModalVisible(false)
      setScanned(false)
      navigation.navigate('Home')
    }else{
      setLoading(false)
      setModalVisible(false)
      setScanned(false)
      setAmount("")
      setPassword("")
    }

    
  };

  const BackIcon = (props) => (
    <Icon {...props} name='arrow-back' />
  );

  const BackAction = () => (
    <TopNavigationAction onPress={() => {setModalVisible(!modalVisible);
      setScanned(false)}} icon={BackIcon} />
  );

  const TopNavigationPay = () => (
    <SafeAreaLayout insets="top">
      <TopNavigation
        alignment="start"
        accessoryLeft={BackAction}
        title='Pay'

      />
    </SafeAreaLayout>
  );

  const LoadingIndicator = (props) => (
    <View style={[props.style, {
      justifyContent: 'center',
      alignItems: 'center',
    }]}>
      <Spinner style={{borderColor: 'white'}} size='small'/>
    </View>
  );

  const SeletPocketFrom = () => {
    let idxPocket = selectedIndexPocketFrom.toString();
    return (
      <Select size="medium" style={{ flex: 1, marginVertical: 15 }}
        value={pockets[Number(idxPocket) - 1].name}
        caption="*only use expense pocket"
        selectedIndex={selectedIndexPocketFrom}
        onSelect={indexTag => setSelectedIndexPocketFrom(indexTag)}>
        {pockets.map((item,idx) => {
          return (item.type == 'Expense' ? <SelectItem key={idx}
            title={item.name} /> : <></>)


        })}


      </Select>
    )
  }

  function renderPaymentMethods() {
    return (
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 220,
          padding: 10 * 3,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          backgroundColor: "#fff"
        }}
      >
        <Text category="h5">Pay with pocket</Text>
        <SeletPocketFrom />

      </View>
    )
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setModalVisible(true);
    console.warn("Scan returned " + data);
    setUri(data)
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const renderIcon = (props) => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} />
    </TouchableWithoutFeedback>
  );

  const renderCaption = () => {
    return (
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        {AlertIcon({
          width: 10,
          height: 10,
          marginRight: 5
        })}

      </View>
    )
  }

  return (

    <View
      style={{
        flex: 1,
        flexDirection: 'column'
      }}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setScanned(false);
        }}>
        <KeyboardAvoidingView>
          <View style={{ flex: 1 }}>
            {/* <WebView
            style={{ flex: 1 }}
            source={{ uri: uri['uri'] }}
          /> */}

            <TopNavigationPay />
            <View style={{ marginHorizontal: 16 }}>
              <Image
                style={{
                  alignSelf: 'center',
                  width: 256,
                  height: 200,
                  borderRadius: 8,
                }}
                source={require('./assets/nopocketimage.png')}
              />
              <Text
                style={{
                  alignSelf: 'center',
                  textAlign: 'center',
                  marginHorizontal: 64,
                  marginTop: 24,
                }}
                category='h6'>
                Merchant Payment
              </Text>

              <Input
              style={{marginVertical: 10}}
                label="Amount"
                placeholder='Enter Amount'
                value={amount}
                onChangeText={nextValue => setAmount(nextValue)}
              />
              <Input
              style={{marginVertical: 10}}
                value={password}
                label='Password to Confirm'
                placeholder='Enter your password'
                caption={renderCaption}
                accessoryRight={renderIcon}
                secureTextEntry={secureTextEntry}
                onChangeText={nextValue => setPassword(nextValue)}
              />

{loading ?
            <Button
            accessoryLeft={LoadingIndicator}
            disabled />
            
           :
           <Button
          onPress={onDoneButtonPress}>
          PAY NOW
        </Button>

          }
              </View>
              {/* <TouchableHighlight
            style={{
              backgroundColor: 'black',
              padding: 15,
              alignItems: 'center'
            }}
            onPress={() => {
              setModalVisible(!modalVisible);
              setScanned(false);
            }}
            underlayColor='slategray'
          >
            <Text style={{ color: 'white', fontSize: 15 }}>Re Scan</Text>
          </TouchableHighlight> */}
             
          </View> 
        </KeyboardAvoidingView>
      </Modal>

      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={{ marginBottom: 320 }}>
          <View style={{ alignItems: 'center', marginBottom: 5 }}>
            <Image
              style={{
                width: 100,
                height: 100,
                resizeMode: 'contain',
                marginBottom: 20,
              }}
              source={{ uri: 'http://domain.biz/img/logo_dark.png' }}
            />
            {/* <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', paddingBottom: 10}}>
          Scan for Payment
        </Text> */}
          </View>

          <View
            style={{
              borderColor: 'white',
              borderTopWidth: 5,
              borderBottomWidth: 5,
              borderLeftWidth: 1,
              borderRightWidth: 1,
              paddingVertical: 100,
              paddingHorizontal: 120,
            }}
          />


          {/* <View style={{ alignItems: 'center', marginTop: 5 }}>
        <Text style={{ color: 'white', fontSize: 15}}>
          QR Scan...
        </Text>
      </View> */}
        </View>

        {renderPaymentMethods()}
      </BarCodeScanner>
    </View>

  );
}