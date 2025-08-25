import { createContext, useState } from "react";
import { GeneralContextType } from "./types";

export const GeneralContext = createContext<GeneralContextType | null>(null);

interface GeneralProviderProps {
  children: React.ReactNode;
}

export default function GeneralProvider({ children }: GeneralProviderProps) {
  const [openDropdownId, setOpenDropdownId] = useState<number>(0);

  return (
    <GeneralContext.Provider value={{openDropdownId, setOpenDropdownId}}>
      {children}
    </GeneralContext.Provider>
  )
}
