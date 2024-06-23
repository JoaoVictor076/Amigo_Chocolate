import React, { useState } from 'react';
import { ButtonApp, Title } from '../Button/style';
import { Button, Touchable } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';


interface Props {
    title:string,
    onPress: () => Promise<void>;
}


const CustomButton = ({title, onPress , ...rest} : Props) => {

    return (
    <ButtonApp {...rest} onPress={onPress}>
        <Title>{title}</Title>
    </ButtonApp>
    );
}
  
  export default CustomButton;