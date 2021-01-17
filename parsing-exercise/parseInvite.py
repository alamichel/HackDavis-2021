import re
import datetime as dt

topic = ''
occurences = []
zoomLink = ''
meetingID = ''
password = ''
timeZone = ''

# Update this path to whatever it needs to be
with open('C:\\Users\\jessi\\OneDrive - University of California, Davis\\programs\\hackDavis21\\test1.txt', "r") as invite:
    lines = invite.readlines()
    for line in lines:
        # Remove any leading/traiing whitespace
        line = line.strip()
        # Skip any blank lines
        if not line:
            continue
        else:
            match = re.search("\d\d:\d\d", line)
            # Check for topic
            if re.compile('Topic:').match(line):
                topic = line[6:].strip()
                continue
            # Check for time
            elif match is not None:
                plus12 = False
                pm = re.search("\d\d:\d\d PM", line)
                if pm is not None:
                    plus12 = True
                if re.compile('Time:').match(line) or re.compile('Date Time:').match(line):
                    line = line[5:].strip()
                    amPm = re.search("\d\d:\d\d [AP]M", line)
                    if amPm is not None:
                        timeZone = line[amPm.end():].strip()
                    else:
                        time = re.search("\d\d:\d\d", line)
                        timeZone = line[time.end():].strip()
                amPm = re.search("\d\d:\d\d [AP]M", line)
                if amPm is not None:
                    line = line[:amPm.end()-2].strip()
                # Jun 28 2018 07:40
                dtObject = dt.datetime.strptime(
                    line, '%b %d, %Y %H:%M')
                if plus12:
                    dtObject = dtObject.replace(
                        hour=dtObject.hour + 12)
                occurences.append(dtObject)
            elif re.compile('Every').match(line):
                # clear original time, since that will be included in the list of dates/times following this line
                occurences.clear()
            elif re.compile('https://').match(line):
                zoomLink = line.strip()
                continue
            elif re.compile('Meeting ID:').match(line):
                meetingID = line[11:].strip()
            elif re.compile('Password:').match(line):
                password = line[9:].strip()

print(f"Topic: {topic}\n")
print(f"Zoom Link: {zoomLink}\n")
print(f"Meeting ID: {meetingID}")
if password != '':
    print(f"Password: {password}")
print(f"\nHost Time Zone: {timeZone}")
print("Meeting occurences:")
for occurence in occurences:
    print(occurence.strftime("\t%B %d %Y at %I:%M %p"))
