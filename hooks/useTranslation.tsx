import i18n from "@/i18n/i18n";
import { useGeneral } from "./useGeneral";

export function useTranslation() {
  const { language } = useGeneral();
  i18n.locale = language;
  return i18n;
}
