
import { useNavigation } from '@react-navigation/native';
import React, { useState, useCallback, useEffect } from 'react';
import { Text, TextInput, View, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { StackTypes } from '../../routes/stack';
import { Title } from '../Login/style';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URL } from '../config/index'

const Home = () => { 
  
  const [user, setUser] = useState({})
  const navigation = useNavigation<StackTypes>();
  
  const handleCriarGrupo = () => {
    navigation.navigate('CriarGrupo');
  }
  const handleListaGrupos = () => {
    navigation.navigate('ListaGrupos');
  }

  const handleLogout = () => {
      AsyncStorage.removeItem('@user');
      navigation.navigate('Login');
  }

  return (
    <View style={styles.container}>
      
      <TouchableOpacity onPress={handleCriarGrupo} style={styles.button} activeOpacity={0.1}>
      <MaterialCommunityIcons name="account-group-outline" size={50} color="white" />
        <Text style={styles.buttonText}>Criar Grupo</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleListaGrupos} style={styles.button} activeOpacity={0.1}>
        <MaterialCommunityIcons name="format-list-text" size={45} color="white" />
        <Text style={styles.buttonText}>Listar Grupos</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout} style={styles.button} activeOpacity={0.1}>
        <MaterialIcons name="logout" size={40} color="white" />
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    backgroundColor: '#FFECF9',
    borderTopLeftRadius: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFECF9', // Um azul escuro acinzentado para o título
    textAlign: 'center',
    marginTop: 20, // Aumente este valor conforme necessário para descer o texto
  },
  button: {
    width: 120,
    height: 120,
    borderRadius: 10,
    backgroundColor: '#6600CC', // Mesma cor do botão da tela de Login
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#2D2926', // Mesma sombra do botão da tela de Login
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonText: {
    color: '#FFECF9', // Mesmo texto do botão da tela de Login
    fontSize: 18,
    fontWeight: '600',
  },

  imageStyle: {
    width: 120, // Tamanho aumentado para que a imagem seja mais destacada
    height: 120, // Tamanho aumentado para que a imagem seja mais destacada
    borderRadius: 60, // Metade da largura/altura para manter a forma circular
    alignSelf: 'center',
    marginTop: 5, // Aumente esta margem para diminuir a proximidade com o texto "Login"
    marginBottom: 20, // Adicionado para dar espaço antes dos campos de entrada
  },

});

export default Home;
