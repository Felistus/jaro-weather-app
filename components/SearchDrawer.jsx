import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect, useContext } from "react";
import Image from "next/image";
import SelectBox from "./SelectBox";
import useSWR from "swr";
import { citiesFetcher } from "../utilities/fetchServices";
import { SelectCity } from "../pages/_app";

export default function SearchDrawer({ isOpen, setIsOpen }) {
  const [searchValue, setSearchValue] = useState("");
  const { data: cities, error } = useSWR("cities", citiesFetcher);
  const [fewCities, setFewCities] = useState([]);
  const setSelectedCity = useContext(SelectCity).setSelectedCity;
  const closeModal = () => setIsOpen((prevState) => !prevState);

  function changeSearchValue(e) {
    const keyword = e.target.value.toLowerCase();
    setSearchValue(keyword);
  }

  function findCity(event) {
    event.preventDefault();
    cities.filter((item) => {
      if (item.city.toLowerCase() === searchValue) {
        setSelectedCity(item.city.toLowerCase());
      }
    });
    setSearchValue("");
    setIsOpen((prevState) => !prevState);
  }

  useEffect(() => {
    if (cities) {
      const listOfCities = cities.filter((city, index) => index < 400);
      setFewCities([...listOfCities]);
    }
  }, [cities]);

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-bg-transparent bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="min-h-full  text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-[375px] h-screen transform overflow-hidden bg-[#1E213A] px-6 text-left align-middle shadow-xl transition-all">
                  <section className="flex justify-end items-center">
                    <div
                      onClick={closeModal}
                      className="my-[17px] mb-[30px] w-10 h-10 rounded-full hover:bg-[#3C47E9] flex justify-center cursor-pointer  "
                    >
                      <Image
                        src={"/icons/cancelIcon.svg"}
                        alt="close button"
                        width={"20"}
                        height={"20"}
                      />
                    </div>
                  </section>
                  <form
                    onSubmit={findCity}
                    className="flex space-x-[12px] mb-[38px] "
                  >
                    <div className="flex items-center w-[252px] h-12 border-[1px] border-[#E7E7EB] pl-[15px] pr-2 space-x-[12px] ">
                      <Image
                        src={"/icons/searchIcon.svg"}
                        alt="search icon"
                        width={18}
                        height={18}
                      />
                      <input
                        type="search"
                        value={searchValue}
                        onChange={changeSearchValue}
                        placeholder="search location"
                        className="flex-1 outline-none h-[19px]  bg-transparent text-[#616475] text-base font-medium "
                      />
                    </div>
                    <div className="h-12 w-[86px] ">
                      <button
                        disabled={!searchValue}
                        className="bg-[#3C47E9] disabled:bg-gray-700 w-full h-full outline-none text-[#E7E7EB] text-base font-semibold"
                      >
                        Search
                      </button>
                    </div>
                  </form>

                  <div className="mt-4">
                    <SelectBox
                      fewCities={fewCities}
                      isOpen={isOpen}
                      setIsOpen={setIsOpen}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
