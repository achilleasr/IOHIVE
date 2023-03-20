<template>
    <div class="apiaries-title">
        Apiaries
    </div>
    <div class="apiaries-scroll">
        <ApiaryItem />
        <ApiaryItem />
        <ApiaryItem />
        <ApiaryItem />
    </div>
</template>
<script>
import ApiaryItem from './ApiaryItem.vue';

export default {
    components: {
        ApiaryItem,
    }
}

</script>
<style scoped>
.apiaries-title {
    font-size: 3vw;
    margin-top: 3vh;
}

.apiaries-scroll {
    height: 12vw;
    gap: 12px;
}
</style>