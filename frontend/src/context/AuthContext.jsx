// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

// Named export – App/main me yahi use ho raha hai
export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Helper: set + localStorage + axios header
  const setUser = (u) => {
    setUserState(u);
    try {
      if (u) localStorage.setItem('user', JSON.stringify(u));
      else localStorage.removeItem('user');
    } catch (e) {}

    if (u && u.token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${u.token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  };

  useEffect(() => {
    if (user && user.token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    }
  }, []); // only once on mount

  const login = async (email, password) => {
    const { data } = await api.post('/users/login', { email, password });
    setUser(data);
    return data;
  };

  const register = async (payload) => {
    const { data } = await api.post('/users/register', payload);
    setUser(data);
    return data;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;


// new code 


// frontend/src/context/AuthContext.jsx
// import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
// import api from '../api/axios';

// export const AuthContext = createContext(null);

// /**
//  * AuthProvider
//  * - Manages user state + persistent localStorage
//  * - Ensures axios Authorization header is always in sync
//  * - Syncs across browser tabs via storage events
//  */
// export const AuthProvider = ({ children }) => {
//   const [user, setUserState] = useState(() => {
//     try {
//       const raw = localStorage.getItem('user');
//       return raw ? JSON.parse(raw) : null;
//     } catch {
//       return null;
//     }
//   });

//   // Centralized setter: update state, localStorage, and axios header
//   const setUser = (u) => {
//     setUserState(u);
//     try {
//       if (u) localStorage.setItem('user', JSON.stringify(u));
//       else localStorage.removeItem('user');
//     } catch {
//       /* ignore localStorage errors */
//     }

//     if (u && u.token) {
//       api.defaults.headers.common['Authorization'] = `Bearer ${u.token}`;
//     } else {
//       delete api.defaults.headers.common['Authorization'];
//     }
//   };

//   // On mount: ensure axios header matches initial user
//   useEffect(() => {
//     if (user && user.token) {
//       api.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
//     } else {
//       delete api.defaults.headers.common['Authorization'];
//     }

//     // Listen for auth changes in other tabs/windows
//     const onStorage = (e) => {
//       if (e.key === 'user') {
//         try {
//           const newVal = e.newValue ? JSON.parse(e.newValue) : null;
//           setUserState(newVal);
//           if (newVal && newVal.token) {
//             api.defaults.headers.common['Authorization'] = `Bearer ${newVal.token}`;
//           } else {
//             delete api.defaults.headers.common['Authorization'];
//           }
//         } catch {
//           // ignore parse errors
//           setUserState(null);
//           delete api.defaults.headers.common['Authorization'];
//         }
//       }
//     };

//     window.addEventListener('storage', onStorage);
//     return () => window.removeEventListener('storage', onStorage);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []); // run once on mount

//   // Auth helpers — bubble errors to caller
//   const login = async (email, password) => {
//     const { data } = await api.post('/users/login', { email, password });
//     setUser(data);
//     return data;
//   };

//   const register = async (payload) => {
//     const { data } = await api.post('/users/register', payload);
//     setUser(data);
//     return data;
//   };

//   const logout = () => setUser(null);

//   // Memoize context value to avoid unnecessary re-renders
//   const contextValue = useMemo(
//     () => ({ user, setUser, login, register, logout }),
//     [user] // only changes when user changes
//   );

//   return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => useContext(AuthContext);

// export default AuthContext;

