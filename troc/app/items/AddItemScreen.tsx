import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { addNewItem } from '@/services/items/ItemService';

const AddItemScreen = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [newImages, setNewImages] = useState<string | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleCreateItem = async () => {
    try {
      await addNewItem(name, description, category, newImages);
      router.push('/items/ItemsListScreen?success=true'); // Redirige vers la liste d'items avec un message de succès
    } catch (err: Error | any) {
      setError(err.message);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setNewImages(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
        setNewImages(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Créer un item</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Nom de l'item"
          placeholderTextColor="#003f5c"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Description"
          placeholderTextColor="#003f5c"
          value={description}
          onChangeText={setDescription}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Catégorie"
          placeholderTextColor="#003f5c"
          value={category}
          onChangeText={setCategory}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
          <Text style={styles.imageText}>Choisir une image</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.imageBtn} onPress={takePhoto}>
          <Text style={styles.imageText}>Prendre une photo</Text>
        </TouchableOpacity>
      </View>

      {newImages && <Image source={{ uri: newImages }} style={styles.image} />}

      <TouchableOpacity style={styles.createBtn} onPress={handleCreateItem}>
        <Text style={styles.createText}>Créer l'item</Text>
      </TouchableOpacity>
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
    fontSize: 30,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  imageBtn: {
    backgroundColor: '#fb5b5a',
    borderRadius: 25,
    padding: 15,
    marginTop: 20,
  },
  imageText: {
    color: 'white',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 20,
  },
  createBtn: {
    width: '80%',
    backgroundColor: '#fb5b5a',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  createText: {
    color: 'white',
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
  },
});

export default AddItemScreen;
