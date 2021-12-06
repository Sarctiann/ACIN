import { useMemo, createContext } from "react";
import useUser from './useUser'
import useToken from "./useToken";

// 1. Create and export contexts
export const UserContext = createContext(
    { user: "", setUser: () => { } })
export const TokenContext = createContext(
    { token: "", setToken: () => { } })
// -----------------------------

const GlobalContext = ({ children }) => {

    // 2. Packing the value and updater function
    const [user, setUser] = useUser();
    const userValue = useMemo(
        () => ({ user, setUser }),
        [user, setUser]
    );

    const [token, setToken] = useToken()
    const tokenValue = useMemo(
        () => ({ token, setToken }),
        [token, setToken]
    );
    // ----------------------------------------

    return (

        // 3. Provide the contexts
        <UserContext.Provider value={userValue}>
            <TokenContext.Provider value={tokenValue}>
                {children}
            </TokenContext.Provider>
        </UserContext.Provider>
        // -----------------------
    )
}

export default GlobalContext;