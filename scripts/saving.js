const SAVE_KEY = "kaizo-save";

const getInitialPlayerData = () => {
    var data = {
        points: DC.D0,
        total_points: DC.D0,

        prestige_points: DC.D0,

        kaizo: {
            amount: DC.D1,
            unspent: DC.D1,
            time: 0,
            active: false,
            perks: {},
        },

        powers: DC.D0,
        point_dimensions: [],

        upgrades: {},
        auto_upgrades: {},

        time_played: 0,
        last_played: Date.now(),
    }

    for (id in game.upgrades) {
        data.upgrades[id] = DC.D0;
        data.auto_upgrades[id] = false;
    }
    for (let i = 0; i < 10; i++) data.point_dimensions.push({amount: DC.D0, bought1: DC.D0, bought2: DC.D0});

    return data
}

player = getInitialPlayerData();

function deepCheck(obj,data) {
    for (var [key, value] of Object.entries(data)) {
        if (obj[key]) {
            if (value instanceof Decimal) obj[key] = isNaN(obj[key]) ? value : D(obj[key]);
            else if (typeof value === "number") obj[key] = isNaN(obj[key]) ? value : Number(obj[key]);
            else if (typeof value === "object") deepCheck(obj[key], value);
        } else obj[key] = value;
    }

    return obj
}

function save() {
    console.log("Game Saved")
    localStorage.setItem(SAVE_KEY, btoa(JSON.stringify(player)));
}

function load(x) {
    if (typeof x == "string" && x != '') {
        loadPlayer(JSON.parse(atob(x)))
    } else {
        player = getInitialPlayerData();
    }
}

function loadPlayer(load) {
    console.log("Loaded")
    const DATA = getInitialPlayerData();
    player = deepCheck(load, DATA);
}

function exporty() {
    let str = btoa(JSON.stringify(player))
    if (findNaN(str, true)) {
        return
    }
    save();
    export_file(str,"Kaizo Incremental Save - "+new Date().toGMTString())
}

function export_copy() {
    let str = btoa(JSON.stringify(player))
    if (findNaN(str, true)) {
        return
    }

    copy_clipboard(str)

    console.log("Copied to Clipboard")
}

function copy_clipboard(t) {
    let copyText = document.getElementById('copy')
    copyText.value = t
    copyText.style.visibility = "visible"
    copyText.select();
    document.execCommand("copy");
    copyText.style.visibility = "hidden"
}

function export_file(t, name="text") {
    let file = new Blob([t], {type: "text/plain"})
    window.URL = window.URL || window.webkitURL;
    let a = document.createElement("a")
    a.href = window.URL.createObjectURL(file)
    a.download = name+".txt"
    a.click()
}

function importy() {
    let loadgame = prompt("Paste in your save WARNING: WILL OVERWRITE YOUR CURRENT SAVE")
    if (loadgame != null) {
        let keep = player
        setTimeout(()=>{
            try {
                if (findNaN(loadgame, true)) return;
                localStorage.setItem(SAVE_KEY, loadgame)
                location.reload()
            } catch (error) {
                console.error("Failed Importing")
                player = keep
            }
        }, 200)
    }
}

function importy_file() {
    let a = document.createElement("input")
    a.setAttribute("type","file")
    a.click()
    a.onchange = ()=>{
        let fr = new FileReader();
        fr.onload = () => {
            let loadgame = fr.result
            if (findNaN(loadgame, true)) {
				console.error("Error Importing, because it got NaNed")
				return
			}
            localStorage.setItem(SAVE_KEY, loadgame)
			location.reload()
        }
        fr.readAsText(a.files[0]);
    }
}

function findNaN(obj, str=false, data=getInitialPlayerData()) {
    if (str ? typeof obj == "string" : false) obj = JSON.parse(atob(obj))
    for (let x = 0; x < Object.keys(obj).length; x++) {
        let k = Object.keys(obj)[x]
        if (typeof obj[k] == "number") if (isNaN(obj[k])) return true
        if (str) {
            if (typeof obj[k] == "string") if (data[k] == null || data[k] == undefined ? false : data[k] instanceof Decimal) if (D(obj[k]).isNan()) return true
        } else {
            if (obj[k] == null || obj[k] == undefined ? false : obj[k] instanceof Decimal) if (obj[k].isNan()) return true
        }
        if (typeof obj[k] == "object") return findNaN(obj[k], str, data[k])
    }
    return false
}

function wipe() {
    if (confirm("Are you sure you want to wipe your save?")) {
        localStorage.removeItem(SAVE_KEY)
        onLoad("")
        location.reload()
    }
}