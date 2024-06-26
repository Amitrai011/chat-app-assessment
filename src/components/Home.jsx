import { useContext, useEffect, useState } from "react";
import { database } from "../firebase";
import { onDisconnect, onValue, ref, update } from "firebase/database";
import ActiveUsers from "./ActiveUsers";
import Chat from "./Chat";
import { UserContext } from "./UserProvider";
import { Navigate } from "react-router-dom";

function Home() {
  const { currentUser, loading } = useContext(UserContext);
  const [selectedUser, setSelectedUser] = useState();

  useEffect(() => {
    const connectedRef = ref(database, ".info/connected");
    let unsubsConnectRef, chatMsgUnsubs;
    if (currentUser) {
      const usersRef = ref(database, `users/${currentUser.uid}`);
      onDisconnect(usersRef).update({ online: false });

      unsubsConnectRef = onValue(connectedRef, (snap) => {
        if (snap.val() === true) {
          update(usersRef, { online: true });

          const chatRef = ref(database, `chatMessages/${currentUser?.uid}`);
          chatMsgUnsubs = onValue(chatRef, async (snapshot) => {
            const chatMessages = snapshot.val();
            const updates = {};
            if (chatMessages) {
              Object.keys(chatMessages).forEach((key) => {
                if (chatMessages[key].status === "sent") {
                  updates[`chatMessages/${currentUser.uid}/${key}/status`] =
                    "delivered";
                }
              });
              await update(ref(database), updates);
            }
          });
        }
      });
    }

    const unsubsUser = onValue(
      ref(database, `users/${selectedUser?.uid}/online`),
      (snapshot) => {
        if (!snapshot.val()) {
          setSelectedUser(null);
        }
      }
    );

    return () => {
      unsubsConnectRef && unsubsConnectRef();
      chatMsgUnsubs && chatMsgUnsubs();
      unsubsUser();
    };
  }, [currentUser, selectedUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {currentUser ? (
        <>
          <ActiveUsers
            setSelectedUser={setSelectedUser}
            currentUser={currentUser}
          />
          {selectedUser ? (
            <Chat selectedUser={selectedUser} currentUser={currentUser} />
          ) : (
            <div className="chooseChat">
              Choose a chat to start the conversation
            </div>
          )}
        </>
      ) : (
        <Navigate to="/login" />
      )}
    </>
  );
}

export default Home;
