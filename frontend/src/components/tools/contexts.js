import { useMemo, useState, createContext } from "react";
import useToken from "./useToken";

// 1. Context Creation
const UserContext = createContext({ userName:"", setUserName: () => {} })
const TokenContext = createContext({ token:"", setToken: () => {} })
// -------------------

const GlobalContext = ({ children }) => {
    
    // 2. Packing the value and updater function
    const [userName, setUserName] = useState('Sebastián Atlántico');
    const userValue = useMemo(
      () => ({ userName, setUserName }), 
      [userName]
    );

    const [token, setToken] = useToken()
    const tokenValue = useMemo(
      () => ({ token, setToken }), 
      [token]
    );
    // ----------------------------------------

    return (

        // 3. Provide the contexts
        <UserContext.Provider value={userValue}>
        <TokenContext.Provider value={tokenValue}>
            { children }
        </TokenContext.Provider>
        </UserContext.Provider>
        // -----------------------
    )
}

export default GlobalContext;