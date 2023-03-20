<template>
    <div class="hives-container">
        <div class="hives-title">
            <svg class="hives-icon" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" y="0.5" width="15" height="7" />
                <rect x="0.5" y="7.5" width="15" height="7" />
                <line x1="6" y1="3.5" x2="10" y2="3.5" />
                <line x1="6" y1="10.5" x2="10" y2="10.5" />
            </svg>
            <h5>
                Hives
            </h5>
        </div>
        <div class="hives-content">
            <HiveItem />
            <HiveItem />
            <HiveItem />
        </div>
    </div>
</template>

<script>
import HiveItem from "./HiveItem.vue"

export default {
    name: 'Hives',
    components: {
        HiveItem
    }
}

</script>
<style scoped>
.hives-container {
    background-color: #F9FAFE;
    border-radius: 30px;
    padding: 20px;
    padding-left: 40px;
    padding-right: 40px;
    /* box-shadow: 15px 15px 30px #bebebe,
        -15px -15px 30px #ffffff; */
}

.hives-container svg {
    stroke: var(--stroke-color);
    height: auto;
}


.hives-title {
    height: 30px;
    font-size: 30px;
    display: flex;
    align-items: center;
    gap: 14px;
}

.hives-icon {
    height: 20px;
    width: 20px;
}

.hives-content {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
}
</style>