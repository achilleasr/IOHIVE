<template>
    <div class="hive-item-expanded-content" v-if="expanded">
        <div class="expanded-flex-grid">
            <div class="expanded-first-col">
                <div class="expanded-grid-frames">
                    <WatchItem title="Nº Frames" val="3" />
                </div>
                <div class="expanded-grid-population"></div>
            </div>
            <div class="expanded-second-col">
                <div class="expanded-grid-food"></div>
                <div class="expanded-grid-second-group">
                    <div class="expanded-grid-honey"></div>
                    <div class="expanded-grid-pollen"></div>
                </div>
            </div>
            <div class="expanded-third-col">
                <div class="expanded-grid-brood"></div>
                <div class="expanded-grid-third-group">
                    <div class="expanded-grid-capped"></div>
                    <div class="expanded-grid-open"></div>
                    <div class="expanded-grid-egg"></div>
                </div>
            </div>
            <div class="expanded-fourth-col">
                <div class="expanded-grid-queen"></div>
                <div class="expanded-grid-impression"></div>
                <div class="expanded-grid-attention"></div>
            </div>
        </div>
    </div>
</template>
<script>
import WatchItem from './WatchItem.vue';

export default {
    name: 'ExpanedContent',
    components: {
        WatchItem,
    },
    props: {
        expanded: Boolean,
    }
}
</script>
<style scoped>
.hive-item-expanded-content {
    /* height: 30vw; */
    transition: all 0.15s ease 0s;
}

.expanded-flex-grid {
    display: flex;
    height: 20vw;
    gap: 6px;
    padding: 2vw 0px;
}

.expanded-first-col {
    flex: 2;
    /* background-color: blue; */
    display: flex;
    gap: 6px;
    flex-direction: column;
    align-items: center;
}

.expanded-grid-frames {
    flex: 1;
    border: white 1px solid;
    width: fit-content;
    aspect-ratio: 1;
}

.expanded-grid-population {
    flex: 1;
    border: white 1px solid;
    width: fit-content;
    aspect-ratio: 1;
}

.expanded-second-col {
    flex: 4;
    background-color: blueviolet;
    border: white 1px solid;
}

.expanded-third-col {
    flex: 4;
    background-color: blue;
    border: white 1px solid;
}

.expanded-fourth-col {
    flex: 1;
    background-color: blueviolet;
}
</style>