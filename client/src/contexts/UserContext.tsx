
import React, { useState, useEffect, createContext } from "react";
import { User } from '../definitions/User'

type ContextProps = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
}

export const UserContext = createContext<ContextProps>({} as ContextProps);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) return;

    try {
      const userParsed = JSON.parse(user);
      const userBuilder = {
        userId: parseInt(userParsed.userId),
        username: userParsed.username,
        role: ['USER', 'ADMIN'].includes(userParsed.role) ? userParsed.role : 'USER'
      }
      setUser(userBuilder);
    } catch (error) {
      console.error(error);
      setUser(null)
    }
  }, []);

  function logout() {
    setUser(null);
    localStorage.removeItem('user');
  }

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
