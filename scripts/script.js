
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

// attempt to load from local storage (legit byref in js would be neat)
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

        // get own time conversion data
        var startValue = _convertTo12Hour( storage.timeStart );
        var endValue = _convertTo12Hour( storage.timeEnd );

        // set display input values utilizing data
        timeStartElm.val(startValue[0] + startValue[1]);
        timeEndElm.val(endValue[0] + endValue[1]);

        /** adjust timeslots below..
         * it is a complicated magic beast from here on out,
         * there is probably a better way of doing this, but
         * i had an idea and ran with it, below = result ..
         * i was simply re-initializing timeslots every slider
         * change with initTimeslots() but that's not a good way
         * of doing things even though its still quick to the eye
         * and probably would have been an 'A' still on the homework,
         * the below *should* be much faster in execution .. honestly
         * i doubt anyone even sees or cares about these comments or 
         * the coolguy logic behind the code, only the result :D
         */

        // initTimeslots(); // OLD/SLOW

        // get first and last id/index of time slots displayed using 'row' class
        var allSlotElms = $('.row'); // get search reference 1 time for multiple usage
        var firstIndex = parseInt(allSlotElms.first().attr('id'));
        var lastIndex = parseInt(allSlotElms.last().attr('id'));

        // prime some magic variables
        var diff = curIndex = 0;
        var adding = before = false;

        // change in first/start time frame
        // (assigns diff var with subtraction math then compares diff to 0 [not equals to...])
        // subtraction is reversed from last/end since it's before
        if ( (diff = (firstIndex - parseInt(storage.timeStart))) !== 0 )
        {
            curIndex = firstIndex; // set our current index to first
            if (diff > 0) adding = before = true; // we are adding before
            diff *= -1; // reverse the difference now since we're before (coolguy logic)
        }

        // change in last/end time frame
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
            var modifier = (diff / Math.abs(diff)); // creates difference modifier (either 1 or -1)
            var nextIndex = curIndex + modifier; // setup next index based on modifier

            // add (using nextIndex because we are creating new) and set text from storage if any
            // or remove (using curIndex because we gotta get rid of what we're on)
            if (adding) createTimeslot(nextIndex, before).text( storage.timeSlots[nextIndex] );
            else removeTimeslot(curIndex);

            diff -= modifier; // update difference by modifier (will march towards 0 either way by subtracting)
            curIndex = nextIndex; // update curIndex for next round if any
        }

        // reset listeners (forgot to do this.. OOPS)
        resetButtonListeners();
    }
});

// prime formatted values of number inputs with storage vars (could get from slider too)
var startValue = _convertTo12Hour( storage.timeStart );
var endValue = _convertTo12Hour( storage.timeEnd );
timeStartElm.val( startValue[0] + startValue[1] );
timeEndElm.val( endValue[0] + endValue[1] );

// format current day and display for header
currentDayElm.text(now.format("MMMM Do YYYY"));

// initialize our time slots
initTimeslots();

// reset button listeners
resetButtonListeners();

// setup other listener (shouldn't need this?)
window.addEventListener("beforeunload", function() { saveStorageVars(SAVE_NAME, storage) });

//console.log(now.format("H")); // returns current time in 24 hour format without leading 0
//console.log(_convertTo12Hour(now.format("H")));
