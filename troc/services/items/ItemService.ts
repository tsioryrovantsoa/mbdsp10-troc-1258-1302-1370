import { Image } from "@/app/types";
import ApiService, { baseURL } from "../ApiService";

const postItem = baseURL + "api/items";

const putItem = (id: number): string => {
    return baseURL + `api/items/${id}`;
}

const deleteItem = (id: number): string => {
    return baseURL + `api/items/${id}`;
}

const getItem = (page: number, size:number): string => {
    return baseURL + `api/items/search?page=${page}&size=${size}`;
}

const getSearchItem = (page: number, size:number, keyword:string, category:string, status:string): string => {
    return baseURL + `api/items/search?page=${page}&size=${size}&keyword=${keyword}&category=${category}&status=${status}`;
}

const getOneItem = (id: number): string => {
    return baseURL + `api/items/${id}`;
}

export const getItemsList = async (token:string) => {
    var response = null;
    try {
        response = await ApiService.get(
            getItem(0, 10),
            token
        );
        console.log("response getItemsList >>>>>>>> ", response);

    } catch (error) {
        console.log("error getItemsList >>>>>>>> ", error);
    }

    return response;
  };

export const addNewItem = async (title:string, description:string|null, category:string, newImages:Image[]) => {
    var response = null;
    var data = {
        title:title,
        description:description,
        category:category,
        newImages:newImages
    }
    try {
        response = await ApiService.post(
            postItem,
            data
        );
        console.log("response addItem >>>>>>>> ", response);

    } catch (error) {
        let errorMessage = 'Une erreur est survenue lors de la création de votre objet.';
        console.log("error addItem >>>>>>>> ", errorMessage);
        throw new Error(errorMessage); 
  };
}