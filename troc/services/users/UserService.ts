import ApiService, { baseURL } from "../ApiService";

const addUser = baseURL + "api/users/register";

export const registerUser = async (username:string, name:string, password:string, email:string, phone:string, address:string) => {
    var response = null;
    var data = {
        username: username,
        name: name,
        password: password,
        email: email,
        phone: phone,
        address: address,
    }
    try {
        response = await ApiService.post(
            addUser,
            data
        );
        console.log("response registerUser >>>>>>>> ", response);

    } catch (error) {
        console.log("error registerUser >>>>>>>> ", error);
    }

    return response;
  };