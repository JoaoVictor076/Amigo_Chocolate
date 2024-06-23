import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Image,TouchableOpacity, Platform  } from 
'react-native';
import { useNavigation, RouteProp  } from '@react-navigation/native';
import { StackTypes } from '../../routes/stack';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URL } from '../config/index'

type ParamsType = {
  AtualizarGrupo: {
    groupId: string;
  },
}

const  AtualizarGrupo =({route} : {route: RouteProp<ParamsType, 'AtualizarGrupo'>}) => {
  
  const [nome, setNome] = useState<string>('')
  const [quantidade, setQuantidade] = useState<string>('')
  const [valor, setValor] = useState<string>('')
  const [revelacao, setRevelacao] = useState<string>('')
  const [descricao, setDescricao] = useState<string>('')
  const [nomeConsole, setNomeConsole] = useState<string>(' ')
  const [qtdConsole, setQtdConsole] = useState<string>(' ')
  const [valorConsole, setValorConsole] = useState<string>(' ')
  const [revelacaoConsole, setRevelacaoConsole] = useState<string>(' ')
  const [descricaoConsole, setDescricaoConsole] = useState<string>(' ')
  const [adminUid, setadminUid] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const groupId = route.params.groupId


  const navigation = useNavigation<StackTypes>();

  const handleNavegarLista = () => {
    navigation.navigate('ListaGrupos');
  };

  const handleAtualizarGrupo = async () => {
    if(!validateForm()){
      return false;
    }
    
    try {
      const response = await axios.post(`${URL}groups/updateGroup`, {
        groupId,
        nome,
        qtdMax: quantidade,
        valor,
        dataRevelacao: revelacao,
        descricao,
        adminUid, 
        participantes: [adminUid],
        image
      });

      if (response.status === 200) {
        console.log('Grupo atualizado com sucesso!');
        handleNavegarLista()
      } else {
        console.log('Erro ao atualizar grupo:', response.data);
      }
    } catch (error: any) {
      console.log('Erro ao atualizar grupo:', error.message);
    }
  };

  const handleGetGroupData = async () => {

    try {
      const response = await axios.post(`${URL}groups/getGroupById`, {
        groupId
      });

      if (response.status === 200) {
        console.log('Grupo recuperado com sucesso!');
        const data = response.data;
        setNome(data.nome);
        setQuantidade(data.qtdMax);
        setValor(data.valor);
        setRevelacao(data.dataRevelacao);
        setDescricao(data.descricao);
        setImage(data.image)
        setadminUid(data.adminUid)
      } else {
        console.log('Erro ao recuperar grupo:', response.data);
      }
    } catch (error: any) {
      console.log('Erro ao recuperar grupo:', error.message);
    }
  };


  function userLoggedIn(){
    AsyncStorage.getItem('@user').then((value) => {
      if (value !== null) {
        const user = JSON.parse(value)
        setadminUid(user.uid)
      }
    });
  }

  function isDateGreaterOrEqual(dateStr:string) {
    const [day, month, year] = dateStr.split('/').map(Number);

    const inputDate = new Date(year, month - 1, day); 

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return inputDate >= currentDate;
    
  }    
  
  const validateForm = () => {
    let regular = true

    if(nome.length == 0 || nome.length >= 20){
      setNomeConsole('nome inválido')
      regular = false
    }
    if (parseInt(quantidade) <= 1  || quantidade.length == 0) {
      setQtdConsole('A quantidade de integrantes deve ser maior que 0')
      regular = false
    }
    if (parseFloat(valor) <= 0 || valor.length == 0){
      setValorConsole('o valor não pode ser nulo ou igual a 0')
      regular = false
    }

    
    if (revelacao.length == 0 ){
      setRevelacaoConsole('A data de revelação não pode ser nula')
      regular = false
      }
    const regex:RegExp = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    
    if(!regex.test(revelacao)){
      setRevelacaoConsole('Data inválida')
      regular = false
    }
    if(!isDateGreaterOrEqual(revelacao)){
      setRevelacaoConsole('Aquela data já faz parte do passado; é hora de olhar para frente e escolher uma data futura.')
      regular = false
    }
    if (descricao.length == 0){
      setDescricaoConsole('A descrição não pode ser nula')
      regular = false
    }
    if (descricao.length >= 50){
      setDescricaoConsole('A descrição não precisa ser tão grande rsrs')
      regular = false
    }

    if(regular){
      setNome('')
      setNomeConsole(' ')
      setQuantidade('')
      setQtdConsole(' ')
      setValor('')
      setValorConsole(' ')
      setRevelacao('')
      setRevelacaoConsole(' ')
      setDescricao('')
      setDescricaoConsole(' ')
    }

    return regular;
  }

  const pickImage = async () => {
    if (Platform.OS === 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Desculpe, precisamos da permissão para acessar a galeria!');
        return;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  
  useEffect(() => {
    handleGetGroupData()
    userLoggedIn();
  }, [])

  return (
    <View style={styles.container}>
      {image ? <Image source={{ uri: image }} style={styles.imageStyleGroup}/> :  <Image source={require('../../../assets/avatar.png')} style={styles.imageStyleGroup}/>}
      <View style={styles.content}>
        <TextInput style={styles.input} 
        placeholder="Nome" 
        onChangeText={setNome} 
        value={nome}
        />
        <Text style={styles.console}>{nomeConsole}</Text>
          <TextInput
          style={styles.input}
          placeholder="qtd Max"
          onChangeText={setQuantidade} 
          value={quantidade}
        />
        <Text style={styles.console}>{qtdConsole}</Text>
        <TextInput style={styles.input} 
        placeholder="valor" 
        onChangeText={setValor} 
        value={valor}
        />
        <Text style={styles.console}>{valorConsole}</Text>
        <TextInput style={styles.input} 
        placeholder="data revelação" 
        onChangeText={setRevelacao} 
        value={revelacao}
        />
        <Text style={styles.console}>{revelacaoConsole}</Text>
        <TextInput style={styles.input} 
        placeholder="descrição" 
        onChangeText={setDescricao} 
        value={descricao}
        />
        <Text style={styles.console}>{descricaoConsole}</Text>
        <TouchableOpacity onPress={pickImage} style={styles.button}>
          <Text style={styles.buttonText}> Selecionar Imagem </Text>
        </TouchableOpacity>
        
      <TouchableOpacity  onPress={handleAtualizarGrupo} style={styles.button} activeOpacity={0.1}>
        <Text style={styles.buttonText}> Atualizar Grupo </Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#8a2be2',
    width: '100%'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  button: {
    width: '80%',
    height: 50,
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
    color: '#FFF7EB', // Mesmo texto do botão da tela de Login
    fontSize: 18,
    fontWeight: '600',
  },
  menu: {
    fontSize: 24,
    color: '#fff',
  },
  console:{
    color: '#fff',
    marginTop: -16,
    marginBottom: 10,
    width: '80%',
    fontSize: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color:'#fff',
    textAlign: 'center',
    marginTop: 60,
  },
  content:{
    flex :1,
    justifyContent:'center',
    alignItems:'center'
  },
  input:{
    width: '80%',
    minWidth: 200,
    maxWidth: 350,
    height: 50,
    borderColor: '#D3A46F', 
    backgroundColor: '#FFFAF2', 
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#5C3A21', 
  },
  imageStyleGroup:{
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
  },
});


export default AtualizarGrupo;