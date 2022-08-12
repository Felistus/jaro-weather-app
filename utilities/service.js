export const ACTIONS = {
  OPEN: "open",
  CLOSE: "close",
  OPENACK: "openAck",
  CLOSEACK: "closeAck",
  SET_DAY_REPORT: "setDayReport",
  OPENCELTEMP: "openCelTemp",
  CLOSECELTEMP: "closeCelTemp",
  OPENFAHTEMP: "openFahTemp",
  CLOSEFAHTEMP: "closeFahTemp",
};
export function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.OPEN:
      return { ...state, toggleSearch: true };
    case ACTIONS.CLOSE:
      return { ...state, toggleSearch: false };
    case ACTIONS.OPENACK:
      return { ...state, toggleAck: true };
    case ACTIONS.CLOSEACK:
      return { ...state, toggleAck: false };
    case ACTIONS.SET_DAY_REPORT:
      return { ...state, daysReport: action.payload.result };
    case ACTIONS.OPENCELTEMP:
      return { ...state, celTemp: true };
    case ACTIONS.CLOSECELTEMP:
      return { ...state, celTemp: false };
    case ACTIONS.OPENFAHTEMP:
      return { ...state, fahTemp: true };
    case ACTIONS.CLOSEFAHTEMP:
      return { ...state, fahTemp: false };
    default:
      return state;
  }
}

export const imageLoader = ({ src, width, quality }) => {
  return `https://openweathermap.org/img/wn/${src}@4x.png?w=${width}&q=${
    quality || 75
  }`;
};

export function todayDate(weatherDate) {
  return new Date(weatherDate).toLocaleDateString("en-us", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export const filterWeatherForecastForFiveDays = (forecastReport) => {
  const reportArray = forecastReport.list;
  const reportSet = new Set();
  const today = new Date();

  const todayDate = `${today.getFullYear()}-${
    (today.getMonth() + 1).toString().length > 1
      ? today.getMonth() + 1
      : "0" + (today.getMonth() + 1).toString()
  }-${
    today.getDate().toString().length > 1
      ? today.getDate()
      : "0" + today.getDate()
  }`;
  const fiveDaysReport = [];

  reportArray
    .map((item) => {
      item.dt_txt = item.dt_txt.split(" ")[0];
      return item;
    })
    .filter((item) => item.dt_txt !== todayDate)
    .forEach((item) => {
      if (!reportSet.has(item.dt_txt)) {
        reportSet.add(item.dt_txt);
        fiveDaysReport.push(item);
      }
    });
  if (fiveDaysReport.length === 4) {
    fiveDaysReport.unshift(reportArray[1]);
  }
  return fiveDaysReport;
};

export function getNumberOfDays(createdAt) {
  const date = new Date(createdAt);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dateString = `${year}-${month}-${day}`;
  const dateObject = new Date(dateString);
  const timeDiff = Math.abs(Date.now() - dateObject.getTime());
  const diffDays = Math.round(timeDiff / (1000 * 3600 * 24));
  return diffDays === 1 ? "Tomorrow" : todayDate(createdAt);
}
