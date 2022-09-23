import React, { useContext, useEffect, useState } from "react";
import { AUTH_TOKEN } from "../constants";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppletPage from "./applet/AppletPage.react";
import AuthContext from "./auth/AuthContext";
import { TokenContext } from "./ApolloWrapper.react";
import CashFlow from "./cashflow/CashFlow.react";
import ProfilePageReact from "./auth/ProfilePage.react";
import Loading from "./applet/Loading.react";
import { gql, useMutation } from "@apollo/client";

const VERIFY_TOKEN = gql`
  mutation VerifyToken($token: String!) {
    verifyToken(token: $token) {
      payload
    }
  }
`;

const App = () => {
  const { token, setToken } = useContext(TokenContext);
  const verifyToken = useMutation(VERIFY_TOKEN)[0];
  const [loadingToken, setLoadingToken] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  const updateToken = (newToken) => {
    localStorage.setItem(AUTH_TOKEN, newToken);
    setToken(newToken);
  };

  const logout = () => {
    updateToken(null);
  };

  const checkIsAuth = async (newToken) => {
    if (!newToken || newToken === null || newToken === "null") {
      setIsAuth(false);
      return;
    }
    const verifyTokenResponse = await verifyToken({
      variables: { token: newToken },
    });
    setIsAuth(verifyTokenResponse.data.verifyToken.payload ? true : false);
  };

  useEffect(() => {
    const func = async () => {
      const newToken = localStorage.getItem(AUTH_TOKEN);
      if (newToken) {
        setToken(newToken);
        await checkIsAuth(newToken);
      }
      setLoadingToken(false);
    };
    func();
  }, []);

  useEffect(() => {
    checkIsAuth(token);
  }, [token]);

  return loadingToken ? (
    <Loading />
  ) : (
    <AuthContext.Provider value={{ isAuth, logout, updateToken }}>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route
            path="/"
            element={<AppletPage applet={<CashFlow />} title="Cash Flow" />}
          />
          <Route path="profile" element={<ProfilePageReact />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
