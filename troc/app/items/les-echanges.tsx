import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getUserIdFromToken } from "../authentication/services/storageService";
import ExchangeService from "../authentication/services/exchangeService";
import { Exchange } from "../types";

const LesEchangesScreen = () => {
  const { itemId, title } = useLocalSearchParams();
  const [exchangeRequests, setExchangeRequests] = useState<Exchange[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchExchangeRequests = async () => {
    try {
      const response = await ExchangeService.fetchExchangeData(itemId);
      setExchangeRequests(response.data || []);

      const id = await getUserIdFromToken();
      setUserId(id);
    } catch (error) {
      console.error("Error fetching exchange requests:", error);
      setExchangeRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeRequests();
  }, [itemId]);

  // const handleAccept = async (exchange : any) => {
  //   try {
  //     await ExchangeService.acceptExchange(exchange.exchangeId);
  //     await fetchExchangeRequests();
  //   } catch (error) {
  //     console.error('Error accepting exchange:', error);
  //   }
  // };

  // const handleReject = async (exchange : any) => {
  //   try {
  //     await ExchangeService.rejectExchange(exchange.exchangeId);
  //     await fetchExchangeRequests();
  //   } catch (error) {
  //     console.error('Error rejecting exchange:', error);
  //   }
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des échanges pour: {title}</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {exchangeRequests.length === 0 ? (
            <Text style={styles.message}>
              Aucune demande d'échange trouvée.
            </Text>
          ) : (
            exchangeRequests.map((exchange) => (
              <View key={exchange.exchangeId} style={styles.card}>
                <Text style={styles.exchangeId}>
                  Échange ID: {exchange.exchangeId}
                </Text>
                <Text>Demandeur: {exchange.requester.name}</Text>
                <Text>Receveur: {exchange.receiver.name}</Text>
                <Text>Statut: {exchange.status}</Text>
                <Text>
                  Créé le: {new Date(exchange.createdAt).toLocaleString()}
                </Text>
                <Text>
                  Mis à jour le: {new Date(exchange.updatedAt).toLocaleString()}
                </Text>
                {exchange.receiver.user_id === userId &&
                  exchange.status === "EN_ATTENTE" && (
                    <View style={styles.buttonContainer}>
                      {/* <Button title="Accepter" onPress={() => handleAccept(exchange)} color="green" />
                    <Button title="Rejeter" onPress={() => handleReject(exchange)} color="red" /> */}
                    </View>
                  )}
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 3,
  },
  exchangeId: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    color: "gray",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
});

export default LesEchangesScreen;
