import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { useNavigation, RouteProp  } from '@react-navigation/native';
import { StackTypes } from '../../routes/stack';
import axios from 'axios';

type ParamsType = {
  ListaParticipantes: {
    groupId: string;
  },
}

const URL = 'http://localhost:3000/';

const ListaParticipantes = ({route} : {route: RouteProp<ParamsType, 'ListaParticipantes'>}) => {
  const groupId = route.params.groupId
  const [participants, setParticipants] = useState<any[]>([]);
  const navigation = useNavigation<StackTypes>();

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await axios.post(`${URL}groups/getParticipants`, {groupId});
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Participantes do Grupo</Text>
      <FlatList
        data={participants}
        keyExtractor={(item) => item.userId}
        renderItem={({ item }) => (
          <View style={styles.participantContainer}>
            <View style={styles.participantInfo}>
              <Text style={styles.participantName}>{item.nome}</Text>
              <Text style={styles.participantEmail}>{item.email}</Text>
            </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8a2be2',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 20,
  },
  participantContainer: {
    width: '70%',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  participantInfo: {
    marginLeft: 10,
    marginTop: 10,
    width: '70%',
    textAlign: 'left',
    color: '#5C3A21',
    height: 60,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
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
