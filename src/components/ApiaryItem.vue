<template>
    <div class="block">
        <div :class="[selectedApiaryName === name ? 'selected' : '', 'apiary-item']">
            <!-- <div class="apiary-circle-container">
                <div class="apiary-circle" :style="{ 'background-color': getApiaryColor() }"></div>
            </div> -->
            <div class="apiary-title">
                {{ name }}
            </div>
            <div class="apiary-status">
                <div class="apiary-hives">
                    <svg :class="selectedApiaryName === name ? 'hives-icon' : 'hives-icon-inverse'" viewBox="0 0 16 15"
                        fill="none" stroke="white" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="0.5" width="15" height="7" />
                        <rect x="0.5" y="7.5" width="15" height="7" />
                        <line x1="6" y1="3.5" x2="10" y2="3.5" />
                        <line x1="6" y1="10.5" x2="10" y2="10.5" />
                    </svg>{{ hives.length }}
                </div>
                <div v-if="alerted()" class="apiary-notice">
                    <img v-if="selectedApiaryName === name" src="../assets/Hives/i_alert_selected.svg" />
                    <img v-else src="../assets/Hives/i_alert.svg" />
                </div>
            </div>
        </div>
        <div v-if="selectedApiaryName === name" class="apiary-selected-line"></div>
    </div>
</template>

<script>

export default {
    name: 'ApiaryItem',
    props: {
        name: String,
        hives: Array,
        selectedApiaryName: String,
        apiary: Object,
    },
    methods: {
        alerted() {
            if (this.hives.filter(e => e.alert == true).length > 0) {
                return true;
            } else {
                return false;
            }
        },
        getApiaryColor() {
            if (this.apiary) {
                return this.apiary.color;
            }
            else {
                return '#379C5A';
            }
        }
    },
}
</script>
<style scoped>
.block {
    display: inline-block;
    margin-right: 2vw;
}



.block:last-child {
    margin-right: 0px;
}

.apiary-circle-container {
    position: absolute;

}

.apiary-circle {
    position: relative;
    top: -15px;
    left: -15px;
    width: 2vw;
    height: 2vw;
    border-radius: 20px;
    background-color: tomato;
    border: #3e4379;
}

.apiary-title {
    overflow-x: hidden;
}

.apiary-selected-line {
    margin-top: 0.6vw;
    background-color: #575EAE;
    height: 0.3vw;
}

.apiary-item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: center;
    background-color: #ffffff;
    border: solid rgb(125, 125, 125) 2px;
    color: black;
    font-size: 1.1vw;
    width: 6vw;
    height: 6vw;
    border-radius: 0.8vw;
    padding: 0.6vw;
    box-shadow: 1px 2px 2px #575eae29;
    transition: all 0.2s ease 0s;
}

.apiary-item:hover {
    box-shadow: 0px 15px 20px #575eae29;
    transform: translateY(-4px);
    cursor: pointer;
}

.apiary-item:active {
    transform: translateY(-1px);
}

.selected {
    background-color: #575EAE;
    color: white;
    border: solid #3e4379 2px;
}



/* .apiary-notice svg {
    fill: black;
} */

.apiary-status {
    display: flex;
    justify-content: space-around;
    position: relative;
    height: 1.5vw;
    width: 6vw;
}

.apiary-notice img {
    height: 1.5vw;
    width: 1.5vw;
    stroke: white;
    fill: white;
    position: absolute;
    right: 0.7vw;
}

.apiary-hives {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 0.7vw;
    gap: 0.2vw;
}

.hives-icon {
    height: 1.3vw;
    width: 1.3vw;
}

.hives-icon-inverse {
    height: 1.3vw;
    width: 1.3vw;
    stroke: black;
}
</style>