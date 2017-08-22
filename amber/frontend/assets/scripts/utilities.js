/*
Utilities
 */

// Sets callbacks for a range of events
let buttons = {};
function setCallbackById(id, cb) {
    let item = document.getElementById(id);

    if (item === null) {
        console.error("No element with id " + id);
    }
    else {
        buttons[id] = item;
        item.onclick = cb;
        console.debug("Callback registered for " + id);
    }
}

// Python-like json functions
function dumps(obj) {
    return JSON.stringify(obj);
}
function loads(string) {
    return JSON.parse(string);
}

// Simplifies searching for elements
let elements = {};
function findById(id) {
    if (id in elements) {
        return elements[id]
    }

    let el = document.getElementById(id);
    if (el !== null) {
        elements[id] = el;
        return el
    }
    return null;
}
function findByClass(cls) {
    if (cls in elements) {
        return elements[cls]
    }

    let el = document.getElementsByClassName(cls);
    if (el[0] !== null) {
        elements[cls] = el[0];
        return el[0]
    }
    return null;
}

// Thanks SO
function addEvent(element, eventName, callback) {
    if (element.addEventListener) {
        element.addEventListener(eventName, callback, false);
    } else if (element.attachEvent) {
        element.attachEvent("on" + eventName, callback);
    } else {
        element["on" + eventName] = callback;
    }
}

function setImageSrc(el, src) {
    if (src === null) {
        el.style.display = "none";
    }
    else {
        el.style.display = "flex";
        el.setAttribute("src", src);
    }
}

function assert(condition, message) {
    if (!condition) {
        message = message || "Assertion failed";
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message; // Fallback
    }
}

function waitFor(cond, callback) {
    if (!cond) {
        setTimeout(waitFor, 150, cond, callback);
    }
    else {
        callback()
    }

}

const logSound = new Logger("Sound");

// SOUND PLAYER
class SoundPlayer {
    constructor () {
        this.currentSound = null;
        this.lastUrl = null;
    }

    playSound(url) {
        // Do not start playing again if it is the same sound
        if (this.lastUrl === url) {
            logSound.debug("Url is the same as current sound, not restarting...");
            return
        }

        if (this.currentSound !== null) {
            logSound.debug("Music was already playing, fading out...");

            this.currentSound.fade(1, 0, 750);
        }

        let bThis = this;

        this.lastUrl = url;
        this.currentSound = new Howl({
            src: [url],
            autoplay: true,
            preload: true,
            onend: function () {
                logSound.debug("Finished playing " + url);
                bThis.lastUrl = null;
            }
        });

        logSound.debug("Started playing: " + url)
    }

    fadeOut() {
        this.currentSound.fade(1, 0, 0.5);
        this.currentSound.stop();
        this.currentSound = null;
    }
}

// CONSTANTS
const Status = {
    "OK": "ok",
    "MISSING": "missing",
    "FORBIDDEN": "forbidden",
    "ERROR": "error"
};

const Action = {
    "new_item": "add_to_inventory",
    "to_room": "move_to"
};
