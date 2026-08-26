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
  // INITIAL DARK MODE
  // =====================================

  const [darkMode, setDarkMode] =
    useState(() => {

      return (
        localStorage.getItem(
          "edulearn-dark-mode"
        ) === "true"
      );

    });


  // =====================================
  // APPLY DARK MODE GLOBALLY
  // =====================================

  useEffect(() => {

    if (darkMode) {

      document.body.classList.add(
        "dark-mode"
      );

    } else {

      document.body.classList.remove(
        "dark-mode"
      );

    }

  }, [darkMode]);


  // =====================================
  // LOAD SAVED SETTINGS
  // =====================================

  useEffect(() => {

    const loadSettings = async () => {

      if (!token) {
        return;
      }


      try {

        const data =
          await getSettings(token);


        if (
          data.settings?.language
        ) {

          const savedLanguage =
            data.settings.language;

          setLanguage(
            savedLanguage
          );

          localStorage.setItem(
            "edulearn-language",
            savedLanguage
          );

        }


        if (
          data.settings?.darkMode !==
          undefined
        ) {

          const savedDarkMode =
            Boolean(
              data.settings.darkMode
            );

          setDarkMode(
            savedDarkMode
          );

          localStorage.setItem(
            "edulearn-dark-mode",
            savedDarkMode.toString()
          );

        }

      } catch (error) {

        console.error(
          "Failed to load settings:",
          error
        );

      }

    };


    loadSettings();

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
      setLanguage(
        newLanguage
      );


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
  // CHANGE DARK MODE
  // =====================================

  const changeDarkMode =
    async (enabled) => {

      const newValue =
        Boolean(enabled);


      // Update immediately
      setDarkMode(
        newValue
      );


      // Save locally
      localStorage.setItem(
        "edulearn-dark-mode",
        newValue.toString()
      );


      // Save to MongoDB
      if (token) {

        try {

          await updateSettings(
            token,
            {
              darkMode:
                newValue
            }
          );

        } catch (error) {

          console.error(
            "Failed to save dark mode:",
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


  // =====================================
  // PROVIDER
  // =====================================

  return (

    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        darkMode,
        changeDarkMode,
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