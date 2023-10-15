"use client";
import { useState } from "react";
import NewWindow from "react-new-window";
import { signOut, useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
export const useLogin = () => {
  const data = useSession();
  const [popUp, setPopUp] = useState(false);
  const [provider, setProvider] = useState("google");
  const Window = () => {
    if (popUp)
      return (
        <NewWindow url={`/api/auth/signin`} onUnload={() => setPopUp(false)} />
      );
  };
  return {
    Window,
    login: (provider: "google") => {
      setProvider(provider);
      setPopUp(true);
    },
  };
};

// const HomePage = () => {
//   const [popup, setPopUp] = useState(false);
//   const [session, loading] = useSession();

//   return (
//     <div>
//       {loading ? (
//         <p>loading session...</p>
//       ) : session ? (
//         <button onClick={() => signOut()}>Logout</button>
//       ) : (
//         <button onClick={() => setPopUp(true)}>Login</button>
//       )}

//       {popup && !session ? (
//         <NewWindow url="/sign-in" onUnload={() => setPopUp(false)} />
//       ) : null}
//     </div>
//   );
// };
