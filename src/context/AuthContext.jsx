import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, txtDB } from "../firebase";
import { collection, doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";

/**
 * Context for managing user authentication and related operations.
 *
 * @type {React.Context<{ createUser: (email: string, password: string, username: string) => Promise<void>; signin: (email: string, password: string) => Promise<void>; logout: () => Promise<void>; user: any; }>}
 */
const UserContext = createContext()

/**
 * Provider component for the authentication context.
 *
 * @param {{ children: any; }} param0 - Children components wrapped by the provider.
 * @param {*} param0.children - Child components.
 * @returns {JSX.Element} - JSX element representing the authentication provider.
 */
export const AuthContextProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  /**
* Function to create a new user account.
*
* @param {string} email - User's email address.
* @param {string} password - User's chosen password.
* @param {string} username - User's chosen username.
* @returns {Promise<void>} - Promise that resolves once the user is created.
*/

  const createUser = async (email, password, username) => {
    try {
      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      // Save the user data to the "Users" collection in Firestore
      const usersCollectionRef = collection(txtDB, "Users");
      const userData = {
        uid: newUser.uid,
        email: email,
        username: username,
        profileImageUrl: "",
        mobileNumber: "",
        telegramUsername: "",
        bio: "",
        createdActivities: [],
        joinedActivities: []
      };
      await setDoc(doc(usersCollectionRef, newUser.uid), userData);

      console.log("User created and saved to Firestore successfully!");
    } catch (error) {
      console.error("Error creating user: ", error);
      throw error;
    }
  };

  const signin = async (email, password) => {
    // Handling the error in LoginNew
    return signInWithEmailAndPassword(auth, email, password);
  }

  const logout = () => {
    try {
      signOut(auth);
    } catch (error) {
      console.error("Error singing out user: ", error);
      throw error;
    }
  }

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const usersCollectionRef = collection(txtDB, "Users");
          const userDocRef = doc(usersCollectionRef, currentUser.uid);
          const unsubscribeFromUserDoc = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
              const userData = doc.data();
              setUser(userData);
            } else {
              console.log("User document not found in Firestore");
              setUser(null);
            }
          });

          return () => {
            unsubscribeFromUserDoc();
          };
        } catch (error) {
          console.error("Error fetching user data from Firestore:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ createUser, signin, logout, resetPassword, user }}>
      {children}
    </UserContext.Provider>
  )
}

/**
 * ${1:Description placeholder}
 *
 * @returns {*}
 */
export const UserAuth = () => {
  return useContext(UserContext)
}