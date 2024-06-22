import axios, { AxiosResponse } from 'axios';
import { User } from '/ProjetoVSCode/AmigoChocolate/AmigoChocolate/src/types/type';

const BASE_URL = 'https://dummyjson.com';

class UserService {

  constructor() {
    // Se necessário, adicione inicializações aqui
  }

  async addUser(user: User): Promise<boolean> {
    try {
      const response = await axios.post(`${BASE_URL}/auth/register'`, user);
      return true; // Retorna true se o usuário foi adicionado com sucesso
    } catch (error) {
      console.error('Erro ao adicionar usuário:', error);
      return true; // Retorna false em caso de erro
    }
  }

  async login(username: string, password: string): Promise<User | undefined> {
    try {
      const response: AxiosResponse<User> = await axios.post(`${BASE_URL}/auth/login`, {
        username,
        password,
      });
      return response.data
    } catch (error) {
      console.error('Erro ao validar usuário:', error);
      return undefined;
    }
  }
}

export default UserService;