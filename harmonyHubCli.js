'use strict';
var events = require('events'),
    HarmonyHubDiscover = require('harmonyhubjs-discover'),
    ArgumentParser = require('argparse').ArgumentParser,
    HarmonyUtils = require('harmony-hub-util'),
    first_hub = null,
    discover,
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
    { help: 'Display supported activities/devices/commands/status that are programmed on the hub'}
);
parser.addArgument(
    [ '-a', '--activity'],
    { help: 'Select a activity'}
);
parser.addArgument(
    [ '-d', '--device'],
    { help: 'Select a device'}
);
parser.addArgument(
    [ '-c', '--command'],
    { help: 'Select a command to trigger. Device also needs to be specified when this is used.'}
);
parser.addArgument(
    [ '-m', '--multi'],
    { help: 'Command is a list of multiple commands that is to be executed back to back',
    action: 'storeTrue', dest: 'multi'}
);

var args = parser.parseArgs();

var read_list = ['activities', 'devices', 'commands', 'status'];

if (args.read !== null) {
    if (read_list.indexOf(args.read) === -1) {
        console.log(" For -r only supported options are " + read_list);
        process.exit(1);
    }
    if (read_list.indexOf(args.read) === 2 && (args.device === null && args.activity === null)) {
        console.log(" For -r commands, mention either a device with -d <device name> or activity with -a <activity name>.");
        console.log("   You can get a list of devices by running -r devices");
        console.log("   You can get a list of activities by running -r activities");
        process.exit(1);
    }
} else {
    if (args.command !== null && (args.device === null && args.activity === null)) {
        console.log(" For executing a command with -c, mention either a device with -d <device name> or activity with -a <activity name>.");
        console.log("   You can get a list of activities by running -r activities");
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
        var dt = new HarmonyUtils(ip)
            .then(function (hutils) {
                if (args.read !== null && read_list.indexOf(args.read) === 3) {
                    hutils.readCurrentActivity().then(function (res) {
                        console.log("Current activity : " + JSON.stringify(res));
                    }, function (err) {
                        console.log("\tERROR Getting current activities on the Hub : " + err);
                    }).then(function () {
                        hutils.end();
                        if (args.hub === null) {
                            process.exit(0);
                        }
                    });
                } else if (args.read !== null && read_list.indexOf(args.read) === 0) {
                    hutils.readActivities().then(function (res) {
                        var cnt;
                        if (res.length === 0) {
                            console.log("\tUnable to find any activities on the Hub");
                        } else {
                            console.log("List of Activities programmed on the Hub");
                            for (cnt = 0; cnt < res.length; cnt = cnt + 1) {
                                console.log("\t" + cnt + ". '" + res[cnt] + "'");
                            }
                        }
                    }).then(function () {
                        hutils.end();
                        // harmoney hub discover does not cleanly exit.
                        if (args.hub === null) {
                            process.exit(0);
                        }
                    });
                } else if (args.read !== null && read_list.indexOf(args.read) === 1) {
                    hutils.readDevices().then(function (res) {
                        var cnt;
                        if (res.length === 0) {
                            console.log("\tUnable to find any devices on the Hub");
                        } else {
                            console.log("List of devices programmed on the Hub");
                            for (cnt = 0; cnt < res.length; cnt = cnt + 1) {
                                console.log("\t" + cnt + ". '" + res[cnt] + "'");
                            }
                        }
                    }).then(function () {
                        hutils.end();
                        if (args.hub === null) {
                            process.exit(0);
                        }
                    });
                } else if (args.read !== null && read_list.indexOf(args.read) === 2 && args.device !== null) {
                    hutils.readCommands(true, args.device).then(function (res) {
                        var cnt;
                        if (res.length === 0) {
                            console.log("\tUnable to find any commands on the device:" + args.device);
                        } else {
                            console.log("List of commands supported by device:" + args.device);
                            for (cnt = 0; cnt < res.length; cnt = cnt + 1) {
                                console.log("\t" + cnt + ". '" + res[cnt] + "'");
                            }
                        }
                    }).then(function () {
                        hutils.end();
                        if (args.hub === null) {
                            process.exit(0);
                        }
                    });
                } else if (args.read !== null && read_list.indexOf(args.read) === 2 && args.activity !== null) {
                    hutils.readCommands(false, args.activity).then(function (res) {
                        var cnt;
                        if (res.length === 0) {
                            console.log("\tUnable to find any commands for activity:" + args.activity);
                        } else {
                            console.log("List of commands supported by activity:" + args.activity);
                            for (cnt = 0; cnt < res.length; cnt = cnt + 1) {
                                console.log("\t" + cnt + ". '" + res[cnt] + "'");
                            }
                        }
                    }).then(function () {
                        hutils.end();
                        if (args.hub === null) {
                            process.exit(0);
                        }
                    });
                } else if (args.command !== null && args.device !== null) {
                    var cmd = args.command;
                    if (args.multi) {
                        try {
                            cmd = JSON.parse(args.command)
                        } catch(err) {
                            console.error(' Unable to parse the JSON in command list ' + args.command);
                            console.error(err);
                        }
                    }
                    hutils.executeCommand(true, args.device, cmd).then(function (res) {
                        if (res) {
                            console.log("Command '" + args.command + "' for device '" + args.device + "' executed successfully.");
                        } else {
                            console.log("Command '" + args.command + "' for device '" + args.device + "' failed to executed.");
                        }
                    }).then(function () {
                        hutils.end();
                        if (args.hub === null) {
                            process.exit(0);
                        }
                    });
                } else if (args.command !== null && args.activity !== null) {
                    var cmd = args.command;
                    if (args.multi) {
                        try {
                            cmd = JSON.parse(args.command)
                        } catch(err) {
                            console.error(' Unable to parse the JSON in command list ' + args.command);
                            console.error(err);
                        }
                    }
                    hutils.executeCommand(false, args.activity, cmd).then(function (res) {
                        if (res) {
                            console.log("Command '" + args.command + "' for activity '" + args.activity + "' executed successfully.");
                        } else {
                            console.log("Command '" + args.command + "' for activity '" + args.activity + "' failed to executed.");
                        }
                    }).then(function () {
                        hutils.end();
                        if (args.hub === null) {
                            process.exit(0);
                        }
                    });
                } else if (args.activity !== null) {
                    hutils.executeActivity(args.activity).then(function (res) {
                        if (res) {
                            console.log("Activity '" + args.activity + "' executed successfully.");
                        } else {
                            console.log("Activity '" + args.activity + "' failed to executed.");
                        }
                    }).then(function () {
                        hutils.end();
                        if (args.hub === null) {
                            process.exit(0);
                        }
                    });
                }
            });
    }
});


function discoverHub(callBackFn) {
    if (discover === null || discover === undefined) {
        discover = new HarmonyHubDiscover(61991);
    }
    discover.on('online', function (hub) {
        //console.log('discovered ' + hub.ip + '\n');
        callBackFn(hub.ip, true);
    });
    discover.on('offline', function (hub) {
        //console.log('lost ' + hub.ip);
        callBackFn(hub.ip, false);
    });
    discover.start();
}
function discoverHubStop() {
    if (discover !== null) {
        discover.end();
    }
}

// Look for hubs if ip is not specified
// and use the first ip that's found
if (args.hub === null) {
    console.log('Starting hub Discovery');
    discoverHub(function (ip, add) {
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

