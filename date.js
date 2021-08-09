

//console.log(module);
 
/*module.exports=getDate;
// module.exports.getDate=getDate;    if there are more than one functions

function getDate()
{
var today= new Date();

var options ={
    weekday: "long",
    day: "numeric",
    month: "long"
 };

 var day=today.toLocaleDateString("en-US",options);

return day;

}*/


//alternative way to refractor/reduce above code

 exports.getDate = function()  //no need to use module.
{
    var today= new Date();
    
    var options ={
        weekday: "long",
        day: "numeric",
        month: "long"
     };
    
      return today.toLocaleDateString("en-US",options);
    
 
};
exports.getDay = function () {

    const today = new Date();
  
    const options = {
      weekday: "long"
    };
  
    return today.toLocaleDateString("en-US", options);
  
  };
  