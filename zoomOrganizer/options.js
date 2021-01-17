$(function(){

    chrome.storage.sync.get('meetingTime',function(zoom){
        $('#meetingTime').val(zoom.meetingTime);
    });

    $('#saveTime').click(function(){
        var meetingTime = $('#meetingTime').val();
        if (meetingTime){
            chrome.storage.sync.set({'meetingTime': meetingTime}, function(){
                close();
            });
        }
    });

    $('#resetTotal').click(function(){
        chrome.storage.sync.set({'total': 0}, function(){
          
            var notifOptions = {
                type: "basic",
                iconUrl: "icon48.png",
                title: "Resetting Total",
                message: "Total has been reset to 0."
            };
           
            chrome.notifications.create('resetNotif', notifOptions);
           
        });
    });
});