

function sameDate(date1,date2) {
    if (date1 === date2) {
        return true;
    }
    if (date1 && !date2) {
        return false;
    }
    if (!date1 && date2) {
        return false;
    }
    return date1.getTime() === date2.getTime();
}


export default sameDate;
