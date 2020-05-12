

// element references
var currentDayElm = $('#currentDay');
var containerElm = $('#container');
var timeStartElm = $('#timeStart');
var timeEndElm = $('#timeEnd');
var timeSliderElm = $('#slider-range');

// planner time range slider/input setup
timeSliderElm.slider
({
    // set properties
    range: true,
    min: 0,
    max: 24,
    values: [ 9, 17 ],

    // setup event for setting inputs when slider changes
    slide: function( event, ui )
    {
        timeStartElm.val(ui.values[ 0 ]);
        timeEndElm.val(ui.values[ 1 ]);
    }
});

// prime values of number inputs with current slider values
timeStartElm.val( timeSliderElm.slider( "values", 0 ) );
timeEndElm.val( timeSliderElm.slider("values", 1 ));

// get current date/time
var now = moment();

// format current day and display
currentDayElm.text(now.format("MMMM Do YYYY"));

//console.log(now.format("H")); // returns current time in 24 hour format without leading 0
//console.log(_convertTo12Hour(now.format("H")));

// setup event for changing time within start/end time inputs to have slider match
// TODO..

function _convertTo12Hour(number)
{
    // setup return array
    var array = [ parseInt(number), "am"];

    // error if not a number
    if (isNaN(array[0])) return false;

    // convert to standard, but don't set if we are at 24 (below handles this)
    if (number > 12 && number < 24) 
    {
        array[0] -= 12;
        array[1] = "pm";
    }

    // finalize
    if (array[0] == 0 || array[0] == 24) 
        array[0] = 12;

    // return array
    return array;
}

// loads up schedule
function loadSchedule()
{
    for (let i = 0; i < 25; i++) 
    {
        //const element = array[i];
        
        
    }
}


