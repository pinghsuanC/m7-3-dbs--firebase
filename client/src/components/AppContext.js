import React, { createContext, useEffect, useState } from "react";
import withFirebaseAuth from "react-with-firebase-auth";
import * as firebase from "firebase";
import "firebase/auth";

// Your web app's Firebase configuration
var firebaseConfig = {
	apiKey: "AIzaSyBiOSKs3-5yRTJmbOxVgF8uq3MRX7EIyuk",
	authDomain: "user-app-6f2da.firebaseapp.com",
	databaseURL: "https://user-app-6f2da.firebaseio.com",
	projectId: "user-app-6f2da",
	storageBucket: "user-app-6f2da.appspot.com",
	messagingSenderId: "678375461642",
	appId: "1:678375461642:web:692fdf9edbc4016184e0f3",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();

export const AppContext = createContext(null);

const AppProvider = ({ children, signInWithGoogle, signOut, user }) => {
	const [appUser, setAppUser] = useState({});
	const [message, setMessage] = useState("");

	const handleSignOut = () => {
		signOut();
		setAppUser({});
		setMessage("");
	};

	useEffect(() => {
		if (user) {
			fetch(`/users`, {
				method: "post",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					displayName: user.displayName,
					email: user.email,
					photoURL: user.photoURL,
				}),
			})
				.then((res) => res.json())
				.then((json) => {
					setAppUser(json.data);
					setMessage(json.message);
				});
		}
	}, [user]);

	//const message = "message";
	return (
		<AppContext.Provider
			value={{ appUser, signInWithGoogle, handleSignOut, message }}
		>
			{children}
		</AppContext.Provider>
	);
};

const providers = {
	googleProvider: new firebase.auth.GoogleAuthProvider(),
};

export default withFirebaseAuth({
	providers,
	firebaseAppAuth,
})(AppProvider);

//export default AppProvider;
