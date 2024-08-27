import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Item } from "../types";
import { getMyItems } from "../authentication/services/itemService";

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
  const [myItems, setMyItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // console.log('allo');
    const fetchMyItems = async () => {
      try {
        const response = await getMyItems();
        setMyItems(response.data.content);
      } catch (err) {
        setError("Erreur lors du chargement de vos items.");
      } finally {
        setLoading(false);
      }
    };

    if (visible) {
      fetchMyItems();
    }
  }, [visible]);

  if (!visible) {
    return null;
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            Proposer une échange pour {item.title}
          </Text>
          <FlatList
            data={myItems}
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
