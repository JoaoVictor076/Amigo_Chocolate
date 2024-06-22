import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import theme from './src/styles/theme';
import StackComponent from '../AmigoChocolate/src/routes/stack';
import Toast from 'react-native-toast-message';

export default function App() {

  return (
    <>
      <StackComponent />
      <Toast />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text:{
    fontSize:24
  },
  textInput:{
    borderColor: theme.colors.red,
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 24,
    width:300,
    paddingTop: 10,
    paddingBottom: 10
  },
  button: {
    backgroundColor: theme.colors.blue,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  }
});