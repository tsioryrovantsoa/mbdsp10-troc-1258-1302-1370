import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { addNewItem } from '@/services/items/ItemService';
import { getToken } from '@/storage';

const AddItemScreen = () => {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [newImages, setNewImages] = useState<ImagePicker.ImageInfo>();
  const [error, setError] = useState('');
  const router = useRouter();

  const handleCreateItem = async () => {
    const formData = new FormData();

    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);

    if (newImages) {
      const filename = newImages.fileName || 'image.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append('newImages', {
        uri: newImages.uri,
        type: type,
        name: filename
      } as any);
    }

    try {
      const token = await getToken();

      if (token) {
        const response = await addNewItem(formData, token);
        router.push('/items/ItemsListScreen?success=true'); // Redirige vers la liste d'items avec un message de succès
        console.log('Item added successfully:', formData);
      } else {
        setError('No token available');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };  
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log("pick photo => ", result);

    if (!result.canceled) {
      setNewImages(result.assets[0]);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log("take photo => ", result);
    if (!result.canceled) {
        setNewImages(result.assets[0]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Nouveau post</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Nom de l'objet"
          placeholderTextColor="#003f5c"
          value={title}
          onChangeText={setTitle}
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

      {newImages && <Image source={{ uri: newImages.uri }} style={styles.image} />}

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
