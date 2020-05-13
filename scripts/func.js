
/////////////////////////////////////////////////////////////////////////
/** loads obj from local storage from unique name (default obj if null)
 * 
 * @param {string} storageName 
 * @param {obj} defaultObj 
 */
function loadStorageVars(storageName, defaultObj)
{
    // attempt to load vars
    var vars = JSON.parse(localStorage.getItem(storageName));

    // no vars, return our default
    if ( vars === null ) return defaultObj;

    // we have something, return vars
    return vars;
}

/////////////////////////////////////////////////////////////////////////
/** saves obj into local storage by unique name
 * 
 * @param {string} storageName 
 * @param {obj} obj 
 */
function saveStorageVars(storageName, obj)
{
    localStorage.setItem(storageName, JSON.stringify(obj));
}

/////////////////////////////////////////////////////////////////////////
/** converts 24 hour time number only string to 12 hour am/pm
 * 
 * @param {string} number 
 */
function _convertTo12Hour(number)
{
    // setup return array
    var array = [ parseInt(number), "am"];

    // error if not a number
    if (isNaN(array[0])) return false;

    // convert to standard with period change
    if (array[0] > 11 && array[0] < 24) 
    {
        array[0] -= 12;
        array[1] = "pm";
    }

    // correct 0 and 24 results
    if (array[0] == 0 || array[0] == 24) array[0] = 12;

    // return array
    return array;
}

/////////////////////////////////////////////////////////////////////////
/** creates time slot row from index
 * 
 * @param {int} index 
 * @param {bool} insertBefore 
 */
function createTimeslot(index, insertBefore = false)
{
    // get converted time data from index
    var timeData = _convertTo12Hour(index);

    // create section element
    var slot = $("<section>");

    // setup whole slot
    slot.addClass("row");
    slot.attr("id", index);
    
    // setup hour column
    var hourCol = $("<div>");
    hourCol.addClass("hour");
    hourCol.text(timeData[0] + timeData[1]);
    slot.append(hourCol);

    // setup text area column
    var areaCol = $("<textarea>")
    slot.append(areaCol);

    // setup save button
    var saveCol = $("<button>");
    saveCol.addClass("saveBtn far fa-save");
    slot.append(saveCol);

    // append and prepend our slot to time container
    if (insertBefore) containerElm.prepend(slot);
    else containerElm.append(slot);

    // return our textarea col
    // might return whole slot later, not needed currently
    return areaCol;
}

/////////////////////////////////////////////////////////////////////////
/** removes time slot 'row' by index
 * 
 * @param {int} index 
 */
function removeTimeslot(index)
{
    // simple enough
    $(index).remove();
}

/////////////////////////////////////////////////////////////////////////
/** does initial load of all the timeslots per the timeframe
 * 
 */
function initTimeslots()
{
    // go through all our time slots
    for (let i = 0; i < 25; i++) 
    {
        // check if within our time
        if (i >= storage.timeStart && i <= storage.timeEnd)
        {
            // create the slot
            var textarea = createTimeslot(i);

            // add text if we have anything
            textarea.text( (storage.timeSlots[i]) ? storage.timeSlots[i] : "" );
        }
    }
}