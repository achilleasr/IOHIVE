<template>
    <span id="overview"></span>
    <div class="block">
        <div class="add-button">
            <svg-icon class="plus-icon" type="mdi" :path="path" />
            <span class="add-button-hovertext">Add Apiary</span>
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
    padding: 0.8vw;
    /* box-shadow: 15px 15px 30px #bebebe,
        -15px -15px 30px #ffffff; */
}

.add-button {
    background-color: #575EAE;
    width: 4.6vw;
    height: 4.6vw;
    border: #575EAE solid 2px;
    border-radius: 0.6vw;
    justify-content: center;
    align-items: center;
    display: flex;
    position: relative;
    transition: all 0.3s ease 0s;
}

.add-button:hover {
    background-color: #262a4f;
    border: black solid 2px;
    cursor: pointer;
}


.add-button .add-button-hovertext {
    visibility: hidden;

    width: 120px;
    background-color: black;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;

    /* Position the tooltip */
    position: absolute;
    z-index: 1;
    top: 120%;
    /* margin-top: 60px; */
}

.add-button:hover .add-button-hovertext {
    visibility: visible;
}

.plus-icon {
    color: white;
    width: 4vw;
    height: 4vw;
}
</style>