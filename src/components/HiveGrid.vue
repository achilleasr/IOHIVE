<template>
    <div v-if="s" class="grid">
        <div class="frames-rect">
            <div v-for="f in frames" :key="f.key" class="cell">
                <span class="lbl">{{ f.label }}</span>
                <span class="val">{{ fmt1(s[f.key]) }}</span>
            </div>
        </div>

        <div class="meta-grid">
            <div v-for="m in metas" :key="m.label" class="cell box">
                <span class="lbl">{{ m.label }}</span>
                <span class="val">{{ m.value }}</span>
            </div>
        </div>
    </div>
</template>

<script>
const FRAMES = [
    { key: 'eggs', label: 'Eggs' },
    { key: 'larvae', label: 'Larvae' },
    { key: 'brood', label: 'Capped brood' },
    { key: 'honey', label: 'Honey' },
    { key: 'pollen', label: 'Pollen' },
    { key: 'empty', label: 'Empty' },
];
const POP = { 1: 'Weak', 2: 'Medium', 3: 'Strong' };
const COND = { 1: '😞', 2: '😐', 3: '😊' };

export default {
    name: 'HiveGrid',
    props: { state: { type: Object, default: null } },
    data() { return { frames: FRAMES }; },
    computed: {
        s() { return this.state; },
        metas() {
            const s = this.s;
            return [
                { label: 'Nº Frames', value: this.fmtTotal(s.totalFrames) },
                { label: 'Population', value: POP[s.population] || '—' },
                { label: 'Queen seen', value: this.bool(s.queenSeen) },
                { label: 'Impression', value: COND[s.impression] || '—' },
                { label: 'Needs attention', value: this.bool(s.needsAttention) },
            ];
        },
    },
    methods: {
        r1(v) { const n = Number(v); return Number.isFinite(n) ? Math.round(n * 10) / 10 : 0; },
        fmt1(v) { return this.r1(v).toFixed(1); },
        fmtTotal(v) { const n = this.r1(v); return Number.isInteger(n) ? String(n) : n.toFixed(1); },
        bool(v) { return v === true ? 'Yes' : v === false ? 'No' : '—'; },
    },
};
</script>

<style scoped>
.grid {
    display: flex;
    gap: 10px;
    padding: 1.2vw 0;
    align-items: stretch;
}

.frames-rect {
    flex: 3;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    border: 1px solid #fff;
    border-radius: 8px;
    overflow: hidden;
}

.frames-rect .cell {
    border-right: 1px solid rgba(255, 255, 255, .5);
    border-bottom: 1px solid rgba(255, 255, 255, .5);
}

.frames-rect .cell:nth-child(3n) {
    border-right: 0;
}

.frames-rect .cell:nth-child(n+4) {
    border-bottom: 0;
}

.meta-grid {
    flex: 2;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 6px;
}

.cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    padding: 6px 4px;
    min-width: 0;
    min-height: 3.4vw;
}

.box {
    border: 1px solid #fff;
    border-radius: 8px;
}

.lbl {
    font-size: .72vw;
    opacity: .75;
    text-transform: uppercase;
    letter-spacing: .04em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
}

.val {
    font-size: 1.25vw;
    font-weight: bold;
}

@media (max-width: 900px) {
    .grid {
        flex-direction: column;
    }

    .lbl {
        font-size: 9px;
    }

    .val {
        font-size: 15px;
    }

    .cell {
        min-height: 42px;
    }
}
</style>