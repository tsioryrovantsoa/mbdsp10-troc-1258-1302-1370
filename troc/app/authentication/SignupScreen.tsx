import { registerUser } from '@/services/users/UserService';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable } from 'react-native';

const SignupScreen = ({ onSubmit }: { onSubmit: (username:string, name:string, password:string, email:string, phone:string, address:string) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleSignup = () => {
    console.log("handleSignup");
    registerUser(username, name, password, email, phone, address);
  };

  const router = useRouter();

  const redirectToLogin = () =>{ 
    router.push('/authentication/components/LoginForm'); // Redirection vers la page d'inscription
  }

  
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Sign up</Text>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="name"
          placeholderTextColor="#003f5c"
          value={name}
          onChangeText={setName}
        />
      </View>

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

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Confirm password"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          placeholderTextColor="#003f5c"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Phone number"
          placeholderTextColor="#003f5c"
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Address"
          placeholderTextColor="#003f5c"
          value={address}
          onChangeText={setAddress}
        />
      </View>

      <Pressable style={styles.loginBtn} onPress={handleSignup} >
        <Text style={styles.loginText}>Sign up</Text>
      </Pressable>
      <Pressable style={styles.signupBtn} onPress={redirectToLogin}>
        <Text style={styles.signupText}>Login</Text>
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

export default SignupScreen;