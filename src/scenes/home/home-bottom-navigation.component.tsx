import React from 'react';
import { BottomNavigationTab, Divider,Button, Icon } from '@ui-kitten/components';
import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { BrandBottomNavigation } from '../../components/brand-bottom-navigation.component';
import { PersonIcon, HomeIcon } from '../../components/icons';

export const HomeBottomNavigation = (props): React.ReactElement => {

  const onSelect = (index: number): void => {
    props.navigation.navigate(props.state.routeNames[index]);
  };
  
  const ScanIcon = (props) => (
    <Icon {...props} name='qrcode-scan' pack='material' />
  );

  const renderBookButton = () => (
    <Button
      style={{
        width: 56,
        height: 56,
        marginTop: -24,
        borderRadius: 28,
        borderColor: '#fff',
        borderWidth: 4
      }}
      onPress={()=>onSelect(1)}
      accessoryLeft={ScanIcon}
    />
  );
  return (
    <SafeAreaLayout insets='bottom'>
      <Divider/>
      <BrandBottomNavigation
        appearance='noIndicator'
        selectedIndex={props.state.index}
        onSelect={onSelect}>
        <BottomNavigationTab
          title='Home'
          icon={HomeIcon}
        />
        <BottomNavigationTab
         
          title='Pay'
          icon={renderBookButton}
        />
        <BottomNavigationTab
          title='Account'
          icon={PersonIcon}
        />
      </BrandBottomNavigation>
    </SafeAreaLayout>
  );
};
