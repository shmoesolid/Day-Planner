
// setup storage object for saving/loading data
var storage = 
{
    timeSlots: new Array(25), // 25 indexes for 0 to 24 indicating our hours in military
    timeStart: 9,
    timeEnd: 17
};

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
    values: [ storage.timeStart, storage.timeEnd ],

    // setup event for setting inputs when slider changes
    slide: function( event, ui )
    {
        var startValue = _convertTo12Hour(ui.values[ 0 ]);
        var endValue = _convertTo12Hour(ui.values[ 1 ]);

        timeStartElm.val(startValue[0] + startValue[1]);
        timeEndElm.val(endValue[0] + endValue[1]);

        // adjust timeslots
    }
});

// prime values of number inputs with current slider values
var startValue = _convertTo12Hour(timeSliderElm.slider( "values", 0 ));
var endValue = _convertTo12Hour(timeSliderElm.slider("values", 1 ));
timeStartElm.val( startValue[0] + startValue[1] );
timeEndElm.val( endValue[0] + endValue[1] );

// get current date/time
var now = moment();

// format current day and display
currentDayElm.text(now.format("MMMM Do YYYY"));

//console.log(now.format("H")); // returns current time in 24 hour format without leading 0
//console.log(_convertTo12Hour(now.format("H")));

// setup event for changing time within start/end time inputs to have slider match
// TODO..

// loads up schedule
function loadSchedule()
{
    for (let i = 0; i < 25; i++) 
    {
        

        
    }
}


