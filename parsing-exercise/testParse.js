import LocalDateTime from java.time
import DateTimeFormatter from java.time

text_input = FileReader.readasText("test1.txt");

// Get Meeting ID (Meeting ID: XXX XXXX XXXX)
// IDEA: Save Meeting ID as Number instead of String
var id_index = text_input.search("Meeting ID: ") + 12;
if (id_index - 12 > -1) {
  // Read in ID and store for this meeting
  var id_content = text_input.substr(id_index, 13);
  print(id_content);
} else {
  // Missing keywords; assume no ID given
  print("not found");
}

// Get Passcode (Passcode: [Until a space is reached]) (10char max, 1char min)
var pw_index = text_input.search("Passcode: ") + 10;
if (pw_index - 10 > -1) {
  var buf_char = '';  // Character buffer to store passcode and signal stop
  var pw_content = '';
  for (var i = 0; i < 10; i++) {
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
  // Store passcode and display to user
  print(pw_content);
} else {
  // No password found; leave blank (to avoid confusion)
  print("no password found");
}

// Get Date & Time (HINT: All months are abbreviated to three letters)
var date_array = '';
var date_content = [];
var date_convert = '';

//  General Form: [3-ltr month] [1 or 2-num day], [4-num year] [AM/PM]
var date_regex_am_pm = /\D{3}\s\d\d?,\s\d{4}\s\d\d?:\d{2}\s[AP]M/gm;
var date_regex = /\D{3}\s\d\d?,\s\d{4}\s\d\d?:\d{2}\s/gm;
var date_index = text_input.search("Time: ");
if (date_index < 0) {
  // Missing keyword; ignore invite dates
  print("nope");
} else {
  // Look for all dates and times
  date_array = text_input.match(date_regex_am_pm);
  formatter = new DateTimeFormatter(DateTimeFormatter.ofPattern("MMM dd, uuuu hh:mm:ss aa"));

  // Check for 24 hour formatting
  if (date_array.length == 0) {
    formatter = new DateTimeFormatter(DateTimeFormatter.ofPattern("MMM dd, uuuu kk:mm:ss"));
    date_array = text_input.match(date_regex);
  }

  if (date_array.length === 1) {
    // Only one date/time found
    dt = new LocalDateTime(LocalDateTime.parse(date_array[0], formatter));
    var formattedString = localDate.format(formatter);
    print(formattedString);
  } else if (date_array.length > 1) {
    // Multiple dates/times found; ignore the first one as it is repeated later
    for (var i = 1; i < date_array.length; i++) {
      dt = new LocalDateTime(LocalDateTime.parse(date_array[i], formatter));
      date_content.push(dt);
    }

    for (var i = 1; i < date_content.length; i++) {
      var formattedString = date_content[i].format(formatter);
      print(formattedString);
    }

    // Print out the first date/time and the number of remaining occurances
    print(date_content[i].format(formatter) + ' and ' + (date_content.length - 1) + ' other occurance(s).');
  }
}
