import { createContext, useContext, useState, useEffect, ReactNode, ReactElement, Children } from "react"
import { View, Text } from 'react-native'
import React from 'react'
import { getCurrentUser } from "@/lib/appwrite"

interface GlobalContextProps {
    isLogged: boolean;
    setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
    user: any; // You should replace `any` with your user type
    setUser: React.Dispatch<React.SetStateAction<any>>; // Replace `any` with your user type
    loading: boolean;
  }
const GlobalContext = createContext<GlobalContextProps>({
    isLogged: false,
    setIsLogged: () => {},
    user: null,
    setUser: () => {},
    loading: true,
  });
export const useGlobalContext = () => useContext(GlobalContext)
const GlobalContextProvider = ({children}:any) => {
    const [isLogged, setIsLogged] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCurrentUser()
          .then((res:any) => {
            if (res) {
              setIsLogged(true);
              setUser(res);
            } else {
              setIsLogged(false);
              setUser(null);
            }
          })
          .catch((error) => {
            console.log(error);
          })
          .finally(() => {
            setLoading(false);
          });
    }, []);

    return (
        <GlobalContext.Provider value={{
            isLogged,
            setIsLogged,
            user,
            setUser,
            loading,
        }} >
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalContextProvider
