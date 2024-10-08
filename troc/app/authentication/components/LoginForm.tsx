import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable } from 'react-native';

const LoginForm = ({ onSubmit }: { onSubmit: (username:string, password:string) => void }) => {
  const router = useRouter();

  const redirectToSignup = () =>{ 
    router.push('authentication/SignupScreen'); // Redirection vers la page d'inscription
  }

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    onSubmit(username, password);
  };

  const { success } = useLocalSearchParams<{LoginForm: any, success:string}>(); // Récupère les paramètres de l'URL
  
  return (
    <View style={styles.container}>
       {success && <Text style={styles.successText}>Inscription réussie! Vous pouvez maintenant vous connecter.</Text>}
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
      <Pressable style={styles.signupBtn} onPress={redirectToSignup}>
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
  },
  successText:{
    color:'green',
    marginBottom:20
  }
});

export default LoginForm;

function useParams(): { success: any; } {
  throw new Error('Function not implemented.');
}
