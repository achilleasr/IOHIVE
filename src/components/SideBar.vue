<template>
    <div class="sidebar">
        <router-link to="/">
            <div class="main-logo">
                <img src="../assets/IOHIVE-logo-nobg.png" />
            </div>
        </router-link>
        <div class="pages">
            <router-link :to="{ path: '/', hash: '#overview' }" class="page"
                :class="{ 'activePage': (($route.hash === '' || $route.hash === '#overview') && $route.path === '/') }">
                <svg xmlns="http://www.w3.org/2000/svg" class="page-icon" viewBox="0 0 24 24">
                    <title>view-dashboard-outline</title>
                    <path
                        d="M19,5V7H15V5H19M9,5V11H5V5H9M19,13V19H15V13H19M9,17V19H5V17H9M21,3H13V9H21V3M11,3H3V13H11V3M21,11H13V21H21V11M11,15H3V21H11V15Z" />
                </svg>
                Overview
            </router-link>

            <router-link :to="{ path: '/', hash: '#hives' }" class="page"
                v-bind:class="{ 'activePage': $route.hash === '#hives' }">
                <svg class="page-icon2" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.5" y="0.5" width="15" height="7" />
                    <rect x="0.5" y="7.5" width="15" height="7" />
                    <line x1="6" y1="3.5" x2="10" y2="3.5" />
                    <line x1="6" y1="10.5" x2="10" y2="10.5" />
                </svg>
                Hives
            </router-link>

            <router-link :to="{ path: '/', hash: '#devices' }" class="page"
                v-bind:class="{ 'activePage': $route.hash === '#devices' }">
                <img class="page-icon"
                    :src="$route.hash === '#devices' ? require('../assets/Hives/i_status.svg') : require('../assets/Hives/i_status_grey.svg')" />
                Devices
            </router-link>

            <div v-if="loginData" class="page" @click="checklistOpen = true">
                <svg-icon type="mdi" :path="checklistPath"></svg-icon>
                Checklists
            </div>

            <div class="page" @click='logout()'>
                <svg-icon type="mdi" :path="path"></svg-icon>
                Logout
            </div>
        </div>

        <ChecklistManager v-if="loginData" :open="checklistOpen" @close="checklistOpen = false" />
    </div>
</template>

<script>
import { mapState } from 'vuex';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiLogin, mdiClipboardCheckOutline } from '@mdi/js';
import ChecklistManager from './ChecklistManager.vue';

export default {
    name: "SideBar",
    components: { SvgIcon, ChecklistManager },
    data() {
        return {
            path: mdiLogin,
            checklistPath: mdiClipboardCheckOutline,
            checklistOpen: false,
        };
    },
    computed: {
        ...mapState(['loginData']),
    },
    methods: {
        logout() {
            this.$store.dispatch('logout');
        },
    },
};
</script>

<style scoped>
.sidebar {
    position: fixed;
    top: 20px;
    left: 0px;
    border-radius: 10px;
    width: 12vw;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    padding: 0vw 3.4vw;
}


.main-logo img {
    width: 8vw;
    padding: 0 1vw;
    margin-bottom: 3em;
}

.pages {
    font-size: 1.2vw;
    display: flex;
    gap: 1.2vw;
    flex-direction: column;
}

.page {
    display: flex;
    gap: 1.4vw;
    align-items: center;
    padding: 0.5vw 0.8vw 0.5vw 1vw;
    border-radius: 4vw;
    transition: all 0.15s ease 0s;
    cursor: pointer;
}

.page:hover {
    background-color: rgb(248, 248, 248);
    box-shadow: 0px 5px 10px #575eae29;
}

.activePage {
    background-color: #575EAE;
    color: white;
}

.activePage:hover {
    background-color: #575EAE;
    color: white;
}

.activePage .page-icon {
    fill: white;
}

.activePage .page-icon2 {
    stroke-width: 1.5px;
    stroke: white;
}

.page-icon {
    width: 2.3vw;
    height: 2.3vw;
    fill: var(--stroke-color);
}

.page-icon2 {
    width: 2.3vw;
    height: 2.3vw;
    stroke-width: 1.5px;
    stroke: var(--stroke-color);
}
</style>