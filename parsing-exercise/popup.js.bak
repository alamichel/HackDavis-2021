$(function(){

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

            // Get Date & Time (Time: )
            // CURRENTLY FOR ONE DATE/TIME, NOT MULTIPLE
            buf_char = '';
            var date_content = '';
            var date_index = text_input.search("Time: ") + 6;
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
                 var date_convert = new Date(date_content);
                $('#date_time').text(date_convert);
            } else {
                $('#date_time').text('');
            }
        }); 
    });
});