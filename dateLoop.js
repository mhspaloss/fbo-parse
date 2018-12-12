var date = new Date('November 19, 2017'),
d = date.getDate(),
m = date.getMonth(), //January is momth 0 in JavaScripty = date.getFullYear();
y = date.getFullYear();

for(i=0; i < 5; i++){
var curdate = new Date(y, m, d+i);
var curMonth = ("0" + (curdate.getMonth()+1)).slice(-2); //increment month by 1, add leading zero if month 1-9
var curDay = ("0" + curdate.getDate()).slice(-2); //add leading zero if  day 1-9
console.log('FBOFeed%s%s%s', curdate.getFullYear(), curMonth, curDay);
}
