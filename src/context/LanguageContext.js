import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import translations
  from "../translations/translations";

import {
  getSettings,
  updateSettings
} from "../services/api";

import { useAuth } from "./AuthContext";


const LanguageContext =
  createContext();


export const LanguageProvider = ({
  children
}) => {

  const { token } = useAuth();


  // =====================================
  // INITIAL LANGUAGE
  // =====================================

  const [language, setLanguage] =
    useState(() => {

      return (
        localStorage.getItem(
          "edulearn-language"
        ) ||
        "English"
      );

    });


  // =====================================
  // LOAD SAVED LANGUAGE
  // =====================================

  useEffect(() => {

    const loadLanguage = async () => {

      if (!token) {
        return;
      }


      try {

        const data =
          await getSettings(token);


        if (
          data.settings?.language
        ) {

          setLanguage(
            data.settings.language
          );

          localStorage.setItem(
            "edulearn-language",
            data.settings.language
          );

        }

      } catch (error) {

        console.error(
          "Failed to load language:",
          error
        );

      }

    };


    loadLanguage();

  }, [token]);


  // =====================================
  // CHANGE LANGUAGE
  // =====================================

  const changeLanguage =
    async (newLanguage) => {

      if (
        !translations[newLanguage]
      ) {

        return;

      }


      // Update immediately
      setLanguage(newLanguage);


      // Save locally
      localStorage.setItem(
        "edulearn-language",
        newLanguage
      );


      // Save to MongoDB
      if (token) {

        try {

          await updateSettings(
            token,
            {
              language:
                newLanguage
            }
          );

        } catch (error) {

          console.error(
            "Failed to save language:",
            error
          );

        }

      }

    };


  // =====================================
  // TRANSLATION FUNCTION
  // =====================================

  const t = (key) => {

    return (
      translations[language]?.[key] ||
      translations.English[key] ||
      key
    );

  };


  return (

    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        t
      }}
    >

      {children}

    </LanguageContext.Provider>

  );

};


export const useLanguage = () => {

  return useContext(
    LanguageContext
  );

};