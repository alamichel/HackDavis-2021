$(function(){

    // Enlightenment:
    //   chrome.storage.sync - Syncs with user that is logged in
    //      MAX_ITEMS = 512 (max. num. of items that can be stored in sync storage)
    //   chrome.storage.local - Stays on local browser/machine
    //      QUOTA_BYTES = 5242880 (max. amt. in bytes of data that can be stored in local storage);
    //          ignored if unlimitedStorage permission is enabled

    chrome.storage.sync.get(['meeting_id', 'passcode', 'date_time'], function(agenda){
        $('#meeting_id').text(agenda.meeting_id);
        $('#passcode').text(agenda.passcode);
        $('#date_time').text(agenda.date_time);
    });

    $('#convert').click(function(){
        chrome.storage.sync.get(['meeting_id', 'passcode', 'date_time'], function (agenda){
            
            // Get Meeting ID (Meeting ID: XXX XXXX XXXX)
            var text_input = document.getElementById('message').value;
            var id_index = text_input.search("Meeting ID: ") + 12;
            if (id_index - 12 > -1){
                var id_content = text_input.substr(id_index, 13);
                $('#meeting_id').text(id_content);
            } else {
                $('#meeting_id').text("NOT FOUND");
            }
            
            // Get Passcode (Passcode: [Until a space is reached]) (10char max, 1char min)
            var pw_index = text_input.search("Passcode: ") + 10;
            if (pw_index - 10 > -1){
                var buf_char = '';
                var pw_content = '';
                for (var i = 0; i < 10; i++){
                    // If char @cur_pos, cat to output; break when we reach end of passcode
                    if (i === 0) {
                        pw_content = text_input.charAt(pw_index);
                    } else {
                        buf_char = text_input.charAt(pw_index + i);
                        if (buf_char.includes(' ') || buf_char.includes('\0')) {
                            break;
                        } else {
                            pw_content += buf_char;
                        }
                    }
                }
                $('#passcode').text(pw_content);
            } else {
                $('#passcode').text('');
            }

            // Get Date & Time (HINT: All months are abbreviated to three letters)
            //  General Form: [3ltr month] [1/2 num day], [4 num year] [AM/PM]
            //  Genl. Form (end of 1st line): [Time Zone] Time ([Region])
            //      --> region info not as important as time zone
            buf_char = '';
            var date_array = '';
            var date_content = [];
            var date_convert = '';
            var date_regex = /\D{3}\s\d\d?,\s\d{4}\s\d\d?:\d{2}\s[AP]M/gm;
            var date_index = text_input.search("Time: ");
            if (date_index < 0) {
                // Missing keyword; ignore invite dates
                $('#date_time').text('');
            } else {
                // Look for all dates and times
                date_array = text_input.match(date_regex);

                if (date_array.length === 1) {
                    // Only one date/time found
                    date_content = new Date(date_array[0]);
                    $('#date_time').text(date_content);
                } else if (date_array.length > 1) {
                    // Multiple dates/times found; ignore the first one as it is repeated later
                    for (var i = 1; i < date_array.length; i++) {
                        date_convert = new Date(date_array[i]);
                        date_content.push(date_convert);
                    }

                    // Print out the first date/time and the number of remaining occurances
                    $('#date_time').text(date_content[1] + ' and ' + (date_content.length - 1) + ' other occurance(s).');
                }
            }
        }); 
    });
});