
const urlEdit = () => {
  const url = 'http://3.98.123.149:4000'
  // const url = 'http://172.31.5.223:4000'
   //const url = 'http://localhost:4000'
  
  return url
}


const formatDateddmmyyyy = (data) => {
  const date = new Date(data);

  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  const formattedDate = date.toLocaleDateString("en-GB", options);
  return formattedDate;
};

const overDueCalculator = (paid, dueDate, principle, interest) => {
  const targetDate = new Date(dueDate);
  const currentDate = new Date(paid);
  const timeDifference = currentDate.getTime() - targetDate.getTime();
  let daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  daysDifference = daysDifference+1

  if (daysDifference - 3 > 0) {
    const od =
      (parseInt(principle) + parseInt(interest)) * 0.004 * daysDifference;
    const roundedUp = Math.ceil(od);
    return roundedUp;
  } else {
    return 0;
  }
};

// Export the function to make it accessible in other files
module.exports = {
  formatDateddmmyyyy,
  overDueCalculator,
  urlEdit
};
