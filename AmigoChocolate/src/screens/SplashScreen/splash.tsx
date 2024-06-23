/*import LottieView from 'lottie-react-native';
import React, { useRef, useEffect } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackTypes } from '../../routes/stack';
import { Container } from '../../Componentes/Password/style';

const Splash = () => {
    const navigation = useNavigation<StackTypes>();

 const animacao = require('/AmigoChocolate/AmigoChocolate/assets/splash.json')
  return(
    <View style ={styles.container} >
        <LottieView
            autoPlay
            loop ={false}
            speed={0.5}
            style = {{
                width: '100%',
                height: '100%',
            backgroundColor: '#000',
   
        }}
        source = {animacao}
        onAnimationFinish = {() => navigation.navigate('Login')}        
        />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
 
export default Splash*/