import React, { createContext, useState, useEffect } from 'react';

export function signIn() {}

export function signOut() {}

export const UserContext = createContext({
  displayName: 'Satyam',
});

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(auth.currentUser);

//   useEffect(() => {
//     function userChanged(newUser) {
//       return (newUser && newUser.uid) !== (user && user.uid);
//     }
//     auth.onAuthStateChanged(newUser => {
//       if (userChanged(newUser)) {
//         setUser(newUser);
//       }
//     });
//   }, [user]);
//   return (
//     <UserContext.Provider value={user || ''}>{children}</UserContext.Provider>
//   );
// }
