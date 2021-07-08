import React from 'react';
import { ScrollView, View, Alert, Platform, ImageSourcePropType } from 'react-native';
import { Button, IndexPath,Spinner, Layout, StyleService, Text, useStyleSheet, Input, RadioGroup, Radio, Select, SelectItem } from '@ui-kitten/components';
import { ProfileAvatar } from './extra/profile-avatar.component';
import { ProfileSetting } from './extra/profile-setting.component';
import { CameraIcon } from './extra/icons';
import { Profile } from './extra/data';
import { KeyboardAvoidingView } from './extra/3rd-party';
import * as ImagePicker from 'expo-image-picker';
import * as firebase from 'firebase';
import crypto from "crypto-js";

const profile: Profile = Profile.jenniferGreen();
const data = [
  'Daily Need',
  'Entertainment',
  'Shopping',
  'Family',
  'Other'
];
const dataBudget = [
  'Daily',
  'Monthly',
];

export default ({ navigation, route, uid }): React.ReactElement => {

  const [loading, setLoading] = React.useState(false);
  const [pocketName, setPocketName] = React.useState<string>();
  const [pocketDetail, setPocketDetail] = React.useState<string>();
  const [pocketImage, setPocketImage] = React.useState<string>();
  const [budgetAmount, setBudgetAmount] = React.useState<string>();
  const [savingAmount, setSavingAmount] = React.useState<string>();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [selectedIndexTag, setSelectedIndexTag] = React.useState(new IndexPath(0));
  const [selectedIndexBudget, setSelectedIndexBudget] = React.useState(new IndexPath(0));

 
  const clearState = () => {
    setLoading(false);
    setPocketName("");
    setPocketDetail("");
    setPocketImage("");
    setBudgetAmount(""),
    setSavingAmount("");
    setSelectedIndex(0);
    setSelectedIndexTag(new IndexPath(0));
    setSelectedIndexBudget(new IndexPath(0));
  }

  React.useEffect(() => {
    (async () => {
     
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
    console.log('index :'+selectedIndexTag)
    console.log('isBusiness'+route.params.isBusiness)
    console.log('uid dari add card'+uid)
  }, [selectedIndexTag]);

  const styles = useStyleSheet(themedStyles);

  const onChooseImagePress = async () => {
    //let result = await ImagePicker.launchCameraAsync();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    console.log('hasil :'+JSON.stringify(result))

    if (!result.cancelled) {
      setPocketImage(result.uri)
      // uploadImage(result.uri, "test-kfe")
      //   .then((url) => {
      //     setPocketImage(url)
      //   })
      //   .catch((error) => {
      //     Alert.alert(error);
      //   });
    }
  }

  const uploadImage = async (uri, imageName) => {
    const blob:any = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  
    const ref = firebase.default.storage().ref().child(imageName);
    const snapshot = await ref.put(blob);
  
    // We're done with the blob, close and release it
    blob.close();
  
    return await snapshot.ref.getDownloadURL();
  }

  const onDoneButtonPress = async (): Promise<void> => {
    setLoading(true);
    const pid = crypto.lib.WordArray.random(12).toString();
    let idxTag= selectedIndexTag.toString();
    let idxBudgetPeriod = selectedIndexBudget.toString();
    // console.log('image :'+tag)
    const imageUrl = pocketImage == undefined ? "" : await uploadImage(pocketImage,pid);
    const userRef = firebase.default.database().ref().child(`users/${uid}/${route.params.isBusiness?'businessPocket/':'personalPocket/'}${pid}`);
    let data = {};
    let type = ['Income','Expense','Saving']

    if(route.params.isBusiness){
      data = {
        id: pid,
        name: pocketName,
        imageUrl: imageUrl,
        type: "Business",
        balance: 0,
        details: pocketDetail,
        totalIn: 0,
        totalOut: 0
      };
    }else{

    if(selectedIndex == 0){
      data = {
        id: pid,
        name: pocketName,
        imageUrl: imageUrl,
        type: type[selectedIndex],
        balance: 0,
        details: pocketDetail,
        totalIn: 0,
        totalOut: 0
      };
    }else if(selectedIndex == 1){
      data = {
        id: pid,
        name: pocketName,
        imageUrl: imageUrl,
        type: type[selectedIndex],
        balance: 0,
        details: pocketDetail,
        tags: idxTag,
        budgetPeriod: idxBudgetPeriod,
        budget: budgetAmount,
        currExpense: 0
        
      };
    }else{
      data = {
        id: pid,
        name: pocketName,
        imageUrl: imageUrl,
        type: type[selectedIndex],
        balance: 0,
        details: pocketDetail,
        targetSaving: savingAmount,
        currSaving: 0
      };
    }
  }

    userRef.set(data).then((resp)=>{
      console.log(resp)
      setLoading(false)
    clearState();
    navigation.navigate('Home',{refresh: true})
    })
  };

  const LoadingIndicator = (props) => (
    <View style={[props.style, {
      justifyContent: 'center',
      alignItems: 'center',
    }]}>
      <Spinner style={{borderColor: 'white'}} size='small'/>
    </View>
  );
  

  const renderPhotoButton = (): React.ReactElement => (
    <Button
      style={styles.photoButton}
      status='primary'
      accessoryLeft={CameraIcon}
      onPress={onChooseImagePress}
    />
  );

  return (

    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}>
      <KeyboardAvoidingView style={styles.container}>
        <ProfileAvatar
          style={styles.photo}
          source={pocketImage == undefined ? require('./assets/nopocketimage.png') : {uri: pocketImage}}
          editButton={renderPhotoButton}
        />
        <View style={[styles.container, styles.formContainer]}>
          <Input
            style={styles.formInput}
            value={pocketName}
            label='Pocket Name'
            placeholder='Place your pocket name'
            onChangeText={nextValue => setPocketName(nextValue)}
          />

          <View style={{display: route.params.isBusiness ? 'none':'flex'}}>
          <React.Fragment>

            <Text style={styles.formInput} category='label' appearance='hint'>
              Pocket Type
            </Text>

            <RadioGroup
              style={{ flexDirection: 'row', }}
              selectedIndex={selectedIndex}
              onChange={index => setSelectedIndex(index)}>
              <Radio >Income</Radio>
              <Radio>Expense</Radio>
              <Radio>Saving</Radio>
            </RadioGroup>

          </React.Fragment>
          </View>

          <Input
            style={styles.formInput}
            value={pocketDetail}
            label='Pocket Details'
            placeholder='Place your pocket details'
            onChangeText={nextValue => setPocketDetail(nextValue)}
          />

          <Select style={[styles.formInput, { display: selectedIndex == 1 ? 'flex' : 'none' }]}
            value={data[selectedIndexTag.row]}
            label='Pocket Tags'
            caption='*Required for Deals Recommendation'
            selectedIndex={selectedIndexTag}
            onSelect={indexTag => setSelectedIndexTag(indexTag)}>
            {data.map(item=>{
              return <SelectItem
              title={item}

            />
            })}
            
          </Select>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', display: selectedIndex == 1 ? 'flex' : 'none' }}>
          <Select style={[styles.formInput, { flex: 1}]}
            value={dataBudget[selectedIndexBudget.row]}
            label='Expense Budget'
            caption="Period"
            selectedIndex={selectedIndexBudget}
            onSelect={indexTag => setSelectedIndexBudget(indexTag)}>
            <SelectItem
              title='Daily'

            />
            <SelectItem
              title='Monthly'

            />
            
          </Select>
          <Input
            style={[styles.formInput, {flex: 1}]}
            value={budgetAmount}
            label=" "
            textContentType="creditCardNumber"
            caption='Budget Amount'
            placeholder='Place your budget?'
            onChangeText={nextValue => setBudgetAmount(nextValue)}
          />
          </View>
          <Input
            style={[styles.formInput, {flex: 1,display: selectedIndex == 2 ? 'flex' : 'none' }]}
            value={savingAmount}
            label="Target Saving"
            textContentType="creditCardNumber"
            placeholder='Place your target saving amount'
            onChangeText={nextValue => setSavingAmount(nextValue)}
          />

        </View>

            {loading ?
            <Button
            style={styles.doneButton}
            accessoryLeft={LoadingIndicator}
            disabled />
            
           :
           <Button
          style={styles.doneButton}
          onPress={()=>onDoneButtonPress()}>
          CREATE
        </Button>

          }
        
      </KeyboardAvoidingView>
    </ScrollView>

  );
};

const themedStyles = StyleService.create({
  container: {
    backgroundColor: 'background-basic-color-2',
  },
  contentContainer: {
    paddingVertical: 24,
    backgroundColor: 'background-basic-color-2',
  },
  formContainer: {
    marginTop: 16,
    paddingHorizontal: 24,
  },
  formInput: {
    marginTop: 16,
  },
  photo: {
    alignSelf: 'center',
    width: 320,
    height: 220,
    borderRadius: 16,
  },
  photoButton: {
    right: 16,
    top: 32,
    width: 48,
    height: 48,
    borderRadius: 24,

  },
  description: {
    padding: 24,
    backgroundColor: 'background-basic-color-1',
  },
  setting: {
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

