function notSameMonth(day, value){
    return !value.isSame(day, 'month');
}
function isSelected(day, value){
    return value.isSame(day, 'day');
}
function isToday(day){
    return day.isSame(new Date(), 'day');
}
function isPreSelected(day, preDay, value){
    return preDay.isSame(day, 'day') && !value.isSame(day, 'day');
}
export default function dayStyles(day, value, preDay){    
    if (notSameMonth(day, preDay)) return "not-same-month";
    if (isSelected(day, preDay)) return "selected";
    if (isToday(day)) return "today";
    if (isPreSelected(day, value, preDay)) return "pre-selected";
 
    return "";
}