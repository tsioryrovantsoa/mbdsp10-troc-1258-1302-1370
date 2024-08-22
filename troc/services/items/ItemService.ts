import ApiService from "../ApiService";

const postItem = "http://10.0.1.83:8080/api/items";

const putItem = (id: number): string => {
    return `http://10.0.1.83:8080/api/items/${id}`;
}

const deleteItem = (id: number): string => {
    return `http://10.0.1.83:8080/api/items/${id}`;
}

const getItem = (page: number, size:number): string => {
    return `http://10.0.1.83:8080/api/items/search?page=${page}&size=${size}`;
}

const getSearchItem = (page: number, size:number, keyword:string, category:string, status:string): string => {
    return `http://10.0.1.83:8080/api/items/search?page=${page}&size=${size}&keyword=${keyword}&category=${category}&status=${status}`;
}

const getOneItem = (id: number): string => {
    return `http://10.0.1.83:8080/api/items/${id}`;
}

export const getItemsList = async (token:string) => {
    
    const response = await ApiService.get(
      getItem(0, 10),
      token
    );
    console.log(response);
    return response;
  };