


// setup unique local save/load namespace
const SAVE_NAME = "SK_DAY_PLANNER";
//localStorage.removeItem(SAVE_NAME); // DEBUG

// get current date/time
var now = moment();

// setup default storage object for saving/loading data
var storage = 
{
    timeSlots: new Array(25).fill(""), // 25 indexes for 0 to 24 indicating our hours in military
    timeStart: 9, // 9am
    timeEnd: 17, // 5pm
    date: now // this date is for comparison of storage to now
};

// attempt to load from local storage
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

    // setup event for slider changes
    slide: function( event, ui )
    {
        // update storage vars
        storage.timeStart = ui.values[ 0 ];
        storage.timeEnd = ui.values[ 1 ];

        // save vars
        saveStorageVars(SAVE_NAME, storage);

        // get time conversion data
        var startValue = _convertTo12Hour( storage.timeStart );
        var endValue = _convertTo12Hour( storage.timeEnd );

        // set display input values utilizing data
        timeStartElm.val(startValue[0] + startValue[1]);
        timeEndElm.val(endValue[0] + endValue[1]);

        // adjust timeslots below..
        // it is complicated magic from here on out

        // get first and last id/index of time slots displayed
        var allSlotElms = $('.row');
        var firstIndex = parseInt(allSlotElms.first().attr('id'));
        var lastIndex = parseInt(allSlotElms.last().attr('id'));

        // prime some vars
        var diff = curIndex = 0;
        var adding = before = false;

        // change in first
        if ( (diff = (firstIndex - parseInt(storage.timeStart))) !== 0 )
        {
            //initTimeslots(); // TEMPORARY
            curIndex = firstIndex;
            if (diff > 0) adding = before = true;
            diff *= -1; // reverse the difference since we are before
        }

        // change in last
        else if ( (diff = (parseInt(storage.timeEnd) - lastIndex)) !== 0 )
        {
            //initTimeslots(); // TEMPORARY
            curIndex = lastIndex;
            if (diff > 0) adding = true;
        }

        // ..
        while (diff !== 0)
        {
            var modifier = (diff/Math.abs(diff));
            var nextIndex = curIndex + modifier;

            if (adding) createTimeslot(nextIndex, before).text( storage.timeSlots[nextIndex] );
            else removeTimeslot(curIndex);

            diff -= modifier;
            curIndex = nextIndex;
        }
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

// initialize our time slots
initTimeslots();

// reset button listeners
resetButtonListeners();
