import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth, database } from "../firebase";
import { get, ref } from "firebase/database";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubsAuth = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setLoading(false);
        const userRef = ref(database, `users/${authUser.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.val()) {
          setCurrentUser(snapshot.val());
        }
      } else {
        setLoading(false);
        setCurrentUser(null);
      }
    });

    return () => unsubsAuth();
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, loading, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
