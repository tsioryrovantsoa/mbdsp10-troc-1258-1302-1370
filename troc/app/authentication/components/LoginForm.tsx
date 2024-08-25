import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable } from 'react-native';

const LoginForm = ({ onSubmit }: { onSubmit: (username:string, password:string) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    onSubmit(username, password);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Takalo</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Username"
          placeholderTextColor="#003f5c"
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Password"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <Pressable style={styles.loginBtn} onPress={handleLogin} >
        <Text style={styles.loginText}>LOGIN</Text>
      </Pressable>
      <Pressable style={styles.signupBtn}>
        <Text style={styles.signupText}>Signup</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#fb5b5a',
    marginBottom: 40,
  },
  inputView: {
    width: '80%',
    backgroundColor: '#f2f2f2',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    height: 50,
    color: 'black',
  },
  loginBtn: {
    width: '80%',
    backgroundColor: '#fb5b5a',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  loginText: {
    color: 'white',
  },
  signupText: {
    color: '#003f5c',
  },
  signupBtn:{
    marginTop:10
  }
});

export default LoginForm;