<template>
    <AddHive />
    <Apiaries />
</template>

<script>
import SelectedApiary from "../components/SelectedApiary.vue";
import Apiaries from "../components/Apiaries.vue";
import AddHive from "../components/AddHive.vue";

export default {
    name: 'PageHives',
    components: {
        SelectedApiary, Apiaries, AddHive,
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