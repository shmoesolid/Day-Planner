
// setup unique local save/load namespace
const SAVE_NAME = "SK_DAY_PLANNER";

// get current date/time
var now = moment();

// setup default storage object for saving/loading data
var storage = 
{
    timeSlots: new Array(25), // 25 indexes for 0 to 24 indicating our hours in military
    timeStart: 9, // 9am
    timeEnd: 17, // 5pm
    date: now // this date is for comparison of storage to now
};

// attempt to load from storage
storage = loadStorageVars(SAVE_NAME, storage);

// element references
var currentDayElm = $('#currentDay');
var containerElm = $('#timeContainer');
var timeStartElm = $('#timeStart');
var timeEndElm = $('#timeEnd');
var timeSliderElm = $('#slider-range');

// planner time range (jquery ui) slider/input setup
timeSliderElm.slider
({
    // set properties
    range: true,
    min: 0, max: 24,
    values: [ storage.timeStart, storage.timeEnd ],

    // setup event for setting inputs when slider changes
    slide: function( event, ui )
    {
        // get time conversion data
        var startValue = _convertTo12Hour(ui.values[ 0 ]);
        var endValue = _convertTo12Hour(ui.values[ 1 ]);

        // set display input values utilizing data
        timeStartElm.val(startValue[0] + startValue[1]);
        timeEndElm.val(endValue[0] + endValue[1]);

        // adjust timeslots here
        // TODO..
    }
});

// prime values of number inputs with current slider values
var startValue = _convertTo12Hour(timeSliderElm.slider( "values", 0 ));
var endValue = _convertTo12Hour(timeSliderElm.slider("values", 1 ));
timeStartElm.val( startValue[0] + startValue[1] );
timeEndElm.val( endValue[0] + endValue[1] );

// format current day and display for header
currentDayElm.text(now.format("MMMM Do YYYY"));

//console.log(now.format("H")); // returns current time in 24 hour format without leading 0
//console.log(_convertTo12Hour(now.format("H")));

initTimeslots();

// setup listener for save button(s)
$(".saveBtn").on("click", function()
{
    // get parent aka time slot
    var parent = $(this).parent();

    // get time slot index from parent id of button
    var timeIndex = parent.attr('id');

    // ..
    // parent
    // storage.timeSlots[ timeIndex ] = 
});
