<template>
    <span id="overview"></span>
    <div class="block">
        <div v-if="overlayShown" class="overlay" @click.self="overlayShown = flase">
            <div class="overlay-card">
                Add Apiary
                <br />
                🏡🐝🐝🐝🐝🐝
            </div>
        </div>

        <div class="add-button" @click="overlayShown = true">
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
            overlayShown: false,
        }
    }
}
</script>

<style scoped>
.overlay {
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    background-color: #ffffffbb;
    backdrop-filter: blur(4px);
    z-index: 30;
}

.overlay-card {
    z-index: 31;
    margin: auto;
    margin-top: 22vh;
    width: 50vw;
    height: 50vh;
    line-height: 25vh;
    border-radius: 60px;
    border: solid white 2px;
    background-color: #fff;
    color: black;

    font-size: 4vw;
    text-align: center;
    box-shadow: 15px 15px 30px #bebebe,
        -15px -15px 30px #ffffff;
}

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