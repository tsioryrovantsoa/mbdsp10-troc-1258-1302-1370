import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { fetchItems } from '../services/itemsService';

const ItemsList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const response = await fetchItems();
        if (response.success) {
          setItems(response.data);
        } else {
          setError(response.error);
        }
      } catch (error) {
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>{item.description}</Text>
      {item.images && item.images.map((img) => (
        <Image
          key={img.image_id}
          source={{ uri: img.imageUrl }}
          style={styles.image}
        />
      ))}
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.center} />;
  }

  if (error) {
    return <Text style={styles.center}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Items List</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.item_id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  item: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    marginTop: 8,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ItemsList;
