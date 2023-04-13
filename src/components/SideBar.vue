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

            <router-link to="/settings" class="page" v-bind:class="{ 'activePage': $route.path === '/settings' }">
                <svg class="page-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <title>cog-outline</title>
                    <path
                        d="M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10M10,22C9.75,22 9.54,21.82 9.5,21.58L9.13,18.93C8.5,18.68 7.96,18.34 7.44,17.94L4.95,18.95C4.73,19.03 4.46,18.95 4.34,18.73L2.34,15.27C2.21,15.05 2.27,14.78 2.46,14.63L4.57,12.97L4.5,12L4.57,11L2.46,9.37C2.27,9.22 2.21,8.95 2.34,8.73L4.34,5.27C4.46,5.05 4.73,4.96 4.95,5.05L7.44,6.05C7.96,5.66 8.5,5.32 9.13,5.07L9.5,2.42C9.54,2.18 9.75,2 10,2H14C14.25,2 14.46,2.18 14.5,2.42L14.87,5.07C15.5,5.32 16.04,5.66 16.56,6.05L19.05,5.05C19.27,4.96 19.54,5.05 19.66,5.27L21.66,8.73C21.79,8.95 21.73,9.22 21.54,9.37L19.43,11L19.5,12L19.43,13L21.54,14.63C21.73,14.78 21.79,15.05 21.66,15.27L19.66,18.73C19.54,18.95 19.27,19.04 19.05,18.95L16.56,17.95C16.04,18.34 15.5,18.68 14.87,18.93L14.5,21.58C14.46,21.82 14.25,22 14,22H10M11.25,4L10.88,6.61C9.68,6.86 8.62,7.5 7.85,8.39L5.44,7.35L4.69,8.65L6.8,10.2C6.4,11.37 6.4,12.64 6.8,13.8L4.68,15.36L5.43,16.66L7.86,15.62C8.63,16.5 9.68,17.14 10.87,17.38L11.24,20H12.76L13.13,17.39C14.32,17.14 15.37,16.5 16.14,15.62L18.57,16.66L19.32,15.36L17.2,13.81C17.6,12.64 17.6,11.37 17.2,10.2L19.31,8.65L18.56,7.35L16.15,8.39C15.38,7.5 14.32,6.86 13.12,6.62L12.75,4H11.25Z" />
                </svg>
                Settings
            </router-link>

            <!-- <router-link to="/login" class="page" v-bind:class="{ 'activePage': $route.path === '/login' }">
                <svg-icon type="mdi" :path="path"></svg-icon>
                Login
            </router-link> -->


            <div class="page" @click='logout()'>
                <svg-icon type="mdi" :path="path"></svg-icon>
                Logout
            </div>

        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiLogin } from '@mdi/js';

export default {
    name: "SideBar",
    components: {
        SvgIcon
    },
    data() {
        return {
            path: mdiLogin,
        }
    },
    methods: {
        logout() {
            this.$store.dispatch('logout')
        },
    }
}
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
    /* background-color: brown; */
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
    /* background-color: blueviolet; */
}

.page {
    display: flex;
    gap: 1.4vw;
    align-items: center;
    padding: 0.5vw 0.8vw 0.5vw 1vw;
    border-radius: 4vw;

    transition: all 0.15s ease 0s;
    /* border: 1px solid white; */
}

.page:hover {
    background-color: rgb(248, 248, 248);
    box-shadow: 0px 5px 10px #575eae29;
    /* transform: translateY(-2px); */
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