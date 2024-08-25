import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeToken = async (value:string) => {
    try {
      await AsyncStorage.setItem('token', value);
    } catch (e) {
      // saving error
      console.log("error storeToken >>>>>>>> ", e);
    }
};

export const getToken = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        // value previously stored
        return value;
      }
    } catch (e) {
      // error reading value
      console.log("error getToken >>>>>>>> ", e);
    }
  };