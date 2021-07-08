import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRoute } from '@react-navigation/native';
import { Profile } from './extra/data';
import { createIdentityPage } from '../../../services/rapydAPI';
import crypto from 'crypto-js';

const profile: Profile = Profile.jenAustin();

export default (props): React.ReactElement => {
  const route = useRoute();
  const [rating, setRating] = React.useState<number>(profile.experience);
  const [uri, setUri] = React.useState("");
  const { page } = route.params;

  React.useEffect(() => {
    (async () => {
      if(page == 'verify'){
        const pid = crypto.lib.WordArray.random(12).toString();
        const getUri = await createIdentityPage(props.idWallet,props.idContact,pid)
        let result = JSON.parse(getUri);
        setUri(result.data.redirect_url);
        console.log('urinya :'+result.data.redirect_url)
       }
   
    })();
    
  }, []);

  
  

  if (page == 'verify') {
    return (
      uri != "" ?
      <WebView
        originWhitelist={['*']}
        source={{ uri: uri }}
        startInLoadingState
        renderLoading={() => (
          <View style={{ flex: 1, alignItems: 'center' }}>
            <ActivityIndicator size="large" />
          </View>
        )}

      />:<></>
        
    );
  } else if (page == 'topup') {
    return (
      <WebView
        originWhitelist={['*']}
        source={{ uri: "https://sandboxcheckout.rapyd.net?token=checkout_53a44a6fb7b7df24a494828daf6f9971"}}
        startInLoadingState
        renderLoading={() => (
          <View style={{ flex: 1, alignItems: 'center' }}>
            <ActivityIndicator size="large" />
          </View>
        )}

      />

    );

  } else (
    console.log('else sini')
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileDetailsContainer: {
    position: 'absolute',
    paddingHorizontal: 24,
    paddingBottom: 32,
    left: 0,
    right: 0,
    bottom: 0,
  },
  profileName: {
    marginVertical: 16,
  },
  profileLocation: {
    marginVertical: 8,
  },
  profileParametersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 64,
  },
});
