console.log('background running');

var meeting = '';

chrome.storage.sync.get('meetingTime',function(zoom){
    $('#meetingTime').val(zoom.meetingTime);
    meeting = zoom.meetingTime;
});

// alt+a command
chrome.commands.onCommand.addListener(function (command) {
    console.log('alt+a');
    var notifOptions = {
        type: "basic",
        iconUrl: "icon48.png",
        title: "Command Test",
        message: "Your meeting is starting soon."
    };

    chrome.notifications.create('commandNotif', notifOptions);

});

chrome.alarms.onAlarm.addListener(function (alarm) {
    if (alarm.data == "Meeting soon") {
        console.log('Less than 5 seconds till meeting');
        chrome.notifications.create('timeNotif', {
            type: "basic",
            iconUrl: "icon48.png",
            title: "Meeting soon",
            message: "Less than 5 seconds till meeting."
        });
    }
});

// alarm function

/*
    IDEA: Delay timer by the difference between current time and alarm time
*/
var now = new Date();
//var eventTime = new Date(document.getElementById('meetingTime'));
var eventTime = new Date(meeting.valueOf());
var alarmTime = new Date(eventTime.valueOf() - now.valueOf() - (5 * 1000)); // event - 5s === event - 5000ms
chrome.alarms.create("Meeting soon", { delayInMinutes: alarmTime.getMinutes() });

/* var ms = document.getElementById('meetingTime').valueAsNumber; // no access to meetingTime
var alarm = new Date(ms);
var alarmTime = new Date(alarm.getUTCFullYear(), alarm.getUTCMonth(), alarm.getUTCDate(), alarm.getUTCHours(), alarm.getUTCMinutes(), alarm.getUTCSeconds());
var differenceInMs = alarmTime.getTime() - (new Date()).getTime();

if (differenceInMs < 5000) {
    console.log('5 seconds till meeting');
    var notifOptions = {
        type: "basic",
        iconUrl: "icon48.png",
        title: "Meeting soon",
        message: "5 seconds till meeting."
    };

    chrome.notifications.create('timeNotif', notifOptions);
};
 */