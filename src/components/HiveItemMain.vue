<template>
    <div class="hive-item-edit">
        <div>EDIT</div> <img src="../assets/Hives/i_edit.svg" />
    </div>

    <h2 class="hive-item-title"> {{ hive.name }} <span v-if="hive.alert">
            <img src="../assets/Hives/i_alert_selected.svg" />
        </span></h2>

    <div class=" hive-item-info">
        <div class="hive-item-icon"><img src="../assets/Hives/i_hives3.svg" /></div>
        <div class="hive-item-text">
            <div class="hive-item-location"><img src="../assets/Hives/i_location_pin.svg" /> Apano Meria, Syros {{
                hive.coordinates[0] + " " + hive.coordinates[1] }}</div>
            <div class="hive-item-description">Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Veritatis, distinctio quia. Tenetur dicta inventore dignissimos rem necessitatibus architecto
                vel corporis nostrum magnam aliquid. Dolor cupiditate, tenetur recusandae praesentium modi fuga?
            </div>
        </div>
        <div class="hive-item-status">
            <p>ON </p><img src="../assets/Hives/i_status.svg" />
            <p>Device:<br>Sensor 2</p>
        </div>
    </div>
    <div class="hive-item-inspection">
        <img src="../assets/Hives/i_arrow_down.svg" class="clickable" :class="{ rotated180: expanded }"
            @click="expandContentButton" />
        <span @click="expandContentButton" class="clickable"> Latest Inspection: Aug 20, 2022 10:07AM </span>
        <!-- {{ hive.inspections[0] }} -->
    </div>
</template>

<script>
export default {
    name: 'HiveItemMain',
    props: {
        hive: Object,
    },
    data() {
        return {
            expanded: false,
        }
    },
    methods: {
        expandContentButton() {
            this.expanded = !this.expanded;
            this.$emit('update:expanded', this.expanded);
            // console.log(this.expanded)
        }
    }
}
</script>


<style scoped>
.hive-item-edit {
    position: absolute;
    top: 8px;
    right: 20px;
    display: flex;
    font-size: 12px;
    align-items: center;
    gap: 8px;
}

.hive-item-edit img {
    height: 20px;
}

.hive-item-title {
    margin: 0.4vw 0px;
    font-size: 2.8vw;
    flex: 1;
}

.hive-item-title img {
    height: 2vw;
}

.hive-item-info {
    flex: 1;
    margin: 14px 0px;
    height: 7vw;
    display: flex;
    gap: 2.4vw;
    font-size: 1.2vw;
}

.hive-item-icon {
    flex: 1;
}

.hive-item-icon img {
    height: 7vw;
    margin: auto;
}

.hive-item-text {
    flex: 6;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}

.hive-item-location {
    display: flex;
    align-items: center;
    gap: 12px;
}

.hive-item-location img {
    height: 1.4vw;
}

.hive-item-description {
    font-size: 1.3vw;
    font-family: "TwCenLight";
}

.hive-item-status {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
    gap: 12px;
    height: 7vw;
}

.hive-item-status img {
    height: 5vw;
}

.hive-item-status p {
    margin: 0px;
}

.hive-item-inspection {
    font-size: 1.5vw;
    flex: 1;
    display: flex;
    align-items: center;
    gap: 12px;
}

.hive-item-inspection img {
    height: 2.4vw;
    transition: all 0.15s ease 0s;
}
</style>