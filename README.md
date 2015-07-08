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


## installation
------------
Git checkout the respoitory
run the following commands
> npm install

## Example Usages
--------------


### Getting help::
```
>node harmonyHubCli.js -h
usage: harmonyHubCli.js [-h] [-v] [-l HUB] [-r READ] [-a ACTIVITY] [-d DEVICE]
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
                        Selet a device
  -c COMMAND, --command COMMAND
                        Selet a command to trigger. Device also needs to be
                        specified when this is used.node harmonyHubCli.js -h

```

Rest of the results are shown based on how my hub is setup

### Getting list of activities programmed with auto discovery
```
>node harmonyHubCli.js  -r activities
Starting hub Discovery
  Hub Found at :192.168.xx.yy
Connecting to hub at 192.168.xx.yy
List of Activities programmed on the Hub
    0. 'PowerOff'
    1. 'Play PS3'
    2. 'Listen to Digital Music'
    3. 'Listen to Radio'
    4. 'Watch a Movie'
    5. 'Watch Tivo'
```

### A faster way to execute the same is to provide the hub ip address as an argument
```
>node harmonyHubCli.js -l 192.168.xx.yy -r activities
Connecting to hub at 192.168.xx.yy
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
>node harmonyHubCli.js -l 192.168.xx.yy -r devices
Connecting to hub at 192.168.xx.yy
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
>node harmonyHubCli.js -l 192.168.xx.yy -d 'Amplifier' -r commands
Connecting to hub at 192.168.xx.yy
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

### Trigger a command
```
>node harmonyHubCli.js -l 192.168.xx.yy -d 'TV' -c 'VolumeDown'
Connecting to hub at 192.168.xx.yy
Triggering On device TV command VolumeDown
Sending Action = action={"command"::"VolumeDown","type"::"IRCommand","deviceId"::"xxxxxxxx"}:status=press
Command 'VolumeDown' for device 'TV' executed successfully.
```

### Trigger an activity
```
>node harmonyHubCli.js -l 192.168.xx.yy  -a 'PowerOff'
Connecting to hub at 192.168.xx.yy
Starting Activity PowerOff
Activity 'PowerOff' executed successfully.
```