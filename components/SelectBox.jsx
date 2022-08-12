import { Fragment, useEffect, useState, useContext } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { SelectCity } from "../pages/_app";

export default function SelectBox({ fewCities, isOpen, setIsOpen }) {
  const { selectedCity, setSelectedCity } = useContext(SelectCity);
  const [selected, setSelected] = useState(selectedCity);

  function setModalState() {
    setIsOpen((isOpen) => !isOpen);
  }
  useEffect(() => {
    if (selected) setSelectedCity(selected.toLowerCase());
  }, [fewCities, selected, setSelectedCity]);

  return (
    <Listbox value={selected} onChange={setSelected}>
      <div className="relative h-16 ">
        <Listbox.Button className="relative w-full h-full cursor-default pl-3 pr-10 text-left shadow-md focus:outline-none bg-transparent text-base font-medium text-[#E7E7EB] border-[1px] border-[#616475] ">
          <span className="block truncate">{selected}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <SelectorIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className=" bg-[#100E1D] text-[#E7E7EB] absolute mt-1 max-h-[400px] w-full overflow-auto py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm customScrollBar">
            {fewCities.map((person, personIdx) => (
              <Listbox.Option
                key={personIdx}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-8 pr-4 ${
                    active ? "bg-amber-100 text-[#100E1D]" : ""
                  }`
                }
                value={person.city}
              >
                {({ selected }) => (
                  <>
                    <div
                      onClick={setModalState}
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {person.city.toLowerCase()}
                    </div>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-amber-600">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
