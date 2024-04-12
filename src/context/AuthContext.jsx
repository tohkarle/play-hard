import { createContext, useContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth, txtDB } from "../firebase";
import { collection, doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";

const UserContext = createContext()

export const AuthContextProvider = ({ children }) => {

    const [user, setUser] = useState(null);

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
            console.error("Error creating user:", error);
            throw error;
        }
    };

    const signin = async (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    }

    const logout = () => {
        return signOut(auth);
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
        <UserContext.Provider value={{ createUser, signin, logout, user }}>
            {children}
        </UserContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(UserContext)
}