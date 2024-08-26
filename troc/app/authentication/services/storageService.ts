import AsyncStorage from "@react-native-async-storage/async-storage";
import "core-js/stable/atob";
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
  id: string;
  exp?: number;
}

export const getUserIdFromToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) return null;

    const decodedToken = jwtDecode<DecodedToken>(token);
    return decodedToken.id;
  } catch (error) {
    console.error("Erreur lors du décodage du token:", error);
    return null;
  }
};
