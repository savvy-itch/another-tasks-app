import { GeneralContext } from "@/generalContext";
import { useContext } from "react";

export function useGeneral() {
  const context = useContext(GeneralContext);
  if (!context) {
    throw new Error("useGeneral must be within GeneralProvider");
  }
  return context;
}
