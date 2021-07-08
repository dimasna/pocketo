import React from 'react';
import { ImageProps } from 'react-native';
import { Icon, IconElement, useTheme } from '@ui-kitten/components';

export const MessageCircleIcon = (props: Partial<ImageProps>): IconElement => (
  <Icon {...props} name='arrow-circle-right'/>
);

export const PersonAddIcon = (props: Partial<ImageProps>): IconElement => (
  <Icon {...props} name='arrow-circle-up'/>
);

export const PinIcon = (): IconElement => {
  const theme = useTheme();
  return (
    <Icon width={16} height={16} fill={theme['text-hint-color']} name='pin'/>
  );
};

