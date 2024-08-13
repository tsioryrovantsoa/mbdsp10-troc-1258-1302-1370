import logo from './logo.svg';
import './App.css';

import routes from "./routes";
import { Routes, Route, Navigate, useLocation, BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import SignIn from './Component/SignIn';

const getRoutes = (allRoutes) =>
  allRoutes.map((route) => {
    
    return <Route path={route.route} element={route.component} key={route.key} />;
});

const isTokenValid = () => {
  const token = localStorage.getItem('token');
  
  if (!token) return false;

  try {
    const { exp } = JSON.parse(atob(token.split('.')[1])); // On suppose que le token est un JWT
    if (exp && Date.now() >= exp * 1000) {
      return false; // Le token est expiré
    }
    return true;
  } catch (error) {
    return false; // Si une erreur se produit en analysant le token, considérez-le comme invalide
  }
};

const theme = createTheme();

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          {getRoutes(routes)}
          <Route
            path="/"
            element={isTokenValid() ? <Navigate to="/accueil" /> : <SignIn />}
          />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
