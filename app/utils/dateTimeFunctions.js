const checkTime = async (timeToCheck) => {
  const t = timeToCheck.split(':');
  const t1 = 9;// "09:00:00"
  const t2 = 13;//  "13:00:00"
  const t3 = 14;// "14:00:00"
  const t4 = 18;// "18:00:00"
  const hr = parseInt(t[0], 10);

  if ((hr >= t1 && hr < t2) || (hr >= t3 && hr < t4)) return true;
  return false;
};

const checkDay = async (dateToUpdate) => {
  const dDate = dateToUpdate.split('-');
  const newDate = new Date();
  newDate.setDate(parseInt(dDate[2], 10));
  newDate.setMonth(parseInt(dDate[1], 10) - 1);
  newDate.setFullYear(parseInt(dDate[0], 10));

  const day = newDate.getDay();

  if (day === 0) return false;
  return true;
};

const dateInFuture = (checkDate, currentDate) => {
  //  yyyy-mm-dd
  const date11 = checkDate.split('-');
  const date22 = currentDate.split('-');
  const date1 = [];
  const date2 = [];
  date11.forEach((element) => date1.push(parseInt(element, 10)));
  date22.forEach((element) => date2.push(parseInt(element, 10)));
  if (date1[0] > date2[0]) return true;
  if (date1[0] === date2[0] && date1[1] > date2[1]) return true;
  if (date1[0] === date2[0] && date1[1] === date2[1] && date1[2] > date2[2]) return true;
  return false;
};

module.exports = {
  checkDay,
  checkTime,
  dateInFuture,
};
