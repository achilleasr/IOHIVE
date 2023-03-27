<template>
    <div class="block">
        <div :class="[selected ? 'selected' : '', 'apiary-item']">
            <div class="apiary-title">{{ name }}</div>
            <div class="apiary-status">
                <div class="apiary-hives">
                    <svg :class="selected ? 'hives-icon' : 'hives-icon-inverse'" viewBox="0 0 16 15" fill="none"
                        stroke="white" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="0.5" width="15" height="7" />
                        <rect x="0.5" y="7.5" width="15" height="7" />
                        <line x1="6" y1="3.5" x2="10" y2="3.5" />
                        <line x1="6" y1="10.5" x2="10" y2="10.5" />
                    </svg>10
                </div>
                <div class="apiary-notice">
                    <img v-if="selected" src="../assets/Hives/i_alert_selected.svg" />
                    <img v-else src="../assets/Hives/i_alert.svg" />
                </div>
            </div>
        </div>
        <div v-if="selected" class="apiary-selected-line"></div>
    </div>
</template>

<script>

export default {
    name: 'ApiaryItem',
    props: {
        selected: Boolean,
        name: String,
    }
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
    border: solid rgb(125, 125, 125) 3px;
    color: black;
    font-size: 1.1vw;
    width: 6vw;
    height: 6vw;
    border-radius: 0.8vw;
    padding: 0.6vw;

    transition: all 0.3s ease 0s;
}

.apiary-item:hover {
    box-shadow: 0px 15px 20px #575eae29;
    transform: translateY(-4px);
}

.apiary-item:active {
    transform: translateY(-1px);
}

.selected {
    background-color: #575EAE;
    color: white;
    border: solid #575EAE 3px;
}

.apiary-hives {
    display: flex;
    align-items: center;
    justify-content: center;
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

/* .apiary-notice svg {
    fill: black;
} */

.apiary-status {
    display: flex;
    justify-content: space-around;
}

.apiary-notice img {
    height: 1.5vw;
    width: 1.5vw;
    stroke: white;
    fill: white;
}
</style>