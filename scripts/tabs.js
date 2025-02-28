const TABS = [
    {
        unl: () => true,
        symbol: "κ",

        html() {
            return `<h3>Kaizo</h3><br class="sub-line">Your <b>Kaizo Tier</b> is <b>${player.kaizo.amount.format(0)}</b>.`
        },
    },{
        unl: () => true,
        symbol: "Op",

        html() {
            return `<h3>Options</h3>`
        },
    },{
        unl: () => KAIZO.active,
        symbol: "Pt",

        html() {
            return `You have <b>${player.points.format(0)} Points</b>.`
        },
    },{
        unl: () => KAIZO.active && KAIZO.perkOwned(2,1),
        symbol: "Pr",

        html() {
            return `<h3>The Prestige</h3><br class="sub-line">You have <b>${player.prestige_points.format(0)} Prestige Points (PP)</b>.<br class="sub-line"><i>It requires at least <b>${format(1e15)}</b> points to earn and resets your points and their upgrades.</i>`
        },
    },{
        unl: () => KAIZO.active && KAIZO.perkOwned(3,1),
        symbol: "PD",

        html() {
            return `You have <b>${player.powers.format(0)} Powers</b>.`
        },
    },
]

TABS.forEach((tab,i) => {
    tooltip_funcs['tab-btn-'+i] = tab.html ?? (() => "???");
})