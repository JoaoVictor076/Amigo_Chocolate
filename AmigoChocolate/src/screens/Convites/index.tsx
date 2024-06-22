
import { useNavigation, RouteProp  } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { Text, TextInput, View, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { StackTypes } from '../../routes/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'
import { Title } from '../Login/style';

type ParamsType = {
  Convites: {
    nome: string;
    groupId: string;
  },
}

const URL = 'http://localhost:3000/';

const Convites = ({route} : {route: RouteProp<ParamsType, 'Convites'>}) => {
  const [userUid, setUserUid] = useState('')
  const [nome, setNome] = useState()

  const navigation = useNavigation<StackTypes>();

  const handleHome = () => {
    navigation.navigate('Home');
  }
  const handleListaGrupos = () => {
    navigation.navigate('ListaGrupos');
  }

  const handleAcceptInvite = async () =>{
    try {
      const response = await axios.post(`${URL}groups/addParticipant`, {
        groupId: route.params.groupId,
        userUid: userUid,
      });

      if(response.status === 200){
        console.log('Sucesso, você entrou no grupo! ', response.data);
        handleListaGrupos();
      } else {
        console.log('Erro ao entrar no grupo: ', response.data)
      }
    } catch (error) {
      console.log('Erro catch: ', error);
    }
  }

  function userLoggedIn(){
    AsyncStorage.getItem('@user').then((value) => {
      if (value !== null) {
        const user = JSON.parse(value)
        setUserUid(user.uid)
      }
    });
  }

  useEffect(()=>{
    userLoggedIn()
  }, [])

  return (
    <View style={styles.container}>
      <View style = {styles.styleView}>
        <Text  style = {styles.title}> Convite</Text>
        <Text  style = {styles.title}> Você foi convidado a entrar no grupo {route.params.nome}</Text>
      </View> 
      <TouchableOpacity onPress={handleAcceptInvite} style={styles.button} activeOpacity={0.1}>
        <Text style={styles.buttonText}>Aceitar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleHome} style={styles.button} activeOpacity={0.1}>
        <Text style={styles.buttonText}>Recusar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8a2be2', // Mesma cor de fundo da tela de Login
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff', // Um azul escuro acinzentado para o título
    textAlign: 'center',
    marginTop: 20, // Aumente este valor conforme necessário para descer o texto
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: '#D3A46F', // Mesma cor da borda dos inputs da tela de Login
    backgroundColor: '#FFFAF2', // Mesmo fundo dos inputs da tela de Login
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#5C3A21', // Mesma cor do texto dos inputs da tela de Login
  },
  styleView:{
    marginBottom : 50,
  },
  button: {
    width: '80%',
    height: 50,
    borderRadius: 20,
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
    color: '#FFF7EB', // Mesmo texto do botão da tela de Login
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

export default Convites;
