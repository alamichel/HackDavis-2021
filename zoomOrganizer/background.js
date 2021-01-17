console.log('background running');

// alt+a command
chrome.commands.onCommand.addListener(function (command) {
    console.log('alt+a');
    var notifOptions = {
        type: "basic",
        iconUrl: "icon48.png",
        title: "Command Test",
        message: "Alt+A pressed."
    };

    chrome.notifications.create('commandNotif', notifOptions);

});

// alarm function
var ms = document.getElementById('meetingTime').valueAsNumber; // no access to meetingTime
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
