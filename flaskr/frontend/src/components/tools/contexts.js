import { useMemo, createContext } from "react";
import useUser from './useUser'

// 1. Create and export contexts
export const UserContext = createContext(
    { user: "", setUser: () => { } })
// -----------------------------

const GlobalContext = ({ children }) => {

    // 2. Packing the value and updater function
    const [user, setUser] = useUser();
    const userValue = useMemo(
        () => ({ user, setUser }),
        [user, setUser]
    );
    // ----------------------------------------

    return (

        // 3. Provide the contexts
        <UserContext.Provider value={userValue}>
            {children}
        </UserContext.Provider>
        // -----------------------
    )
}

export default GlobalContext;