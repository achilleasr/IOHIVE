<template>
    <div class="expanded-flex-grid">
        <div class="expanded-first-col">
            <div class="expanded-grid-frames">
                <WatchItem title="Nº Frames" :val="8" />
            </div>
            <div class="expanded-grid-population">
                <WatchItem title="Population" :val="3" />
            </div>
        </div>
        <div class="expanded-second-col">
            <div class="expanded-grid-food">
                <WatchItem title="Food" :val="4" />
            </div>
            <div class="expanded-grid-second-group">
                <div class="expanded-grid-honey">
                    <WatchItem title="Honey" :val="2" />
                </div>
                <div class="expanded-grid-pollen">
                    <WatchItem title="Pollen" :val="2" />
                </div>
            </div>
        </div>
        <div class="expanded-third-col">
            <div class="expanded-grid-brood">
                <WatchItem title="Brood" :val="5" />
            </div>
            <div class="expanded-grid-third-group">
                <div class="expanded-grid-capped">
                    <WatchItem title="Capped" :val="1.25" />
                </div>
                <div class="expanded-grid-open">
                    <WatchItem title="Open" :val="1.25" />
                </div>
                <div class="expanded-grid-egg">
                    <WatchItem title="Egg" :val="2.5" />
                </div>
            </div>
        </div>
        <div class="expanded-fourth-col">
            <div class="expanded-grid-queen">
                <WatchItem title="Queen" :val="1" :small="true" />
            </div>
            <div class="expanded-grid-impression">
                <WatchItem title="Overall Impression" :val="3" :small="true" />
            </div>
            <div class="expanded-grid-attention">
                <WatchItem title="Needs Attention" :boolVal="false" :small="true" />
            </div>
        </div>
    </div>
</template>

<script>

import WatchItem from './WatchItem.vue';
export default {
    name: 'HiveGrid',
    components: {
        WatchItem,
    },
}
</script>

<style scoped>
.expanded-flex-grid {
    display: flex;
    height: 20vw;
    gap: 6px;
    padding: 2vw 0px;
    /* background-color: #379C5A;
    color: white; */
}

.expanded-first-col {
    flex: 2;
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
    border: white 1px solid;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.expanded-grid-food {
    flex: 1;
    width: 85%;
    border-bottom: white 1px solid;
}

.expanded-grid-second-group {
    display: flex;
    flex: 1;
    width: 100%;
    justify-content: space-evenly;
    /* align-items: space-around; */
}


.expanded-third-col {
    flex: 4;
    border: white 1px solid;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.expanded-grid-brood {
    flex: 1;
    width: 85%;
    border-bottom: white 1px solid;
}

.expanded-grid-third-group {
    display: flex;
    flex: 1;

    width: 100%;
    justify-content: space-evenly;
}

.expanded-fourth-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
}


.expanded-grid-queen {
    flex: 1;
    border: white 1px solid;
    width: fit-content;
    aspect-ratio: 1;
}

.expanded-grid-impression {
    flex: 1;
    border: white 1px solid;
    width: fit-content;
    aspect-ratio: 1;
}

.expanded-grid-attention {
    flex: 1;
    border: white 1px solid;
    width: fit-content;
    aspect-ratio: 1;
}
</style>