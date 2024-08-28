// app/ItemsListScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { Item } from "../types";
import { getToken } from "@/storage";
import { getItemsList } from "@/services/items/ItemService";
import { imageURL } from "@/services/ApiService";
import Card from "@/components/Card";
import ExchangeModal from "./ExchangeModal";

const fetchItems = async () => {
  const token = await getToken();
  const response = (token) ? await getItemsList(token) : null;
  // console.log("TOKEN >>>>>>>>> ",token);
  // console.log(response);
  const data = await response;
  return data;
};

const ItemsListScreen: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  useEffect(() => {
    if (items.length > 0 && items[0].images.length > 0) {
      // console.log("Image URL:", imageURL + items[0].images[0].imageUrl);
    }

    const loadItems = async () => {
      try {
        const fetchedItems = await fetchItems();
        // console.log("fetchedItems >>>>>>>> ", fetchedItems?.data?.content);
        setItems(fetchedItems?.data?.content);
      } catch (err) {
        setError("Erreur lors du chargement des items.");
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  const handleProposeExchange = (item: Item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

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
       keyExtractor={(item) => item.itemId}
       showsVerticalScrollIndicator={false}
       renderItem={({ item }) => {
        // console.log("item data >>>>>>>>> ", item);
        if (item.images && item.images.length > 0) {
          // console.log("imageURL + item.images[0].imageUrl >>>>>>>>> ", imageURL + item.images[0].imageUrl);
          return (
            <View>
              <Card
                heading={item.title}
                images={item.images.map(image => image.imageUrl)}
                subheading={item.description}
                onPress={() =>
                  alert(`You pressed on ${item.title}`)
                }
              />
            </View>
          );
        } else {
          return (
            <View>
              <Text>No image available</Text>
            </View>
          );
        }
      }}
      
      >
      
      </FlatList>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  item: {
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
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
