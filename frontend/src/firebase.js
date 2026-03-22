import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import axios from "axios";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APPID,
};

const webApp = initializeApp(firebaseConfig);
const clientDb = getFirestore(webApp);
const clientAuth = getAuth(webApp);

setPersistence(clientAuth, browserSessionPersistence);

function login(e, navigate) {
  e.preventDefault();
  const form = e.target;
  const email = form.email.value;
  const password = form.password.value;

  signInWithEmailAndPassword(clientAuth, email, password)
    .then(async (userCredential) => {
      const idToken = await userCredential.user.getIdToken();
      await axios({
        method: "post",
        url: "/api/login",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      });
      navigate('/')
    })
    .catch((error) => {
      if (error.code === "auth/invalid-credential") {
        alert("Email or password is incorrect");
        return;
      }
      alert("Error logging in user");
      return;
    });
}

function signup(e) {
  e.preventDefault();
  const form = e.target;
  const email = form.email.value;
  const password = form.password.value;
  createUserWithEmailAndPassword(clientAuth, email, password)
    .then(async (userCredential) => {
      const idToken = await userCredential.user.getIdToken();
      await axios({
        method: "post",
        url: "/api/signup",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        data: {
          firstName: form.firstName.value,
          lastName: form.lastName.value,
          email: form.email.value,
        },
      });
      window.location.href = '/'
    })
    .catch((error) => {
      if (error.code === "auth/email-already-in-use") {
        alert("Email already in use");
        return;
      }
      console.log("Error signing up user: ", error);
      alert("Error creating user");
      return;
    });
}

function signout() {
  try {
    signOut(clientAuth).then(() => {
      window.location.href = '/'
    });
  } catch (error) {
    alert("Error signing out user");
    return;
  }
}

async function addReportedItem(e) {
  e.preventDefault();
  const form = e.target;
  try {
    await axios({
      method: "post",
      url: "/api/user/add-item",
      headers: {
        Authorization: `Bearer ${await clientAuth.currentUser.getIdToken()}`,
        "Content-Type": "application/json",
      },
      data: {
        name: form.name.value,
        description: form.description.value,
        location: form.location.value,
        category: form.category.value,
        color: form.color.value,
        room_num: form.room_num.value,
      },
    }).then((response) => console.log(response.data));
    window.location.href = '/dashboard'
  } catch (error) {
    alert("Error adding item to user");
    return;
  }
}

export { clientAuth, login, signup, signout, addReportedItem };
