import { createContext, useState } from "react";
import "../styles/globals.css";

export const SelectCity = createContext({});
export const CityWeather = createContext({});
// export const UserLocation = createContext({});

function MyApp({ Component, pageProps }) {
  const [selectedCity, setSelectedCity] = useState("");
  const [cityWeather, setCityWeather] = useState();
  // const [personLocation, setPersonLocation] = useState("");

  return (
    <SelectCity.Provider value={{ selectedCity, setSelectedCity }}>
      <CityWeather.Provider value={{ cityWeather, setCityWeather }}>
        {/* <UserLocation.Provider value={{ personLocation, setPersonLocation }}> */}
        <Component {...pageProps} />
        {/* </UserLocation.Provider> */}
      </CityWeather.Provider>
    </SelectCity.Provider>
  );
}

export default MyApp;
