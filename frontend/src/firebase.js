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

  //

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

async function getAdminUsers() {
  const token = await clientAuth.currentUser.getIdToken();

  const response = await axios.get("/api/admin/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

async function updateItemStatus(itemId, status) {
  const token = await clientAuth.currentUser.getIdToken();

  const response = await axios.patch(
      `/api/admin/items/${itemId}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
  );

  return response.data;
}

async function deleteItemAdmin(itemId) {
  const token = await clientAuth.currentUser.getIdToken();

  const response = await axios.delete(`/api/admin/items/${itemId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

async function updateOwnItemStatus(itemId, status) {
  const token = await clientAuth.currentUser.getIdToken();
  const response = await axios.patch(
    `/api/user/items/${itemId}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
}

async function deleteOwnItem(itemId) {
  const token = await clientAuth.currentUser.getIdToken();
  const response = await axios.delete(`/api/user/items/${itemId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

async function getIsAdmin() {
  const tokenResult = await clientAuth.currentUser.getIdTokenResult();
  return tokenResult.claims.admin === true;
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

export {
  clientAuth,
  login,
  signup,
  signout,
  addReportedItem,
  getAdminUsers,
  updateItemStatus,
  deleteItemAdmin,
  updateOwnItemStatus,
  deleteOwnItem,
  getIsAdmin,
};
