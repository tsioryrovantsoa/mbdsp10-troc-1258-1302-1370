import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const LoginForm = ({ onSubmit }: { onSubmit: (username:string, password:string) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    onSubmit(username, password);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={false}
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    color: 'white',
    paddingHorizontal: 8,
  },
});

export default LoginForm;
