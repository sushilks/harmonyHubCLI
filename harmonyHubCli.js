'use strict';
var events = require('events'),
    ArgumentParser = require('argparse').ArgumentParser,
    hutils = require('harmony-hub-util'),
    harmony_clients = {},
    first_hub = null,
    parser;

parser = new ArgumentParser({
    version : '0.0.1',
    addHelp: true,
    description: 'CLI for controlling Harmony HUB'
});
parser.addArgument(
    [ '-l', '--hub'],
    { help: 'ip address of the hub. if not provided a discovery will be performed to find it'}
);

parser.addArgument(
    [ '-r', '--read'],
    { help: 'Display supported activities/devices/commands that are programmed on the hub'}
);
parser.addArgument(
    [ '-a', '--activity'],
    { help: 'Select a activity'}
);
parser.addArgument(
    [ '-d', '--device'],
    { help: 'Selet a device'}
);
parser.addArgument(
    [ '-c', '--command'],
    { help: 'Selet a command to trigger. Device also needs to be specified when this is used.'}
);
var args = parser.parseArgs();

var read_list = ['activities', 'devices', 'commands'];

if (args.read !== null) {
    if (read_list.indexOf(args.read) === -1) {
        console.log(" For -r only supported options are " + read_list);
        process.exit(1);
    }
    if (read_list.indexOf(args.read) === 2 && args.device === null) {
        console.log(" For -r commands a device should be mentiond with -d <device name>.");
        console.log("   You can get a list of devices by running -r devices");
        process.exit(1);
    }
} else {
    if (args.command !== null && args.device === null) {
        console.log(" For executing a command with -c a device should be mentiond with -d <device name>.");
        console.log("   You can get a list of devices by running -r devices");
        process.exit(1);
    }
}



var ev = new events.EventEmitter();

// when a hub is found.
ev.on('found_a_hub', function (ip) {
    // for now only one hub
    // I dont have multiple so can't test it
    if (first_hub === null) {
        first_hub = ip;
        console.log("Connecting to hub at " + ip);
        harmony_clients[ip] = hutils.createHubClient(ip)
             .then(function (harmonyClient) {
                if (args.read !== null && read_list.indexOf(args.read) === 0) {
                    hutils.readHubActivities(harmonyClient, function (res) {
                        var cnt;
                        if (res.length === 0) {
                            console.log("\tUnable to find any activities on the Hub");
                        } else {
                            console.log(">List of Activities programmed on the Hub");
                            for (cnt = 0; cnt < res.length; cnt = cnt + 1) {
                                console.log("\t" + cnt + ". '" + res[cnt] + "'");
                            }
                        }
                        process.exit(0);
                    });
                } else if (args.read !== null && read_list.indexOf(args.read) === 1) {
                    hutils.readHubDevices(harmonyClient, function (res) {
                        var cnt;
                        if (res.length === 0) {
                            console.log("\tUnable to find any devices on the Hub");
                        } else {
                            console.log(">List of devices programmed on the Hub");
                            for (cnt = 0; cnt < res.length; cnt = cnt + 1) {
                                console.log("\t" + cnt + ". '" + res[cnt] + "'");
                            }
                        }
                        process.exit(0);
                    });
                } else if (args.read !== null && read_list.indexOf(args.read) === 2) {
                    hutils.readHubCommands(harmonyClient, args.device, function (res) {
                        var cnt;
                        if (res.length === 0) {
                            console.log("\tUnable to find any commands on the device:" + args.device);
                        } else {
                            console.log(">List of commands supported by device:" + args.device);
                            for (cnt = 0; cnt < res.length; cnt = cnt + 1) {
                                console.log("\t" + cnt + ". '" + res[cnt] + "'");
                            }
                        }
                        process.exit(0);
                    });
                } else if (args.command != null && args.device !== null) {
                    hutils.executeCommand(harmonyClient, args.device, args.command, function (res) {
                        if (res) {
                            console.log("Command '" + args.command + "' for device '" + args.device + "' executed successfully.");
                        } else {
                            console.log("Command '" + args.command + "' for device '" + args.device + "' failed to executed.");
                        }
                        process.exit(0);
                    });
                } else if (args.activity != null) {
                    hutils.executeActivity(harmonyClient, args.activity, function (res) {
                        if (res) {
                            console.log("Activity '" + args.activity + "' executed successfully.");
                        } else {
                            console.log("Activity '" + args.activity + "' failed to executed.");
                        }
                        process.exit(0);
                    });
                }
            });
    }
});

// Look for hubs if ip is not specified
// and use the first ip that's found
if (args.hub === null) {
    console.log('Starting hub Discovery');
    hutils.discoverHub(function (ip, add) {
        if (add) {
            console.log("  Hub Found at :" + ip);
            ev.emit('found_a_hub', ip);
        } else {
            ev.emit('lost_a_hub', ip);
        }
    });
} else {
    // if IP is provided just use that to trigger the commands
    ev.emit('found_a_hub', args.hub);
}

