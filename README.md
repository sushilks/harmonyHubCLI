# harmonyHubCLI
CLI to navigate/execute the commands on harmony hub.


## What is it
----------
Provides a standard command line CLI for navigating the harmony hub and executing commands on it.
All the work/code has been done by harmonyhubjs-client package (https://github.com/swissmanu/harmonyhubjs-client)
This program just wraps it up and provides a command line interface.


## Pre-requisites
--------------
Latest Node.js needs to be installed.


## Installation
------------
Git checkout the repository
run the following commands
```
npm install
```

## Example Usages
--------------

The Example results are shown based on how my hub is setup.

### Getting help::
```
>node harmonyHubCLI.js -h
usage: harmonyHubCLI.js [-h] [-v] [-l HUB] [-r READ] [-a ACTIVITY] [-d DEVICE]
                        [-c COMMAND]


CLI for controlling Harmony HUB

Optional arguments:
  -h, --help            Show this help message and exit.
  -v, --version         Show program's version number and exit.
  -l HUB, --hub HUB     ip address of the hub. if not provided a discovery
                        will be performed to find it
  -r READ, --read READ  Display supported activities/devices/commands that
                        are programmed on the hub
  -a ACTIVITY, --activity ACTIVITY
                        Select a activity
  -d DEVICE, --device DEVICE
                        Select a device
  -c COMMAND, --command COMMAND
                        Select a command to trigger. Device also needs to be
                        specified when this is used.

```

### Getting list of activities programmed with auto discovery
For the first run you may not be aware of the ip address used by your hub,
no-problem just run the cli without "-l" option and the cli will try to discover the hub.
The IP address of the hub will be on the output of the CLI.

#### Without hub ip address
```
>node harmonyHubCLI.js  -r activities
Starting hub Discovery
  Hub Found at :10.0.1.39
Connecting to hub at 10.0.1.39
List of Activities programmed on the Hub
    0. 'PowerOff'
    1. 'Play PS3'
    2. 'Listen to Digital Music'
    3. 'Listen to Radio'
    4. 'Watch a Movie'
    5. 'Watch Tivo'
```
#### With hub ip address
This will be a faster way to execute the same.
```
>node harmonyHubCLI.js -l 10.0.1.39 -r activities
Connecting to hub at 10.0.1.39
List of Activities programmed on the Hub
    0. 'PowerOff'
    1. 'Play PS3'
    2. 'Listen to Digital Music'
    3. 'Listen to Radio'
    4. 'Watch a Movie'
    5. 'Watch Tivo'
```
### Getting list of devices
```
>node harmonyHubCLI.js -l 10.0.1.39 -r devices
Connecting to hub at 10.0.1.39
List of devices programmed on the Hub
    0. 'Amplifier'
    1. 'Digital Music Server'
    2. 'TV Room  Sonos (CONNECT)'
    3. 'TV'
    4. 'AV Receiver-Living Room'
    5. 'Sony PS4'
    6. 'PVR'
    7. 'Audio/Video Switch'
```

### Getting a list of commands supported by one of the devices
```
>node harmonyHubCLI.js -l 10.0.1.39 -d 'Amplifier' -r commands
Connecting to hub at 10.0.1.39
List of commands supported by device:Amplifier
    0. 'PowerOff'
    1. 'PowerOn'
    2. 'PowerToggle'
    3. 'Mute'
    4. 'VolumeDown'
    5. 'VolumeUp'
    6. 'ChannelDown'
    7. 'ChannelUp'
    8. 'DimToggle'
    9. 'Input1'
    10. 'Input2'
    11. 'Input3'
    12. 'Input4'
    13. 'Input5'
    14. 'InputDown'
    15. 'InputNext'
    16. 'InputUp'
    17. 'MuteOff'
    18. 'MuteOn'
```

### Getting a list of commands supported when an activity is on
```
>node harmonyHubCLI.js  -l 10.0.1.39 -a 'Watch Tivo' -r commands
Connecting to hub at 10.0.1.39
List of commands supported by activity:Watch Tivo
    0. 'NumericBasic,0'
    1. 'NumericBasic,1'
    2. 'NumericBasic,2'
    3. 'NumericBasic,3'
    4. 'NumericBasic,4'
    5. 'NumericBasic,5'
    6. 'NumericBasic,6'
    7. 'NumericBasic,7'
    8. 'NumericBasic,8'
    9. 'NumericBasic,9'
    10. 'Volume,Mute'
    11. 'Volume,Volume Down'
    12. 'Volume,Volume Up'
    13. 'Channel,Prev Channel'
    14. 'Channel,Channel Down'
    15. 'Channel,Channel Up'
    16. 'NavigationBasic,Direction Down'
    17. 'NavigationBasic,Direction Left'
    18. 'NavigationBasic,Direction Right'
    19. 'NavigationBasic,Direction Up'
    20. 'NavigationBasic,Select'
    21. 'TransportBasic,Stop'
    22. 'TransportBasic,Play'
    23. 'TransportBasic,Rewind'
    24. 'TransportBasic,Pause'
    25. 'TransportBasic,Fast Forward'
    26. 'TransportRecording,Record'
    27. 'TransportExtended,Frame Advance'
    28. 'NavigationDVD,Top Menu'
    29. 'NavigationDVD,Menu'
    30. 'NavigationDSTB,Live'
    31. 'TiVo,Thumbs Down'
    32. 'TiVo,Thumbs Up'
    33. 'TiVo,TiVo'
    34. 'NavigationExtended,Guide'
    35. 'NavigationExtended,Info'
    36. 'NavigationExtended,Backspace'
    37. 'DisplayMode,Aspect'
```


### Trigger a command
Once you have been able to identify the devices and the commands they support,
you can make a note of the command that are of interest and then execute those specific commands.
Here is a sample to decrease the volume on the TV.

```
>node harmonyHubCLI.js -l 10.0.1.39 -d 'TV' -c 'VolumeDown'
Connecting to hub at 10.0.1.39
Triggering On device TV command VolumeDown
Sending Action = action={"command"::"VolumeDown","type"::"IRCommand","deviceId"::"xxxxxxxx"}:status=press
Command 'VolumeDown' for device 'TV' executed successfully.
```

### Trigger an activity
Similarly you may want to trigger an activity.

Here is an example to trigger the activity called 'Watch a Movie'

```
>node harmonyHubCLI.js -l 10.0.1.39  -a 'Watch a Movie'
Connecting to hub at 10.0.1.39
Starting Activity Watch a Movie
Activity 'Watch a Movie' executed successfully.
```

Here is an example to trigger turning every thing off

```
>node harmonyHubCLI.js -l 10.0.1.39  -a 'PowerOff'
Connecting to hub at 10.0.1.39
Starting Activity PowerOff
Activity 'PowerOff' executed successfully.
```


### Trigger a command within an activity

```
>node harmonyHubCLI.js  -l 10.0.1.39 -a 'Watch Tivo' -c 'Volume,Mute'
Connecting to hub at 10.0.1.39
Triggering On Activity Watch Tivo command Volume,Mute
Command 'Volume,Mute' for activity 'Watch Tivo' executed successfully.
```

### Execute multiple commands, 
```
> node harmonyHubCLI.js -l 10.0.1.39 -d 'PVR'   -c '["7","1", "0"]' -m
Connecting to hub at 10.0.1.39
Triggering On device PVR command 7
Triggering On device PVR command 1
Triggering On device PVR command 0
Command '["7","1", "0"]' for device 'PVR' executed successfully.
```

### Execute multiple commands on an activity,
```
>node harmonyHubCLI.js -l 10.0.1.39 -a 'Watch Tivo'  -c '["NumericBasic,5", "NumericBasic,5", "NumericBasic,0"]' -m
Connecting to hub at 10.0.1.39
execute command received
Triggering On Activity Watch Tivo command NumericBasic,5
Triggering On Activity Watch Tivo command NumericBasic,5
Triggering On Activity Watch Tivo command NumericBasic,0
Command '["NumericBasic,5", "NumericBasic,5", "NumericBasic,0"]' for activity 'Watch Tivo' executed successfully.
```