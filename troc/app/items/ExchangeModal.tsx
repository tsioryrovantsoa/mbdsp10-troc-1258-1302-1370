import React from "react";
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Item } from "../types";

interface ExchangeModalProps {
  visible: boolean;
  item: Item;
  onClose: () => void;
  onExchange: (receiverItemId: string) => void;
}

const ExchangeModal: React.FC<ExchangeModalProps> = ({
  visible,
  item,
  onClose,
  onExchange,
}) => {
  // Exemple d'items pour l'échange (remplacez par un vrai appel API si nécessaire)
  const availableItems: Item[] = [
    {
      itemId: "1",
      title: "Item 1",
      description: "Description 1",
      category: "Category 1",
      status: "Available",
      createdAt: "",
      updatedAt: "",
      images: [],
    },
    {
      itemId: "2",
      title: "Item 2",
      description: "Description 2",
      category: "Category 2",
      status: "Available",
      createdAt: "",
      updatedAt: "",
      images: [],
    },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            Proposer une échange pour {item.title}
          </Text>
          <FlatList
            data={availableItems}
            keyExtractor={(item) => item.itemId}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => onExchange(item.itemId)}
              >
                <Text>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  closeButton: {
    marginTop: 20,
    alignItems: "center",
  },
});

export default ExchangeModal;
