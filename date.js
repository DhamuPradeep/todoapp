
//jshint esversion:6

exports.getDate = getDate;

function getDate(){
  const today = new Date();
  const options = {day:"numeric",month:"long",weekday:"long"};
  return today.toLocaleDateString("en-US",options);
}

exports.getDay = function(){
  const today = new Date();
  const options = {weekday:"long"};
  return today.toLocaleDateString("en-US",options);
};
