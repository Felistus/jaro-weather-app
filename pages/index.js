import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import RangeBar from "../components/Range";
import SearchDrawer from "../components/SearchDrawer";
import { useContext, useEffect, useState } from "react";
import { SelectCity, CityWeather } from "./_app";
import { allReport, userCity } from "../utilities/fetchServices";
import {
  filterWeatherForecastForFiveDays,
  getNumberOfDays,
  todayDate,
} from "../utilities/service";
import Acknowledement from "../components/Acknowledgement";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const imageLoader = ({ src, width, quality }) => {
  return `https://openweathermap.org/img/wn/${src}@4x.png?w=${width}&q=${
    quality || 75
  }`;
};

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [openAck, setOpenAck] = useState(false);
  const { selectedCity, setSelectedCity } = useContext(SelectCity);
  const [daysReport, setDaysReport] = useState([]);
  const { cityWeather, setCityWeather } = useContext(CityWeather);
  const [celTemp, setCelTemp] = useState(true);
  const [fahTemp, setFahTemp] = useState(false);
  const openModal = () => setIsOpen((prevState) => !prevState);
  const openAckPop = () => setOpenAck((prevState) => !prevState);

  const items = daysReport.map((item) => (
    <div
      key={item.dt}
      className="bg-[#1E213A] flex flex-col items-center md:w-[120px] md:max-w-[120px] h-[177px] text-base text-[#E7E7EB] font-medium py-[18px] "
    >
      <p>{getNumberOfDays(item.dt_txt)}</p>
      <div className="my-3 ">
        <Image
          loader={imageLoader}
          src={item.weather[0].icon}
          alt="weather icon"
          width={"80"}
          height={"70"}
        />
      </div>
      {celTemp ? (
        <div className="text-xs flex space-x-2 items-center justify-center">
          <p title="min temp">
            <span className="font-medium">
              {(item.main.temp_min / 10).toFixed(1)}
            </span>
            <span>
              <sup>o</sup>
            </span>
            <span>C</span>
          </p>
          <p title="max temp">
            <span className="font-medium">
              {(item.main.temp_max / 10).toFixed(1)}
            </span>
            <span>
              <sup>o</sup>
            </span>
            <span>C</span>
          </p>
        </div>
      ) : (
        <div className="text-xs flex space-x-2 items-center justify-center">
          <p title="min temp">
            <span className="font-medium">
              {((item.main.temp_min / 10) * 1.8 + 32).toFixed(1)}
            </span>
            <span>
              <sup>o</sup>
            </span>
            <span>F</span>
          </p>
          <p title="max temp">
            <span className="font-medium">
              {((item.main.temp_max / 10) * 1.8 + 32).toFixed(1)}
            </span>
            <span>
              <sup>o</sup>
            </span>
            <span>F</span>
          </p>
        </div>
      )}
    </div>
  ));

  function changeCelTemp() {
    setCelTemp(true);
    setFahTemp(false);
  }
  function changeFahTemp() {
    setCelTemp(false);
    setFahTemp(true);
  }

  useEffect(() => {
    async function fetchCityWeather(selectedCity) {
      const { oneDayForecast, fiveDaysForecast } = await allReport(
        selectedCity
      );
      if (oneDayForecast) {
        setCityWeather(oneDayForecast);
        const result = filterWeatherForecastForFiveDays(fiveDaysForecast);
        setDaysReport(result);
      } else {
        toast.error("City not available for now... try another");
        setSelectedCity("london");
        setIsOpen(false);
      }
    }
    if (selectedCity) fetchCityWeather(selectedCity);
  }, [selectedCity, setCityWeather, setSelectedCity]);

  useEffect(() => {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };
    async function success(pos) {
      const crd = pos.coords;
      const location = await userCity(crd.latitude, crd.longitude);
      setSelectedCity(location[0].name);
    }
    const errors = (err) => console.warn(`ERROR(${err.code}): ${err.message}`);

    if ("geolocation" in navigator) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          if (result.state === "granted") {
            navigator.geolocation.getCurrentPosition(success);
          } else if (result.state === "prompt") {
            navigator.geolocation.getCurrentPosition(success, errors, options);
          } else if (result.state === "denied") {
            setSelectedCity("Port Harcourt");
            toast.warning("Location access is denied!");
          }
          result.onchange = function () {
            toast.info(`Location access ${result.state}`);
          };
        });
    } else {
      toast.warning("Sorry not available");
    }
  }, [setSelectedCity]);

  return (
    <div>
      <Head>
        <title>Jaro-weather App</title>
        <meta
          name="description"
          content="weather app for cities of the world"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon_.png" />
      </Head>

      <main>
        <section className="lg:flex h-screen ">
          <div className="w-full lg:max-w-[375px] bg-[#1E213A] pt-[42px] overflow-y-auto md:h-screen customScrollBar  ">
            <div className="flex justify-between items-center px-[11px] mb-[109px]">
              <button
                onClick={openModal}
                className="searchBTN bg-[#6E707A] w-[161px] h-10 text-[#E7E7EB] font-medium text-base "
              >
                Search for places
              </button>
              <div
                onClick={openAckPop}
                className="bg-[#6E707A] w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
              >
                <Image
                  src={"/icons/locationIcon.svg"}
                  alt="my location icon"
                  width={"22"}
                  height={"22"}
                />
              </div>
            </div>
            <div className="w-full h-[350px] bg-[url('/images/Cloud-background.png')] lg:bg-[url('/images/Cloud-background.png')] md:bg-none bg-no-repeat bg-center lg:bg-cover flex justify-center items-center ">
              {!cityWeather && (
                <div className="animate-pulse text-white font-medium">
                  Loading
                </div>
              )}
              {cityWeather && (
                <Image
                  loader={imageLoader}
                  src={cityWeather.weather[0].icon}
                  alt="weather icon"
                  width={200}
                  height={200}
                  objectFit="cover"
                  priority={false}
                />
              )}
            </div>
            <section>
              <div className="flex items-center flex-col my-[87px] ">
                <span className=" text-[#E7E7EB] flex items-center">
                  <div className="font-medium text-[144px]">
                    {cityWeather && Math.floor(cityWeather.main.temp / 10)}
                  </div>
                  <div className="mt-8 text-5xl">
                    <sup>o</sup>
                  </div>
                  <div className="text-5xl mt-10 font-medium">C</div>
                </span>
                <p className="text-[#A09FB1] pt-[87px] font-bold text-4xl ">
                  {cityWeather && cityWeather.weather[0].main}
                </p>
              </div>
              <div className="text-[#88869D] text-lg font-medium text-center ">
                <span className="space-x-2">
                  <span>Today</span>
                  <span className="font-bold">:</span>
                  <span>{todayDate(new Date())}</span>
                </span>
              </div>
              <div className="flex justify-center items-center mt-8 md:mb-0 pb-[52px] space-x-1 ">
                <Image
                  src={"/icons/mapLocationIcon.svg"}
                  alt="my location icon"
                  width={"20"}
                  height={"20"}
                />
                <div className="flex space-x-2 items-center justify-center">
                  <p className="text-[#88869D] text-lg font-bold capitalize ">
                    {selectedCity},
                  </p>
                  <p className="text-[#88869D] text-lg font-bold capitalize ">
                    {cityWeather && cityWeather.sys.country}
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div className="bg-[#100E1D] pb-[51px] md:h-screen overflow-y-auto customScrollBar  md:pb-0 flex-1  ">
            <div className="hidden md:block space-x-4 w-[704px] mx-auto mt-[42px] mb-[66px] text-right">
              <button
                onClick={changeCelTemp}
                className={
                  `${
                    celTemp
                      ? " text-[#110E3C] bg-[#E7E7EB] "
                      : " text-[#E7E7EB] bg-[#585676] "
                  }` + "font-bold text-lg w-10 h-10 rounded-full "
                }
              >
                <sup>o</sup>C
              </button>
              <button
                onClick={changeFahTemp}
                className={
                  `${
                    fahTemp
                      ? " text-[#110E3C] bg-[#E7E7EB] "
                      : " text-[#E7E7EB] bg-[#585676] "
                  }` + "font-bold text-lg w-10 h-10 rounded-full "
                }
              >
                <sup>o</sup>F
              </button>
            </div>

            {!selectedCity ? (
              <div className="h-[177px] animate-pulse text-center md:w-[704px] md:mx-auto px-[51px] md:px-0 pt-[51px] md:pt-0 text-white font-medium">
                <p> Loading</p>
              </div>
            ) : (
              <div className="md:w-[704px] md:mx-auto px-[51px] md:px-0 pt-[51px] md:pt-0 grid grid-cols-2 md:grid-cols-5 gap-x-[26px] gap-y-8 mb-[51px] md:mb-[72px]">
                {items && items}
              </div>
            )}

            <section>
              <div className="md:w-[704px] md:mx-auto  ">
                <p className="text-[#E7E7EB] font-bold text-2xl px-[21px] md:px-0 mb-8 ">
                  Today &apos;s Highlight
                </p>
                <div className="px-[23px] md:px-0 gap-12 grid md:grid-cols-2  ">
                  {!cityWeather ? (
                    <div className="shadow rounded-md p-4 md:max-w-[328px] md:w-[328px] h-[204px] border border-[#1E213A]">
                      <div className="animate-pulse flex space-x-4">
                        <div className="rounded-full bg-slate-700 h-10 w-10"></div>
                        <div className="flex-1 space-y-6 py-1">
                          <div className="h-2 bg-slate-700 rounded"></div>
                          <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-4">
                              <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                              <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                            </div>
                            <div className="h-2 bg-slate-700 rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="md:max-w-[328px] md:w-[328px] h-[204px] bg-[#1E213A] text-[#E7E7EB] flex justify-center items-center flex-col">
                      <p className="font-medium text-base mt-[22px]">
                        Wind Status
                      </p>
                      <p className="mt-[6px] mb-[26px]">
                        <span className="font-bold text-[64px] ">
                          {cityWeather && cityWeather.wind.speed}
                        </span>
                        <span className="font-medium text-4xl ">mph</span>
                      </p>
                      <div className="flex items-center space-x-2 mb-[35px]">
                        <Image
                          src={"/icons/directionIcon.svg"}
                          alt="my location icon"
                          width={"21"}
                          height={"21"}
                        />
                        <p>WSW</p>
                      </div>
                    </div>
                  )}

                  {!cityWeather ? (
                    <div className="shadow rounded-md p-4 md:max-w-[328px] md:w-[328px] h-[204px] border border-[#1E213A]">
                      <div className="animate-pulse flex space-x-4">
                        <div className="rounded-full bg-slate-700 h-10 w-10"></div>
                        <div className="flex-1 space-y-6 py-1">
                          <div className="h-2 bg-slate-700 rounded"></div>
                          <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-4">
                              <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                              <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                            </div>
                            <div className="h-2 bg-slate-700 rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="md:max-w-[328px] md:w-[328px] h-[204px] bg-[#1E213A] text-[#E7E7EB] flex justify-center items-center flex-col">
                      <p className="font-medium text-base mt-[22px]">
                        Humidity
                      </p>
                      <p className="mt-[6px] mb-[26px]">
                        <span className="font-bold text-[64px] ">
                          {cityWeather && cityWeather.main.humidity}
                        </span>
                        <span className="font-medium text-4xl ">%</span>
                      </p>
                      <div className="flex items-center space-x-2 mb-[35px]">
                        <RangeBar
                          humidity={cityWeather && cityWeather.main.humidity}
                        />
                      </div>
                    </div>
                  )}

                  {!cityWeather ? (
                    <div className="shadow rounded-md p-4 md:max-w-[328px] md:w-[328px] h-[204px] border border-[#1E213A]">
                      <div className="animate-pulse flex space-x-4">
                        <div className="rounded-full bg-slate-700 h-10 w-10"></div>
                        <div className="flex-1 space-y-6 py-1">
                          <div className="h-2 bg-slate-700 rounded"></div>
                          <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-4">
                              <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                              <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                            </div>
                            <div className="h-2 bg-slate-700 rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="md:max-w-[328px] md:w-[328px] h-[159px] bg-[#1E213A]  text-[#E7E7EB] flex justify-center items-center flex-col">
                      <p className="font-medium text-base mt-[22px]">
                        Visibility
                      </p>
                      <p className="mt-[6px] mb-[26px]">
                        <span className="font-bold text-[64px] ">
                          {cityWeather && cityWeather.visibility / 1000}
                        </span>
                        <span className="font-medium text-4xl ">km</span>
                      </p>
                    </div>
                  )}
                  {!cityWeather ? (
                    <div className="shadow rounded-md p-4 md:max-w-[328px] md:w-[328px] h-[204px] border border-[#1E213A]">
                      <div className="animate-pulse flex space-x-4">
                        <div className="rounded-full bg-slate-700 h-10 w-10"></div>
                        <div className="flex-1 space-y-6 py-1">
                          <div className="h-2 bg-slate-700 rounded"></div>
                          <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-4">
                              <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                              <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                            </div>
                            <div className="h-2 bg-slate-700 rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="md:max-w-[328px] md:w-[328px] h-[159px] bg-[#1E213A] text-[#E7E7EB] flex justify-center items-center flex-col">
                      <p className="font-medium text-base mt-[22px]">
                        Air Pressure
                      </p>
                      <p className="mt-[6px] mb-[26px]">
                        <span className="font-bold text-[64px] ">
                          {cityWeather && cityWeather.main.pressure / 100}
                        </span>
                        <span className="font-medium text-4xl ">mb</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>
            <SearchDrawer isOpen={isOpen} setIsOpen={setIsOpen} />
            <footer className="flex justify-center text-white pt-24 md:pb-[6px] space-x-2">
              <p>created by</p>
              <p>
                <Link href="https://github.com/Felistus" passHref>
                  <a target="_blank" rel="noopener noreferrer">
                    Ezeugo Felistus Obieze
                  </a>
                </Link>
              </p>
            </footer>
            <Acknowledement openAck={openAck} setOpenAck={setOpenAck} />
          </div>
        </section>
        <ToastContainer autoClose={5000} />
      </main>
    </div>
  );
}
