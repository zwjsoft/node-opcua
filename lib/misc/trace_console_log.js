/* global console */
import colors from "colors";


const MOCHA_TRACELOG = process.env.MOCHA_TRACELOG ? parseInt(process.env.MOCHA_TRACELOG) : 0;

// a simple client that is design to crash in the middle of a connection
// once a item has been monitored
function trace_console_log() {
    const log1 = global.console.log;
    global.console.log = function () {

        if (MOCHA_TRACELOG == 0) { // as usual
            log1.apply(console, arguments);
            return;
        }

        const t = (new Error()).stack.split("\n")[2];
        if (t.match(/opcua/) && !t.match(/node_modules/)) {
            if (MOCHA_TRACELOG == 3) { // mask all
                return;
            }
            if (MOCHA_TRACELOG == 2) { // DISPLAY ORIGN OF CONSOLE.LOG
                log1.call(console, "                     " + t.cyan);
            }
            log1.apply(console, arguments.join(" "));
        } else {

            log1.apply(console, arguments);
        }
    };
}
trace_console_log();

