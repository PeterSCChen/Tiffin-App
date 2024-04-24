import {
    GoogleAuthProvider,
    OAuthProvider,
    User,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithCredential,
    signInWithEmailAndPassword,
    signOut,
  } from "@firebase/auth";

  import {
    UserCredential,
    createUserWithEmailAndPassword,
    validatePassword,
  } from "firebase/auth";
  import {
    arrayRemove,
    arrayUnion,
    doc,
    getDoc,
    setDoc,
    updateDoc,
  } from "firebase/firestore";
  import {
    Dispatch,
    ReactNode,
    SetStateAction,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
  } from "react";

  // apple login imports
  import { appleAuth } from '@invertase/react-native-apple-authentication';
  
  // google login imports
  import { GoogleSignin } from '@react-native-google-signin/google-signin';

  // facebook login imports
  import { AccessToken, LoginManager } from 'react-native-fbsdk-next';
  import authRN from '@react-native-firebase/auth';

  import { auth, firestore } from "../firebase_setup/firebase";
  import { ExportMealPlan } from "../types/dbExportMealPlans";

  /* async function loginWithGoogle(): Promise<void> {
    try {
        const { idToken } = await GoogleSignin.signIn();
        const googleCredential = authRN.GoogleAuthProvider.credential(idToken);
        await authRN().signInWithCredential(googleCredential);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

   const loginWithFacebook = async () => {
    try {
      // Attempt login with permissions
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      if (result.isCancelled) {
        throw new Error('User cancelled the login process');
      }
  
      // Once signed in, get the users AccesToken
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        throw new Error('Something went wrong obtaining access token');
      }
  
      // Create a Firebase credential with the AccessToken
      const facebookCredential = authRN.FacebookAuthProvider.credential(data.accessToken);
  
      // Use the credential to sign-in with Firebase
      await authRN().signInWithCredential(facebookCredential);
      console.log('Logged in with Facebook!');
    } catch (error) {
      console.error(error);
    }
  }; 
  
   async function loginWithApple(): Promise<void> {
    try {
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
        });

        const credential = authRN.AppleAuthProvider.credential(appleAuthRequestResponse.identityToken);
        await authRN().signInWithCredential(credential);
    } catch (error) {
        console.error(error);
        throw error;
    }
}  */

  interface AuthContextType {
    user: User | null;
    register: (email: string, password: string) => Promise<UserCredential>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    /* loginWithGoogle: () => Promise<void>;
    loginWithApple: () => Promise<void>;
    loginWithFacebook: () => Promise<void>; */
    resetPassword: (email: string) => Promise<void>;
    order: ExportMealPlan | null;
    setOrder: Dispatch<SetStateAction<ExportMealPlan | null>>; 
  }
  
  const AuthContext = createContext<AuthContextType>({
    user: null,
    register: function (
      email: string,
      password: string
    ): Promise<UserCredential> {
      throw new Error("Function not implemented.");
    },
    login: function (email: string, password: string): Promise<void> {
      throw new Error("Function not implemented.");
    },
    logout: function (): Promise<void> {
      throw new Error("Function not implemented.");
    },
    /* loginWithGoogle: function (): Promise<void> {
      throw new Error("Function not implemented.");
    },
    loginWithApple: function (): Promise<void> {
      throw new Error("Function not implemented.");
    },
    loginWithFacebook: function (): Promise<void> {
      throw new Error("Function not implemented.");
    },  */
    resetPassword: function (email: string): Promise<void> {
      throw new Error("Function not implemented.");
    },
    order: null,
    setOrder: () => {},
  });
  
  export const useAuth = (): AuthContextType => useContext(AuthContext);
  
  export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState<ExportMealPlan | null>(null);
  
    const initializeGSI = useCallback(() => {
      // the authentication handler function
      const authHandler = async (response: any) => {
        const idToken = response.credential;
        const credential = GoogleAuthProvider.credential(idToken);
        try {
          await signInWithCredential(auth, credential);
        } catch (error) {
          console.log("Error signing in with Google one-tap: ", error);
        }
      };
      // @ts-ignore:next-line
      window?.google?.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
        callback: authHandler,
      });
      // @ts-ignore:next-line
      window?.google?.accounts.id.prompt((notification: any) => {
        console.log("notification:", notification);
      });
    }, []);
  
    useEffect(() => {
      if (loading || user) return;
      // using a timer to avoid the window?.google being undefined
      const timer = setTimeout(() => {
        initializeGSI();
      }, 1000);
      return () => clearTimeout(timer);
    }, [user, loading, initializeGSI]);
  
    useEffect(() => {
      // Subscribe to the authentication state changes
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          // User is signed in
          setUser(user);
          const userDocRef = doc(firestore, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (!userDocSnap.exists()) {
            await setDoc(userDocRef, {});
          }
        } else {
          // User is signed out
          setUser(null);
        }
        // Set loading to false once authentication state is determined
        setLoading(false);
      });
  
      // Unsubscribe from the authentication state changes when the component is unmounted
      return () => unsubscribe();
    }, []);
  
    const register = async (
      email: string,
      password: string
    ): Promise<UserCredential> => {
      try {
        const validPassword = await validatePassword(auth, password);
        if (!validPassword) {
          throw new Error("Invalid password");
        }
  
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
  
        /* sendEmailVerification(userCredential.user)
          .then(() => {
            console.log("Verification email sent.");
          })
          .catch((error) => {
            console.log("Error sending email verification:", error);
          }); */
  
        // Sign out the user immediately after registration
        //await signOut(auth);
  
        return userCredential;
      } catch (error) {
        throw error;
      }
    };
  
    const login = async (email: string, password: string) => {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
  
        // Check if email is verified
        /* if (!userCredential.user.emailVerified) {
          await signOut(auth);
          throw new Error("Please verify your email address to log in.");
        } */
      } catch (error) {
        throw error;
      }
    };
  
    const logout = async () => {
      await signOut(auth);
    };
  
  
    const resetPassword = async (email: string) => {
      try {
        await sendPasswordResetEmail(auth, email);
      } catch (error) {
        console.log(error);
        throw error;
      }
    };
  
    const value: AuthContextType = {
      user,
      register,
      login,
      logout,
     /*  loginWithApple,
      loginWithGoogle,
      loginWithFacebook,  */
      resetPassword,
      order,
      setOrder,
    };
  
    return (
      <AuthContext.Provider value={value}>
        {!loading && children}
      </AuthContext.Provider>
    );
  }