


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
        // was simply re-initializing timeslots but 
        // i don't like doing things that way
        //initTimeslots();

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
            curIndex = firstIndex; // set our current index to first
            if (diff > 0) adding = before = true; // we are adding before
            diff *= -1; // reverse the difference now since we are before
        }

        // change in last
        else if ( (diff = (parseInt(storage.timeEnd) - lastIndex)) !== 0 )
        {
            curIndex = lastIndex; // set our current index to last
            if (diff > 0) adding = true; // we are adding after
        }

        // moving slider too quickly can cause big jumps in difference
        // so gotta make sure we handle them all at once if so..
        // most of the time the below will only run 1 time
        while (diff !== 0)
        {
            var modifier = (diff/Math.abs(diff)); // creates difference modifier (either 1 or -1)
            var nextIndex = curIndex + modifier; // setup next index based on modifier

            // add (using nextIndex because we are creating new) and set text if any in storage
            // or remove (using curIndex because we gotta get rid of what we're on)
            if (adding) createTimeslot(nextIndex, before).text( storage.timeSlots[nextIndex] );
            else removeTimeslot(curIndex);

            diff -= modifier; // update difference by 1 (will march towards 0 either way)
            curIndex = nextIndex; // update curIndex for next round if any
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
