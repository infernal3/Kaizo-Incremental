const KAIZO = {
    get active() { return player.kaizo.active },

    goals: [
        DC.D0, D(1e2),     D(1e3),     D(1e5),     D(1e8),     D(1e16),   D(1e21),   D(1e27),   D(1e36),   D(1e54),   D(1e114),
               D(1e140),   D(1e175),   D(1e210),   D(1e245),   D('e340'), D('e380'), D('e600'), D('e700'), D('e800'), D('e900'),
               D('e1000'), D('e1500'), D('e1750'), D('e2100'),
    ],

    get goal() { return this.goals[player.kaizo.amount] ?? DC.DINF },

    get percent() {
        let layer = Decimal.slog(this.goal.max(1), 10).sub(1).max(0).floor();

        let percent = game.currencies.points.total.iteratedlog(10,layer).div(this.goal.iteratedlog(10,layer)).clamp(0,1)

        return Decimal.isNaN(percent) ? 0 : percent.toNumber()
    },

    get penalty() {
        var p = {}, k = player.kaizo.amount;

        p.points = k.scale(10,2,"P").scale(5,2,"L").div(KAIZO.perkEffect(1,9)).sub(1).mul(.2).add(1).root(2);

        return p
    },

    symbols: " αβγδεζηθικλμνξοπρστυφχψω",
    perks: [
        null,
        [
            null,
            {
                get description() { return `Start generating <b>Points</b> every second.` },
            },{
                get description() { return `<b>Kaizo Tier</b> boosts <b>Points</b>.` },
                effect() { return Decimal.add(2,Upgrade.getEffect("point\\3")).pow(player.kaizo.amount) },
                effDesc: x => formatMult(x),
            },{
                get description() { return `<b>Points</b> boost themselves.` },
                effect() { return game.currencies.points.total.add(10).log10().pow(Decimal.add(2,Upgrade.getEffect("point\\4")).add(KAIZO.perkEffect(1,7))) },
                effDesc: x => formatMult(x),
            },{
                get description() { return `Unlock <b>Point Upgrades</b>.` },
            },{
                get description() { return `Unlock more <b>Point Upgrades</b>. Automate <b>Point Upgrades</b>.` },
            },{
                get description() { return `<b>Point Generator</b> scales slower.` },
            },{
                get description() { return `<b>Kaizo Tier</b> boosts the base of <b>Better Point Generator</b> and the exponent of <b>α<sub>3</sub></b> perk.` },
                effect() {
                    return player.kaizo.amount.mul(.05)
                },
                defaultEffect: DC.D0,
                effDesc: x => formatPlus(x),
            },{
                get description() { return `Unlock more <b>Point Upgrades</b> again.` },
            },{
                get description() { return `<b>Kaizo Penalty</b> is weaker based on your total points.` },
                effect() {
                    return game.currencies.points.total.add(1).slog(10).div(10).add(1)
                },
                effDesc: x => formatPercent(Decimal.sub(1,x.pow(-1))),
            },
        ],[
            null,
            {
                get description() { return `Unlock <b>Prestige</b>. <i>It requires at least <b>${format(1e15)}</b> points to earn.</i>` },
            },{
                get description() { return `<b>Kaizo Tier</b> boosts <b>Prestige Points</b>.` },
                effect() {
                    let k = player.kaizo.amount.sub(1)
                    return Decimal.add(1.1,Upgrade.getEffect("prestige\\4")).pow(k).mul(k.add(1))
                },
                effDesc: x => formatMult(x),
            },{
                get description() { return `<b>Kaizo Tier</b> boosts the exponent of <b>Prestige Points</b>' effect.` },
                effect() {
                    return player.kaizo.amount.mul(.25)
                },
                defaultEffect: DC.D0,
                effDesc: x => formatPlus(x),
            },{
                get description() { return `Unlock <b>Prestige Upgrades</b>.` },
            },{
                active: () => KAIZO.perkOwned(1,3),
                get description() { return `The <b>α<sub>3</sub></b> perk affects prestige points at a reduced rate. <i>Must have this perk to work.</i>` },
                effect() { return expPow(KAIZO.perkEffect(1,3),.5) },
                effDesc: x => formatMult(x),
            },{
                active: () => KAIZO.perkOwned(2,4),
                get description() { return `Unlock more <b>Prestige Upgrades</b>. <i>Must have <b>β<sub>4</sub></b> perk to work.</i>` },
            },{
                get description() { return `<b>More Prestige</b> scales slower.` },
            },{
                get description() { return `The base of <b>Prestige Points</b> is improved.` },
            },{
                get description() { return `The second <b>Prestige Upgrade</b> affects <b>More Prestige</b> linearly.` },
            },{
                get description() { return `The third <b>Prestige Upgrade</b> scales slower.` },
            },
        ],[
            null,
            {
                get description() { return `Unlock <b>Point Dimensions</b>.` },
            },{
                get description() { return `<b>Kaizo Tier</b> boosts the <b>Point Dimensions</b>' multiplier per bought.` },
                effect() {
                    return player.kaizo.amount.mul(.05)
                },
                defaultEffect: DC.D0,
                effDesc: x => formatPlus(x),
            },{
                get description() { return `<b>Kaizo Tier</b> boosts the exponent of <b>Powers</b>' effect.` },
                effect() {
                    return player.kaizo.amount.mul(.05)
                },
                defaultEffect: DC.D0,
                effDesc: x => formatPlus(x),
            },{
                get description() { return `<b>Points</b> boost <b>Point Dimensions</b>.` },
                effect() { return expPow(game.currencies.points.total.add(1),1/3) },
                effDesc: x => formatMult(x),
            },{
                get description() { return `<b>Prestige Points</b> boost <b>Point Dimensions</b>.` },
                effect() { return expPow(game.currencies.prestige.amount.add(1),.5) },
                effDesc: x => formatMult(x),
            },{
                get description() { return `Unlock <b>Point Tickspeed</b>.` },
            },{
                get description() { return `<b>Kaizo Tier</b> boosts the base of <b>Point Tickspeed</b>.` },
                effect() {
                    return player.kaizo.amount.mul(.005)
                },
                defaultEffect: DC.D0,
                effDesc: x => formatPlus(x,3),
            },{
                get description() { return `<b>Point Tickspeed</b> affects <b>Prestige Points</b>.` },
                effect() { return expPow(Upgrade.getEffect("power\\1"),.75) },
                effDesc: x => formatMult(x),
            },
        ],[
            null,
            {
                get description() { return `Unlock <b>Transcension</b>. <i>[NYI]</i>` },
            },
        ],
    ],
    perk_map: [
        null,
        {
            req: 1,
            map: [
                null,
                [[1]],
                [[2,3]],
                [[4]],
                [[5,6]],
                [[7],8],
                [[8,9],13],
            ],
        },{
            req: 5,
            bought: 5,
            map: [
                null,
                [[1]],
                [[2,3]],
                [[4,5]],
                [[6,7]],
                [[8],16],
                [[9,10]],
            ],
        },{
            req: 15,
            bought: 5,
            map: [
                null,
                [[1]],
                [[2,3]],
                [[4,5]],
                [[6],20],
                [[7,8]],
            ],
        },{
            req: 25,
            bought: 5,
            map: [
                null,
                [[1]],
            ],
        },
    ],

    perk_object_class(i,j,k) {
        var perk_map = KAIZO.perk_map[i];

        var inactive = false, bought = this.perkOwned(i,j,true), locked = false;

        if (game.active_perk_groups[i] && (this.perks[i][j]?.active?.() ?? true)) for (let l = 1; l < k; l++) {
            if (!perk_map.map[l][0].some(x => this.perkOwned(i,x,true))) {
                if (bought) inactive = true;
                else locked = true;
                break
            }
        }
        else {
            if (bought) inactive = true;
            else locked = true;
        }

        locked ||= !inactive && !bought && (this.active || player.kaizo.amount.lt(perk_map.req) || player.kaizo.unspent.lt(1) || player.kaizo.amount.lt(perk_map.map[k][1]));

        // console.log(inactive, bought, locked)

        return {inactive, bought, locked}
    },
    perkAction(i,j,k) {
        if (player.kaizo.active) return;

        if (this.perkOwned(i,j,true)) {
            player.kaizo.unspent = player.kaizo.unspent.add(1);
            player.kaizo.perks[i+";"+j] = false;
            this.updateTemp();
            return
        }

        var perk_map = KAIZO.perk_map[i];

        if (this.perkOwned(i,j) || !game.active_perk_groups[i] || player.kaizo.amount.lt(perk_map.req) || player.kaizo.unspent.lt(1)) return;

        k ??= perk_map.map.findIndex(x => x && x[0].includes(k));

        if (player.kaizo.amount.lt(perk_map.map[k][1])) return;
        for (let l = 1; l < k; l++) if (!perk_map.map[l][0].some(x => this.perkOwned(i,x,true))) return;

        player.kaizo.unspent = player.kaizo.unspent.sub(1);
        player.kaizo.perks[i+";"+j] = true;

        this.updateTemp();
    },
    perkOwned(i,j,active=game.active_perks[i+";"+j]) { return (active && player.kaizo.perks[i+";"+j]) ?? false },
    perkEffect(i,j) { return game.perk_effects[i+";"+j] },

    updateTemp() {
        if (!player.kaizo.active) {
            let active_group = true, boughts;

            for (let i = 1; i < this.perks.length; i++) {
                let m = this.perk_map[i]
                boughts = 0

                if (i > 1 && active_group && (game.bought_perks[i-1] < m.bought || !this.perkOwned(i-1,1,true))) active_group = false;
                game.active_perk_groups[i] = active_group;

                for (let j = 1; j < this.perks[i].length; j++) {
                    let p = this.perks[i][j], k = m.map.findIndex(x => x && x[0].includes(j)), active = true, owned = this.perkOwned(i,j,true);
                    if (owned) {
                        active = active_group && (p?.active?.() ?? true);
                        boughts++;

                        if (active) {
                            for (let l = 1; l < k; l++) if (!m.map[l][0].some(x => this.perkOwned(i,x,true))) {
                                active = false;
                                break;
                            }
                        }
                    }
                    game.active_perks[i+";"+j] = active
                    if ('effect' in p) game.perk_effects[i+";"+j] = owned && active ? p.effect() : p.defaultEffect ?? DC.D1;
                }

                game.bought_perks[i] = boughts;
            }
        }  
        else for (let i = 1; i < this.perks.length; i++) {
            for (let j = 1; j < this.perks[i].length; j++) {
                let p = this.perks[i][j];
                if ('effect' in p) game.perk_effects[i+";"+j] = this.perkOwned(i,j) ? p.effect() : p.defaultEffect ?? DC.D1;
            }
        }

        game.kaizo_penalty = KAIZO.penalty
    },

    action(bar=false) {
        if (!this.perkOwned(1,1,true) || bar && (!player.kaizo.active || game.currencies.points.total.lt(this.goal))) return;

        if (player.kaizo.active) {
            game.tab = 0

            if (game.currencies.points.total.gte(this.goal)) {
                player.kaizo.amount = player.kaizo.amount.add(1);
                player.kaizo.unspent = player.kaizo.unspent.add(1);

                document.getElementById('frontground').animate([{background: "#fff"},{background: "transparent"}], 1000)
            }
        } else {
            game.tab = 2
        }

        reset()
        
        updateTemp()

        player.kaizo.active = !player.kaizo.active
    },
    get actionButton() {
        return player.kaizo.active ? game.currencies.points.total.gte(this.goal) ? `Finish Kaizo` : `Give up` : this.perkOwned(1,1) ? `Begin Kaizo` : `Must buy the <b>α<sub>1</sub></b> perk first`;
    },
}

for (let i = 1; i < KAIZO.perks.length; i++) {
    for (let j = 1; j < KAIZO.perks[i].length; j++) {
        let p = KAIZO.perks[i][j]
        tooltip_funcs['kaizo-perk-' + i + '-' + j] = () => p.description + (game.active_perks[i+";"+j] ? '' : ' <b style="color: red">[INACTIVE]</b>') + ('effDesc' in p ? '<br class="sub-line"><b>Effect:</b> ' + p.effDesc(p.effect()) : '');
    }
}