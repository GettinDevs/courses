
import React, { useState, useEffect, createContext } from "react";
import { User } from '../definitions/User'

type ContextProps = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
}

export const UserContext = createContext<ContextProps>({} as ContextProps);

function getLocalUser(): User | null {
  const user = localStorage.getItem('user');
  if (!user) return null;

  try {
    const userParsed = JSON.parse(user);
    const userBuilder = {
      userId: parseInt(userParsed.userId),
      username: userParsed.username,
      role: ['USER', 'ADMIN'].includes(userParsed.role) ? userParsed.role : 'USER',
      password: userParsed.password || undefined,
    }
    return userBuilder;
  } catch (error) {
    console.error(error);
    return null
  }
}

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(getLocalUser());

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
