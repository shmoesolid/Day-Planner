// setup functions for saving and getting local timeslot

function _convertTo12Hour(number)
{
    // setup return array
    var array = [ parseInt(number), "am"];

    // error if not a number
    if (isNaN(array[0])) return false;

    // convert to standard, but don't set if we are at 24 (below handles this)
    if (array[0] > 11 && array[0] < 24) 
    {
        array[0] -= 12;
        array[1] = "pm";
    }

    // correct 0 and 24 results
    if (array[0] == 0 || array[0] == 24) 
        array[0] = 12;

    // return array
    return array;
}