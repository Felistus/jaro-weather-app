import { createContext, useState } from "react";
import "../styles/globals.css";

export const SelectCity = createContext({});
export const CityWeather = createContext({});

function MyApp({ Component, pageProps }) {
  const [selectedCity, setSelectedCity] = useState("abuja");
  const [cityWeather, setCityWeather] = useState();

  return (
    <SelectCity.Provider value={{ selectedCity, setSelectedCity }}>
      <CityWeather.Provider value={{ cityWeather, setCityWeather }}>
        <Component {...pageProps} />
      </CityWeather.Provider>
    </SelectCity.Provider>
  );
}

export default MyApp;
