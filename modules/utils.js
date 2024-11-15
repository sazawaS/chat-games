
function readableDate(dateInMs) {
  const MY = (Date.now() - dateInMs);
  const days = Math.floor(MY / (1000 * 60 * 60 * 24));
  const hrs = Math.floor( (MY / (1000 * 60 * 60)) - (days * 24) ) 
  const min = Math.floor( (MY / (1000 * 60)) - (days * 24 * 60) - (hrs * 60) )

  return {
    days: days,
    hrs : hrs,
    min : min,
  }
}

module.exports = {readableDate: readableDate}