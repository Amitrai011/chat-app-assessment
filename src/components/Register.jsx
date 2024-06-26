import { useContext, useState } from "react";
import loginStyles from "../styles/Login.module.css";
import "../styles/Register.module.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, database, storage } from "../firebase";
import { ref, set } from "firebase/database";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserProvider";
import Loader from "./Loader";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";

const Register = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(UserContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLoader, setShowLoader] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    const profilePicture = e.target[3].files[0];

    if (!name.trim() || !email.trim() || !password.trim() || !profilePicture) {
      toast.error("All fields are required");
      return;
    }

    try {
      setShowLoader(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const profilePicRef = storageRef(storage, `profiles/${user.uid}`);
      await uploadBytes(profilePicRef, profilePicture);
      let profilePictureUrl = await getDownloadURL(profilePicRef);

      await set(ref(database, `users/${user.uid}`), {
        name: name,
        email: user.email,
        online: true,
        profileUrl: profilePictureUrl,
        uid: user.uid,
      });

      setCurrentUser({
        name: name,
        email: user.email,
        online: true,
        profileUrl: profilePictureUrl,
        uid: user.uid,
      });
      setShowLoader(false);
      navigate("/");
    } catch (error) {
      toast("Invalid email or password");
      setShowLoader(false);
      console.error(error);
    }
  };

  return (
    <div className={loginStyles.loginContainer}>
      <h1>Sign Up</h1>
      <form
        onSubmit={handleRegister}
        className={loginStyles.loginForm}
        style={{ display: "flex" }}
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Name"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Password"
        />
        <label htmlFor="file">
          <img
            src="https://cdn-icons-png.flaticon.com/128/4904/4904233.png"
            alt="Profile"
          />
          <p>Add an avatar</p>
        </label>
        <input style={{ display: "none" }} type="file" id="file" />
        <button type="submit">Sign Up</button>
      </form>
      {showLoader && <Loader />}
      <Link to="/login">
        Already have an account{" "}
        <strong style={{ color: "#3942a4" }}>Login?</strong>
      </Link>
    </div>
  );
};

export default Register;
