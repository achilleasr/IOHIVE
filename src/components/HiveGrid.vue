<template>
    <div v-if="s" class="grid">
        <div class="col narrow">
            <div class="box sq">
                <WatchItem title="Nº Frames" :val="v(s.totalFrames)" />
            </div>
            <div class="box sq">
                <WatchItem title="Population" :val="v(s.population)" />
            </div>
        </div>

        <div class="col wide">
            <div class="head">
                <WatchItem title="Food" :val="v(s.honey) + v(s.pollen)" />
            </div>
            <div class="row">
                <WatchItem title="Honey" :val="v(s.honey)" />
                <WatchItem title="Pollen" :val="v(s.pollen)" />
            </div>
        </div>

        <div class="col wide">
            <div class="head">
                <WatchItem title="Brood" :val="brood" />
            </div>
            <div class="row">
                <WatchItem title="Capped" :val="v(s.brood)" />
                <WatchItem title="Open" :val="v(s.larvae)" />
                <WatchItem title="Egg" :val="v(s.eggs)" />
            </div>
        </div>

        <div class="col narrow">
            <div class="box sq">
                <WatchItem title="Queen" :val="s.queenSeen ? 1 : 0" :small="true" />
            </div>
            <div class="box sq">
                <WatchItem title="Overall Impression" :val="v(s.impression)" :small="true" />
            </div>
            <div class="box sq">
                <WatchItem title="Needs Attention" :boolVal="!!s.needsAttention" :small="true" />
            </div>
        </div>
    </div>
</template>

<script>
import WatchItem from './WatchItem.vue';

export default {
    name: 'HiveGrid',
    components: { WatchItem },
    props: { state: { type: Object, default: null } },
    computed: {
        s() { return this.state; },
        brood() { return this.v(this.s.eggs) + this.v(this.s.larvae) + this.v(this.s.brood); },
    },
    methods: {
        v(x) { const n = Number(x); return Number.isFinite(n) ? Math.round(n * 10) / 10 : 0; },
    },
};
</script>

<style scoped>
.grid {
    display: flex;
    height: 20vw;
    gap: 6px;
    padding: 2vw 0;
}

.col {
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: center;
}

.narrow {
    flex: 2;
}

.wide {
    flex: 4;
    border: 1px solid #fff;
}

.box {
    flex: 1;
    border: 1px solid #fff;
    width: fit-content;
}

.sq {
    aspect-ratio: 1;
}

.head {
    flex: 1;
    width: 85%;
    border-bottom: 1px solid #fff;
}

.row {
    display: flex;
    flex: 1;
    width: 100%;
    justify-content: space-evenly;
}
</style>