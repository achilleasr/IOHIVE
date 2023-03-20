<template>
    <div class="block">
        <div class="apiary-item">
            <div class="apiary-title">ISD-lab-Syros-001</div>
            <div class="apiary-status">
                <div class="apiary-hives">
                    <svg class="hives-icon" viewBox="0 0 16 15" fill="none" stroke="white"
                        xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="0.5" width="15" height="7" />
                        <rect x="0.5" y="7.5" width="15" height="7" />
                        <line x1="6" y1="3.5" x2="10" y2="3.5" />
                        <line x1="6" y1="10.5" x2="10" y2="10.5" />
                    </svg>10
                </div>
                <div class="apiary-notice"><img src="../assets/Hives/i_alert.svg" /></div>
            </div>
        </div>
        <div class="apiary-selected-line"></div>
    </div>
</template>

<style scoped>
.block {
    display: inline-block;
    margin-right: 2vw;
}

.block:last-child {
    margin-right: 0px;
}

.apiary-selected-line {
    margin-top: 0.6vw;
    background-color: #575EAE;
    height: 0.4vw;
}

.apiary-item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: center;
    background-color: #575EAE;
    color: white;
    font-size: 1.4vw;
    width: 8vw;
    height: 8vw;
    border-radius: 1.2vw;
    padding: 1vw;
}

.apiary-hives {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.3vw;
}

.hives-icon {
    height: 2vw;
    width: 2vw;
}

.apiary-status {
    display: flex;
    justify-content: space-around;
}

.apiary-notice img {
    height: 2.2vw;
    width: 2.2vw;
    stroke: white;
    fill: white;
}
</style>