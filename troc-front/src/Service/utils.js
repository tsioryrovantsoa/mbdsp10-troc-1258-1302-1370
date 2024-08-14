export const isTokenValid = () => {
    const token = localStorage.getItem('token');
    
    if (!token) return false;
  
    try {
      const { exp } = JSON.parse(atob(token.split('.')[1]));
      if (exp && Date.now() >= exp * 1000) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
};