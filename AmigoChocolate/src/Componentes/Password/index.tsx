import { TextInputProps } from 'react-native';
import { Container, InputPassword, IconEye } from './style'; // Supondo que este seja o arquivo onde você definiu os componentes estilizados Input e Title
import React, { useState } from 'react';

interface PasswordProps  extends TextInputProps {
 
}


const PassWordInput= ({ ...rest } : PasswordProps) => {

  const eye  = 'eye';
  const eyeOff = 'eye-off';

  const [iconPass, setIconPass] =  useState<'eye' | 'eye-off'>(eye);
  const [flShowPass, setShowPass] =  useState<boolean>(false);

  function handleChangeIcon() {
    let icone: 'eye' | 'eye-off' = iconPass === eye ? eyeOff : eye;
    let flShowPassAux = !flShowPass;
    setShowPass(flShowPassAux);
    setIconPass(icone);
}


  return (
    <Container>
      <InputPassword {...rest}  
      secureTextEntry={flShowPass}
      />
     <IconEye             
                name={iconPass}
                size={28}                
                onPress={handleChangeIcon}

      />

    </Container>
      
  );
};

export default PassWordInput;