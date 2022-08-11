import axios from "axios";
const id = process.env.NEXT_PUBLIC_API_KEY;
const locationId = process.env.NEXT_PUBLIC_LOCATION_KEY;

async function getCities() {
  try {
    const response = await axios.get(
      "https://countriesnow.space/api/v0.1/countries/population/cities"
    );
    const sortedCities = response.data.data.sort((a, b) => {
      if (a.city < b.city) return -1;
      if (a.city > b.city) return 1;
      return 0;
    });
    return sortedCities.filter((item, index) => index !== 0);
  } catch (error) {
    console.error(error);
  }
}
export const citiesFetcher = () => getCities();

async function cityWeather(cityName) {
  try {
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${id}`
    );
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function cityWeatherForecast(cityName) {
  try {
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${id}`
    );
    return data;
  } catch (error) {
    console.error(error);
  }
}

export const allReport = async (cityName) => {
  try {
    const results = await axios.all([
      cityWeather(cityName),
      cityWeatherForecast(cityName),
    ]);
    const oneDayForecast = results[0];
    const fiveDaysForecast = results[1];
    return { oneDayForecast, fiveDaysForecast };
  } catch (error) {
    console.error(error);
  }
};

export async function getCityWeather(cityName) {
  try {
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${id}`
    );
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function userCity(latitude, longitude) {
  try {
    const { data } = await axios.get(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=5&appid=${locationId}`
    );
    return data;
  } catch (error) {
    console.error(error);
  }
}
