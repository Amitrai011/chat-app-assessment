import { onValue, ref, update } from "firebase/database";
import { useEffect, useState } from "react";
import { auth, database } from "../firebase";
import styles from "../styles/ActiveUsers.module.css";
import { signOut } from "firebase/auth";

const ActiveUsers = ({ setSelectedUser, currentUser }) => {
  const [activeusers, setActiveUsers] = useState([]);

  useEffect(() => {
    const usersRef = ref(database, "users");
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const value = snapshot.val();
      const users = Object.keys(value || {})
        .map((key) => ({ ...value[key] }))
        .filter((user) => currentUser.uid !== user.uid && user.online);
      setActiveUsers(users);
    });

    return () => {
      unsubscribe();
    };
  }, [currentUser?.uid]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    updateMessageStatus("seen", user);
  };

  const updateMessageStatus = async (status, selectedUser) => {
    const selectedUserChatRef = ref(
      database,
      `chatMessages/${selectedUser?.uid}`
    );

    onValue(selectedUserChatRef, async (snapshot) => {
      const chatMessages = snapshot.val();
      const updates = {};
      if (chatMessages) {
        Object.keys(chatMessages).forEach((key) => {
          updates[`chatMessages/${selectedUser.uid}/${key}/status`] = status;
        });
        await update(ref(database), updates);
      }
    });
  };

  const handleLogout = async () => {
    try {
      const userRef = ref(database, `users/${currentUser.uid}`);
      await update(userRef, { online: false });
      await signOut(auth);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.activeUsers}>
      <div className={styles.currentUser}>
        <h3>Chat App</h3>
        <div>
          <img
            src={currentUser.profileUrl || "/assets/avatar.png"}
            alt={currentUser?.name}
            width={40}
            height={40}
          />
          <h4>{currentUser?.name}</h4>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      </div>
      <div className={styles.line}></div>
      <div className={styles.users}>
        {activeusers.map((user) => (
          <div key={user.uid} onClick={() => handleSelectUser(user)}>
            <div className={styles.content}>
              <img
                src={user.profileUrl}
                alt={user.name}
                width={50}
                height={50}
              />
              <span className={styles.details}>
                <span>{user.name}</span>
                <span style={{ color: "#00a884", fontSize: "14px" }}>
                  Online
                </span>
              </span>
            </div>
            <div className={styles.line} style={{ marginTop: "1rem" }}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveUsers;
