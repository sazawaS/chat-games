
var globals = {

}

function isGlobalsInitialized() {
  return Object.keys(globals).length > 0;
}

function getGlobals(key) {
  return globals[key];
}

function setGlobals(key, value){
  globals[key] = value;
}




module.exports = {isGlobalsInitialized, getGlobals, setGlobals};