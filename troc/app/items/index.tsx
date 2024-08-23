// app/ItemsListScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { Item } from '../types';
import { getToken } from '@/storage';
import { getItemsList } from '@/services/items/ItemService';
import { imageURL } from '@/services/ApiService';

// Simule une fonction pour obtenir les items (remplacez-la par une API réelle)
const fetchItems = async () => {

  // Remplacez par l'appel API réel
  const token = await getToken();


  const response = (token) ? await getItemsList(token) : null;
  // console.log(response);
  const data = await response;
  return data;
};

const ItemsListScreen: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("fgswdgdfhg" , imageURL+items[0].images[0].imageUrl);
    
    const loadItems = async () => {
      try {
        const fetchedItems = await fetchItems();
        console.log("fetchedItems >>>>>>>> ", fetchedItems?.data?.content);
        setItems(fetchedItems?.data?.content);
      } catch (err) {
        setError('Erreur lors du chargement des items.');
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.item_id?.toString()}
        renderItem={({ item }) => (
          <View style={styles.item} key={item.item_id}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.description}</Text>
            <View style={styles.imagesContainer}>
            <FlatList
              data={item.images}
              keyExtractor={(image) => image.image_id?.toString()} 
              horizontal
              renderItem={({ item }) => (
                <View style={styles.image} key={item.image_id}>
                      <Image
                        source={{ uri: imageURL+item.imageUrl }}
                        style={styles.image}
                      />
                </View>
              )}
            />
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  item: {
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  imagesContainer: {
    marginTop: 8,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
});

export default ItemsListScreen;
