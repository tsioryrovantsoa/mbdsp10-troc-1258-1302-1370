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
        let errorMessage = 'Une erreur est survenue lors de l\'inscription. Vérifiez le format de l\'email ou du téléphone.';
        console.log("error registerUser >>>>>>>> ", errorMessage);
        throw new Error(errorMessage); 
  };
}