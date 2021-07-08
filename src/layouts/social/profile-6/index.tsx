import React from 'react';
import { ScrollView, View, RefreshControl } from 'react-native';
import { useNavigation,useRoute } from '@react-navigation/native';
import {
  Avatar,
  Button,
  Modal,
  Icon,
  Toggle,
  Card,
  Input,
  Layout,
  Spinner,
  Select,
  SelectItem,
  StyleService,
  Text,
  useStyleSheet,
  Radio,
  RadioGroup,
  // Tab,
  // TabView,
  IndexPath
} from '@ui-kitten/components';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MessageCircleIcon, PersonAddIcon, PinIcon } from './extra/icons';
import WalletTab from '../../ecommerce/product-list';
import { getBalanceWallet } from '../../../services/rapydAPI';
import * as firebase from 'firebase';
import { ProductListScreen } from '../../../layouts/ecommerce/product-list/product-list.component';
const Tab = createMaterialTopTabNavigator();


const PlusIcon = (props) => (
  <Icon {...props} name='plus' />
);

const VerifIcon = (props) => (
  <Icon {...props} name='checkmark-circle' />
);


const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const Footer = (props) => (
  <View {...props} style={[props.style, {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  }]}>
    <Button
      style={{
        marginHorizontal: 2,
      }}
      size='small'
      status='basic'
      onPress={() => props.setVisible(false)}
    >
      Later
    </Button>
    <Button
      style={{
        marginHorizontal: 2,
      }}
      size='small'
      onPress={() => {
        props.setVisible(false)
        props.navigation.navigate('RapydWebview', { page: 'verify' })
      }}
    >
      Verify Now
    </Button>
  </View>
);

const LoadPlaceholder = () => {
  return (
    <View style={{marginTop: 20,alignItems: 'center', alignContent: 'center', alignSelf: 'center', justifyContent: 'center'}}>
      <Spinner />
      <Text>Loading...</Text>
    </View>
  )
}
const FooterTopUp = (prop) => (
  <View {...prop} style={[prop.style, {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  }]}>
    <Button
      style={{
        marginHorizontal: 2,
      }}
      size='small'
      status='basic'
      onPress={() => prop.setVisible(false)}
    >
      Later
    </Button>
    <Button
      style={{
        marginHorizontal: 2,
      }}
      size='small'
      onPress={() => {
        prop.setVisible(false)
        prop.navigation.navigate('RapydWebview', { page: 'topup', idWallet: prop.idWallet, amount: prop.amount })
      }}
    >
      Send
    </Button>
  </View>
);
const FooterTransfer = (prop) => (
  <View {...prop} style={[prop.style, {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  }]}>
    <Button
      style={{
        marginHorizontal: 2,
      }}
      size='small'
      status='basic'
      onPress={() => prop.setVisible(false)}
    >
      Later
    </Button>
    <Button
      style={{
        marginHorizontal: 2,
      }}
      size='small'
      onPress={() => {
        prop.setVisible(false)
        prop.navigation.navigate('RapydWebview', { page: 'verify' })
      }}
    >
      Send
    </Button>
  </View>
);

const dataBudget = [
  'Salary',
  'Daily Need',
];
export default (props,{isVerified}): React.ReactElement => {

  const navigation = useNavigation();
  const route = useRoute();
  const styles = useStyleSheet(themedStyle);
  // const [availableBalance, setAvalaibleBalance] = React.useState(0);
  //const [refreshing, setRefreshing] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [visibleTopUp, setVisibleTopUp] = React.useState(false);
  const [visibleTransfer, setVisibleTransfer] = React.useState(false);
  //const [isVerified, setIsVerified] = React.useState(false);
  const [isBusiness, setIsBusiness] = React.useState(false);
  const [savingAmount, setSavingAmount] = React.useState<string>();
  const [amountTopUp, setAmountTopUp] = React.useState("");
  const [transferEmail, setTransferEmail] = React.useState<string>();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [selectedIndexBudget, setSelectedIndexBudget] = React.useState(new IndexPath(0));
  const [selectedIndexPocketFrom, setSelectedIndexPocketFrom] = React.useState(new IndexPath(0));
  //const [pockets, setPockets] = React.useState([]);
  const onRefresh = React.useCallback(() => {
    // props.setPockets([])
    // props.setPocketsBusiness([])
    // console.log('ini '+props.pockets)
    // console.log('ini '+props.pocketsBusiness)
    props.setRefreshing(true);

    wait(2000).then(() => props.setRefreshing(false));
  }, []);

  //console.log("dari sini sas"+props.pockets)
  // React.useEffect(
  //   () => {
  //     console.log('data user from child :' + props.uid)
  //     const usersRef = firebase.default.database().ref();

  //     usersRef
  //       .child('/users/' + props.uid)
  //       .get()
  //       .then(async snapshot => {
  //         if (snapshot.exists()) {
  //           const userObj = snapshot.val();
  //           console.log('main balance :' + userObj.walletId)
  //           let pocketObj = userObj.personalPocket;
  //           let resultPocket = Object.keys(pocketObj).map((key) => pocketObj[key]);
  //           console.log('pocket'+resultPocket)
  //           setPockets(resultPocket);
  //           const balance = await getBalanceWallet(userObj.walletId);
  //           const balanceParse = JSON.parse(balance);
  //           if (balanceParse.status.status == 'SUCCESS') {
  //             setAvalaibleBalance(balanceParse.data.length != 0 ? balanceParse.data[0].balance : 0)
  //           }
  //         } else {
  //           console.log('not exist')
  //         }
  //       })
  //       .catch(error => {
  //         console.log(error)
  //       });



  //   }, [refreshing]
  // );

 

  const onTopUpButtonPress = (): void => {
    if (isVerified) {
      setVisible(true)
    } else {
      setVisibleTopUp(true);
      
    }

  };

  const onTransferButtonPress = (): void => {
    //console.log(props.pockets)
    if (isVerified) {
      setVisible(true)
    } else {
      setVisibleTransfer(true)
    }
  };

  const onAddPocket = (): void => {
    if (isVerified) {
      setVisible(true)
    } else {
      navigation && navigation.navigate('AddPocket', {isBusiness: isBusiness});
    }

  };


  // const [activeChecked, setActiveChecked] = React.useState(false);

  const onActiveCheckedChange = (isChecked) => {
    setIsBusiness(isChecked);
  };

const SeletPocket = () => {
  let idxPocket = selectedIndexBudget.toString();
  return(
    <Select style={{ flex: 1, marginVertical: 5, display: selectedIndex == 0 ? 'flex' : 'none' }}
              value={props.pockets[Number(idxPocket)-1].name}
              label='To Pocket'
              selectedIndex={selectedIndexBudget}
              onSelect={indexTag => setSelectedIndexBudget(indexTag)}>
              {props.pockets.map(item => {
                return <SelectItem
                  title={item.name}

                />
              })}


            </Select>
  )
}
const SeletPocketFrom = () => {
  let idxPocket = selectedIndexPocketFrom.toString();
  return(
    <Select style={{ flex: 1, marginVertical: 5}}
              value={props.pockets[Number(idxPocket)-1].name}
              label='From Pocket'
              selectedIndex={selectedIndexPocketFrom}
              onSelect={indexTag => setSelectedIndexPocketFrom(indexTag)}>
              {props.pockets.map(item => {
                return <SelectItem
                  title={item.name}

                />
              })}


            </Select>
  )
}

  return (
    <ScrollView style={styles.contentContainer} refreshControl={
      <RefreshControl
        refreshing={props.refreshing}
        onRefresh={onRefresh}
      />
    }>
      <Layout
        style={styles.header}
        level='1'>
        <View style={styles.profileContainer}>
          <Avatar
            style={styles.profileAvatar}
            size='large'
            source={require('./assets/ava2.png')}
          />
          <View style={styles.profileDetailsContainer}>
            <Text category='h4'>
              ${props.availableBalance}
            </Text>
            <View style={styles.profileLocationContainer}>
              {/* <PinIcon/> */}
              <Text

                appearance='hint'
                category='s1'>
                Avalaible Balance
              </Text>
            </View>
          </View>
          <Button
            style={styles.detailItem}
            appearance='outline'
            status={true ? 'primary':'basic'}
            size='tiny'
            accessoryLeft={VerifIcon}
            onPress={() => setVisible(true)}
          >
            verified
          </Button>

        </View>
        <View style={styles.profileButtonsContainer}>
          <Button
            status='primary'
            style={styles.profileButton}
            accessoryLeft={PersonAddIcon}
            onPress={onTopUpButtonPress}>
            Topup
          </Button>
          <Button

            style={styles.profileButton}
            accessoryLeft={MessageCircleIcon}
            onPress={onTransferButtonPress}>
            Transfer
          </Button>
        </View>
      </Layout>
      <View style={{ flexDirection: 'row', flex: 1, marginHorizontal: 8, alignItems: 'center', alignSelf: 'flex-end', padding: 5 }}>

        <Button size="small" appearance='outline' onPress={onAddPocket} accessoryLeft={PlusIcon}>
          Add Pocket
        </Button>
        <Toggle

          style={styles.toggle}
          checked={isBusiness}
          onChange={onActiveCheckedChange}>
          Business
        </Toggle>
      </View>
      <Modal
        visible={visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setVisible(false)}>
        <Card disabled style={styles.card} footer={(prop) => <Footer {...prop} setVisible={setVisible} navigation={navigation} />}>
          <Text>🤷‍♂️ Your identity is unverified, please verify it before using Pocketo features 👛</Text>
        </Card>

      </Modal>
      <Modal
      
        visible={visibleTopUp}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setVisibleTopUp(false)}>
        <Card disabled style={styles.card} footer={(prop) => <FooterTopUp {...prop} setVisible={setVisibleTopUp} idWallet={props.idWallet} amount={amountTopUp} navigation={navigation} />}>
          <React.Fragment>

            <Text category='label' appearance='hint'>
              Topup
            </Text>

            <SeletPocket/>
           
            <Input
              style={{ flex: 1, marginVertical: 5 }}
              value={savingAmount}
              label="Amount"
              textContentType="creditCardNumber"
              placeholder='Place amount transfer'
              onChangeText={nextValue => setSavingAmount(nextValue)}
            />


          </React.Fragment>
        </Card>

      </Modal>

      <Modal
        visible={visibleTransfer}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setVisibleTransfer(false)}>
        <Card disabled style={styles.card} footer={(prop) => <FooterTransfer {...prop} setVisible={setVisibleTransfer} navigation={navigation} />}>
          <React.Fragment>

            <Text category='label' appearance='hint'>
              Transfer to
            </Text>

            <RadioGroup
              style={{ flexDirection: 'row', }}
              selectedIndex={selectedIndex}
              onChange={index => setSelectedIndex(index)}>
              <Radio>My Pocket</Radio>
              <Radio>Pocketo User</Radio>
              <Radio>Bank</Radio>
            </RadioGroup>
            <SeletPocketFrom />
             <SeletPocket />
            
            

            <Input
              style={{ marginVertical: 5, flex: 1, display: selectedIndex == 1 ? 'flex' : 'none' }}
              value={transferEmail}
              label="User email"
              placeholder='Email'
              onChangeText={nextValue => setTransferEmail(nextValue)}
            />

            <Input
              style={{ flex: 1, marginVertical: 5, display: selectedIndex == 2 ? 'flex' : 'none' }}
              value={savingAmount}
              label="US General Bank Account Number"
              textContentType="creditCardNumber"
              placeholder='Account Number'
              onChangeText={nextValue => setSavingAmount(nextValue)}
            />
            <Input
              style={{ flex: 1, marginVertical: 5 }}
              value={savingAmount}
              label="Amount"
              textContentType="creditCardNumber"
              placeholder='Place amount transfer'
              onChangeText={nextValue => setSavingAmount(nextValue)}
            />


          </React.Fragment>
        </Card>

      </Modal>
      {/* <WalletTab  /> */}

    { isBusiness ? 
   <ProductListScreen {...props} navigation={navigation} isBusiness={isBusiness} />
    :
      <Tab.Navigator lazy={true} lazyPlaceholder={LoadPlaceholder} tabBarOptions={{ style: { backgroundColor: 'transparent' }, activeTintColor: '#FF6721', inactiveTintColor: '#8e9297', indicatorStyle: { display: 'none' } }}>
        <Tab.Screen name='All' children={(prop) => <ProductListScreen {...prop} {...props} isBusiness={isBusiness} />} />
        <Tab.Screen name='Income' children={(prop) => <ProductListScreen {...prop} {...props} isBusiness={isBusiness} />} />
        <Tab.Screen name='Expense' children={(prop) => <ProductListScreen {...prop} {...props} isBusiness={isBusiness} />} />
        <Tab.Screen name='Saving' children={(prop) => <ProductListScreen {...prop} {...props} isBusiness={isBusiness}  />} />

      </Tab.Navigator>
      }
    </ScrollView>
  );
};

const themedStyle = StyleService.create({
  contentContainer: {
    flex: 1,
    backgroundColor: 'background-basic-color-2',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  tabContainer: {
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    margin: 16,
  },
  header: {
    padding: 16,
    paddingBottom: 2,
  },
  toggle: {
    margin: 10,
    alignItems: 'center',
    flexDirection: 'row-reverse'
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  profileDetailsContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  profileLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  footerControl: {
    marginHorizontal: 2,
  },
  profileLocation: {
    marginHorizontal: 8,
  },
  profileAvatar: {
    marginHorizontal: 8,
  },
  profileButtonsContainer: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  profileButton: {
    flex: 2,
    marginHorizontal: 1.5,
  },
  detailItem: {
    marginHorizontal: 4,
    padding: 0,
    height: 30,
    alignSelf: 'center',
    borderRadius: 25,
  },
  profileSocialsDivider: {
    marginHorizontal: -16,
  },
  profileSocialsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 24,
    marginBottom: 8,
  },
  postsList: {
    paddingHorizontal: 8,
  },
  postItem: {
    width: 144,
    height: 144,
    borderRadius: 4,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
});
