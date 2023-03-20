<template>
    <div class="block">
        <div class="add-button">
            <svg-icon class="plus-icon" type="mdi" :path="path" />
        </div>
    </div>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiPlus } from '@mdi/js';

export default {
    components: {
        SvgIcon
    },
    data() {
        return {
            path: mdiPlus,
        }
    }
}
</script>

<style scoped>
.block {
    background-color: #F9FAFE;
    border-radius: 1.3vw;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 8vw;
    padding: 2vw;
    /* box-shadow: 15px 15px 30px #bebebe,
        -15px -15px 30px #ffffff; */
}

.add-button {
    background-color: #575EAE;
    width: 6vw;
    height: 6vw;

    border-radius: 0.8vw;
    justify-content: center;
    align-items: center;
    display: flex;
}

.plus-icon {
    color: white;
    width: 4.4vw;
    height: 4.4vw;
}
</style>