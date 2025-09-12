import { createContext, useState } from "react";
import { GeneralContextType } from "./types";

export const GeneralContext = createContext<GeneralContextType | null>(null);

interface GeneralProviderProps {
  children: React.ReactNode;
}

export default function GeneralProvider({ children }: GeneralProviderProps) {
  const [openDropdownId, setOpenDropdownId] = useState<number>(0);
  const [fontSize, setFontSize] = useState<number>(1);

  return (
    <GeneralContext.Provider value={{
      openDropdownId, 
      setOpenDropdownId, 
      fontSize, 
      setFontSize
    }}>
      {children}
    </GeneralContext.Provider>
  )
}
