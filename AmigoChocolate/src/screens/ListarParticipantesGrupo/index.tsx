import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { StackTypes } from '../../routes/stack';
import axios from 'axios';
import { URL } from '../config/index';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ParamsType = {
  ListaParticipantes: {
    groupId: string;
  };
};

type UserDetails = {
  uid: string;
};

type GroupData = {
  groupId: string;
  nome: string;
  qtdMax: number;
  valor: number;
  dataRevelacao: string;
  descricao: string;
  adminUid: string;
  participantes: string[];
  image?: string;
  sorteado: boolean;
  pares: any[];
};

type Participant = {
  userId: string;
  nome: string;
  email: string;
  avatarUrl: string;
};

const ListaParticipantes = ({ route }: { route: RouteProp<ParamsType, 'ListaParticipantes'> }) => {
  const groupId = route.params.groupId;
  const [participants, setParticipants] = useState<Participant[]>([]);
  const navigation = useNavigation<StackTypes>();
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userDatail, setUserDatail] = useState<UserDetails | null>(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await axios.post(`${URL}groups/getParticipants`, { groupId });
        if (response.status === 200) {
          setParticipants(response.data);
        } else {
          console.error('Erro ao buscar participantes:', response.data);
        }
      } catch (error: any) {
        console.error('Erro ao buscar participantes:', error.message);
      }
    };

    fetchParticipants();
  }, [groupId]);

  const handleBack = () => {
    navigation.navigate('ListaGrupos');
  };

  const handleNavegarLista = () => {
    navigation.navigate('ListaGrupos');
  };

  const handleRemoveParticipant = async (userUid: string) => {
    try {
      const response = await axios.post(`${URL}groups/removeParticipant`, {
        groupId,
        userUid,
      });

      if (response.status === 200) {
        console.log('Participante removido com sucesso!');
        handleNavegarLista()
      } else {
        console.log('Erro ao remover participante:', response.data);
      }
    } catch (error: any) {
      console.log('Erro ao remover participante:', error);
    }
  };

  const userLoggedIn = () => {
    AsyncStorage.getItem('@user').then((value) => {
      if (value !== null) {
        const user = JSON.parse(value);
        setUserDatail(user);
      }
    });
  };

  useEffect(() => {
    userLoggedIn();
  }, []);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await axios.post(`${URL}groups/getGroupById`, { groupId });
        setGroupData(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchGroupData();
  }, [groupId]);

  useEffect(() => {
    console.log(groupData);
    console.log(userDatail);
  }, [groupData, userDatail]);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

  return (
    <View style={styles.container}>
      {groupData && groupData.image ? (
        <Image source={{ uri: groupData.image }} style={styles.image} />
      ) : (
        <Text>Imagem não disponível</Text>
      )}
      <Text style={styles.title}>Participantes do Grupo {groupData && groupData.nome}</Text>
      <FlatList
        data={participants}
        keyExtractor={(item) => item.userId}
        renderItem={({ item, index }) => (
          <View style={styles.participantContainer}>
            {item.avatarUrl ? <Image source={{ uri: item.avatarUrl }} style={styles.imageStyleAvatar}/> : <Image source={require('../../../assets/avatar.png')} style={styles.imageStyleAvatar}/>}
            <View style={styles.participantInfo}>
              <Text style={styles.participantName}>{item.nome}</Text>
              <Text style={styles.participantEmail}>{item.email}</Text>
            </View>
            {userDatail?.uid === groupData?.adminUid && index !== 0 && (
              <TouchableOpacity style={styles.buttonDelete} onPress={() => handleRemoveParticipant(item.userId)}>
                <AntDesign name="delete" size={24} color="black" />
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      <TouchableOpacity style={styles.button} onPress={handleBack}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8a2be2',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 100,
    marginTop: 20,
  },
  imageStyleAvatar: {
    width: 50,
    height: 50,
    borderRadius: 100,
    marginLeft: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  participantContainer: {
    width: '100%',
    minWidth: 350,
    height: 60,
    borderColor: '#D3A46F',
    backgroundColor: '#f8dcff',
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 10,
    textAlign: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participantInfo: {
    marginLeft: 2,
    marginTop: 10,
    width: '70%',
    textAlign: 'left',
    color: '#5C3A21',
    height: 60,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    overflow: 'hidden',
    paddingRight: 10,
  },
  participantName: {
    fontWeight: 'bold',
    fontSize: 17,
  },
  participantEmail: {
    fontWeight: 'bold',
    fontSize: 17,
  },
  button: {
    width: '80%',
    height: 50,
    borderRadius: 20,
    backgroundColor: '#6600CC',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#2D2926',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonDelete:{
    width: 25,
    height: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  buttonText: {
    color: '#FFF7EB',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonIcon: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginTop: 0,
  },
  imageStyle: {
    borderColor: '#D3A46F',
    borderWidth: 1,
    width: 70,
    height: 70,
    alignSelf: 'center',
    borderRadius: 50,
    marginLeft: 10,
  },
});

export default ListaParticipantes;
