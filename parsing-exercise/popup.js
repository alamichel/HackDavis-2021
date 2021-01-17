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
            //  Sample RegExp (Genl. Form): \D{3}\s\d\d?,\s\d{4}\s\d\d?:\d{2}\s[AP]M
            // TO-DO: Redo code block to just depend on "Time: " keyword;
            //  Look into using RegExp to simplify code, allow for more general use
            buf_char = '';
            var date_content = '';
            var date_convert = '';
            // FOR MULTIPLE DATES/TIMES (Date Time: )
            var date_index = text_input.search("Date Time: ") + 11;
            if (date_index - 11 > -1) {
                var date_array = [];
                date_content = text_input.charAt(date_index++);
                while (buf_char !== 'M') {
                    buf_char = text_input.charAt(date_index++);
                    if (buf_char === '\0') {
                        break;
                    } else {
                        date_content += buf_char;
                    }
                }

                // TO-DO: Read in time zone specs; carry over to rest of dates in invite
                // @HERE: TEMPORARY FIX UNTIL TIME ZONE IS ADDRESSED


                // Add first date to array of dates
                date_convert = new Date(date_content);
                date_array.push(date_convert);

                // Ignore the reoccurrence details
                var end_parenthesis_count = 0;
                while (buf_char !== ')' && end_parenthesis_count !== 2) {
                    buf_char = text_input.charAt(date_index++);
                    if (buf_char === ')') {
                        end_parenthesis_count++;
                    }
                }

                // Skip the space/tab btwn the parenthesis and repeated date
                // Move to line with date; then skip it
                date_index += 6;
                while (buf_char !== 'M') {
                    buf_char = text_input.charAt(date_index++);
                    if (buf_char === '\0') {
                        break;
                    }
                }

                // Move to next line; start reading dates from here
                date_index += 6;
                // TO-DO: Need conditional to signal stop (e.g. next line is blank, EOF)
                // @HERE: TEMPORARILY USING EOF AS ENDPOINT
                while(buf_char !== '\0'){ 
                    date_content = text_input.charAt(date_index++);
                    while (buf_char !== 'M') {
                        buf_char = text_input.charAt(date_index++);
                        if (buf_char === '\0') {
                            break;
                        } else {
                            date_content += buf_char;
                        }
                    }
                    date_convert = new Date(date_content);
                    date_array.push(date_convert);
                    date_index += 6;
                }

                $('#date_time').text(date_array);
            } else {
                // FOR ONE DATE/TIME (Time: )
                date_index = text_input.search("Time: ") + 6;
                if (date_index - 6 > -1) {
                    date_content = text_input.charAt(date_index++);
                    while (buf_char !== '(') {
                        buf_char = text_input.charAt(date_index++);
                        if (buf_char === '\0' || buf_char === '(') {
                            break;
                        } else {
                            date_content += buf_char;
                        }
                    }
                    date_convert = new Date(date_content);
                    $('#date_time').text(date_convert[0]);
                } else {
                    $('#date_time').text('');
                }
            }
        }); 
    });
});