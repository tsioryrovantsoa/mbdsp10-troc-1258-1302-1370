import logo from './logo.svg';
import './App.css';

import routes from "./routes";
import { Routes, Route, Navigate, useLocation, BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import SignIn from './Component/SignIn';
import { isTokenValid } from './Service/utils';

const getRoutes = (allRoutes) =>
  allRoutes.map((route) => {
    
    return <Route path={route.route} element={route.component} key={route.key} />;
});

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
