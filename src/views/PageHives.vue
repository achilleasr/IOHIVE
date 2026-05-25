<template>
    <span id="overview"></span>
    <Apiaries />
</template>

<script>
import Apiaries from "../components/Apiaries.vue";

export default {
    name: 'PageHives',
    components: {
        Apiaries,
    },
}
</script>

<style scoped>
#overview {
    display: block;
    position: relative;
    top: -20px;
}
</style>