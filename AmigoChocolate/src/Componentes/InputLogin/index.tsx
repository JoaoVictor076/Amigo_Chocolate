import { TextInputProps } from 'react-native';
import { InputLogin, Title } from './style'; // Supondo que este seja o arquivo onde você definiu os componentes estilizados Input e Title
import { TextInput } from 'react-native-gesture-handler';

interface LoginProps  extends TextInputProps {
 placeholder : string  
}

const LoginInput= ({ placeholder, ...rest } : LoginProps) => {
  return (
      <InputLogin {...rest} placeholder={placeholder}  
      />

  );
};

export default LoginInput;