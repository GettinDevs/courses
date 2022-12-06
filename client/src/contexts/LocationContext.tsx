
import React, { useState, useEffect, createContext } from "react";

type ContextProps = {
  locations: string[];
  addLocation: (location: string) => void;
  removeLocationAt: (index: number) => void;
  popLocation: () => void;
}

export const LocationContext = createContext<ContextProps>({} as ContextProps);

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [locations, setLocations] = useState<string[]>([]);

  function addLocation(location: string) {
    setLocations(prevLocations => {
      const locationsSet = new Set(prevLocations);
      locationsSet.add(location);
      return Array.from(locationsSet);
    });
  }

  function removeLocationAt(index: number) {
    setLocations(prev => prev.filter((_, i) => i !== index));
  }

  function popLocation() {
    setLocations(prev => prev.slice(0, -1));
  }

  return (
    <LocationContext.Provider value={{ locations, addLocation, removeLocationAt, popLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
