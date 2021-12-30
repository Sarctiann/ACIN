import { useMemo, createContext, useState } from "react";
import useUser from './useUser'

// 1. Create and export contexts
export const UserContext = createContext(
    { user: '', setUser: () => { } })
export const AuthContext = createContext(
    { auth: '', setAuth: () => { } })
export const PostContext = createContext(
    { fetchedPosts: '', setFetchedPosts: () => { } })
// -----------------------------

const GlobalContext = ({ children }) => {

    // 2. Packing the value and updater function
    const [user, setUser] = useUser();
    const userValue = useMemo(
        () => ({ user, setUser }),
        [user, setUser]
    );
    const [auth, setAuth] = useState(false);
    const authValue = useMemo(
        () => ({ auth, setAuth }),
        [auth, setAuth]
    );
    const [fetchedPosts, setFetchedPosts] = useState([])
    const postsValue = useMemo(
        () => ({ fetchedPosts, setFetchedPosts }),
        [fetchedPosts, setFetchedPosts]
    )
    // ----------------------------------------

    return (

        // 3. Provide the contexts
        <UserContext.Provider value={userValue}>
            <AuthContext.Provider value={authValue}>
                <PostContext.Provider value={postsValue}>
                    {children}
                </PostContext.Provider>
            </AuthContext.Provider>
        </UserContext.Provider>
        // -----------------------
    )
}

export default GlobalContext;