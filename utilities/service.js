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
