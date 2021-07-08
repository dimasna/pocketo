import React from 'react';
import { Dimensions, ImageBackground, ListRenderItemInfo, View, ViewProps } from 'react-native';
import { Button, Card, List, StyleService, Text, useStyleSheet } from '@ui-kitten/components';
import * as Progress from 'expo-progress';
import { CartIcon } from './extra/icons';
import { Product } from './extra/data';
import * as firebase from 'firebase';

const products: Product[] = [
  Product.pinkChair(),
  Product.blackLamp(),
  Product.whiteChair(),
  Product.woodChair()
];

export const ProductListScreen = ({ navigation, route, pockets, pocketsBusiness, isBusiness, refreshing, setRefreshing, availableBalance }): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);

  console.log('dari sini'+JSON.stringify(pockets))
  console.log('dari sini'+JSON.stringify(pocketsBusiness))
  // const [pockets, setPockets] = React.useState([]);

//   React.useEffect(
//     () => {
//       console.log('data user from product list :'+ uid)
//       const usersRef = firebase.default.database().ref();
        
//          usersRef
//           .child('/users/'+uid+'/personalPocket')
//              .get()
//              .then(async snapshot => {
//                if (snapshot.exists()) {
//                  const pocketObj = snapshot.val();
//                  console.log('pocket list :' + JSON.stringify(pocketObj))
//                  let result = Object.keys(pocketObj).map((key)=>pocketObj[key])
//                  console.log(result)
//                  setPockets(result);
//         //        const balance = await getBalanceWallet(userObj.walletId);
//         //        const balanceParse = JSON.parse(balance);
//         //        if(balanceParse.status.status == 'SUCCESS'){
//         //          setAvalaibleBalance(balanceParse.data.length != 0 ? balanceParse.data[0].balance : 0)
               
//               }else{
//               console.log('not exist')
//             }
//             })
//            .catch(error => {
//              console.log(error)
//           });
     
//    },[refreshing]
//  );
let displayProducts;

if(isBusiness){


  displayProducts =  pocketsBusiness ;
}else{
  displayProducts =  route.name === 'All' ? pockets : pockets.filter(product => product.type === route.name);
}
console.log('display'+JSON.stringify(displayProducts));

  const onItemPress = (index: number, info): void => {
    console.log('item klik' + JSON.stringify(info));
    navigation && navigation.navigate('DetailPocket', {pocket: info.item});
  };


  const renderItemFooter = (props: ViewProps, info): React.ReactElement => (
    <View style={[props.style, styles.itemFooter]}>
      <Text category='s1' style={{textAlign: 'center'}}>
        ${info.item.balance}
      </Text>
    
   
    </View>
  );

  const renderItemHeader = (props, info): React.ReactElement => (
    <ImageBackground
      style={[props.style, styles.itemHeader]}
      source={ info.item.imageUrl ? {uri: info.item.imageUrl}: require('./assets/nopocketimage.png')}
    />
  );

  const renderProductItem = (info): React.ReactElement => {
    let progress = info.item.type == 'Income' || info.item.type == 'Business' ? 1 : info.item.type == 'Saving' ?  info.item.balance/(1*info.item.targetSaving): info.item.currExpense/(1*info.item.budget);
    
    return (
    <Card
      style={styles.productItem}
      header={props => renderItemHeader(props, info)}
      footer={props => renderItemFooter(props, info)}
      onPress={() => onItemPress(info.index, info)}>
      <Text category='s1'>
        {info.item.name}
      </Text>
      <Text
        appearance='hint'
        category='c1'>
        {info.item.type}
      </Text>
      <Progress.Bar style={{marginTop: 10}} isAnimated={false} progress={progress} trackColor="#ecf" color={ info.item.type == 'Expense' ? 'red' : 'green'} />
      <Text appearance='hint' category='c2' style={{color: info.item.type == 'Expense' ? 'red' : 'green', textAlign:'right'}}>
        {Math.floor(progress*100)}%
      </Text>
      </Card>
  );
  }
  return (
    <List
      contentContainerStyle={styles.productList}
      data={displayProducts.length && displayProducts}
      numColumns={2}
      renderItem={renderProductItem}
    />
  );
};

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    backgroundColor: 'background-basic-color-2',
  },
  productList: {
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  productItem: {
    flex: 1,
    margin: 8,
    maxWidth: Dimensions.get('window').width / 2 - 24,
    backgroundColor: 'background-basic-color-1',
  },
  itemHeader: {
    height: 140,
  },
  itemFooter: {
    flex: 1,
    alignItems: 'center',
  },
  iconButton: {
    paddingHorizontal: 0,
  },
});
