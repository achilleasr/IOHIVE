<template>
    <header class="header">
        <form action="/searchFor.php">

            <input type="text" placeholder="Search.." name="search" class="search-bar">
            <button type="submit">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <title>magnify</title>
                    <path
                        d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                </svg>
            </button>


        </form>
        <div class="account">
            <div class="notifications"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <!-- <title>Notifications</title> -->
                    <path
                        d="M10 21H14C14 22.1 13.1 23 12 23S10 22.1 10 21M21 19V20H3V19L5 17V11C5 7.9 7 5.2 10 4.3V4C10 2.9 10.9 2 12 2S14 2.9 14 4V4.3C17 5.2 19 7.9 19 11V17L21 19M17 11C17 8.2 14.8 6 12 6S7 8.2 7 11V18H17V11Z" />
                </svg></div>

            <router-link :to="{ path: '/account' }">


                <div class="profile"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <!-- <title>Account</title> -->
                        <path
                            d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 10.12,16.5 12,16.5C13.88,16.5 16.5,17.38 16.93,18.28C15.57,19.36 13.86,20 12,20C10.14,20 8.43,19.36 7.07,18.28M18.36,16.83C16.93,15.09 13.46,14.5 12,14.5C10.54,14.5 7.07,15.09 5.64,16.83C4.62,15.5 4,13.82 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,13.82 19.38,15.5 18.36,16.83M12,6C10.06,6 8.5,7.56 8.5,9.5C8.5,11.44 10.06,13 12,13C13.94,13 15.5,11.44 15.5,9.5C15.5,7.56 13.94,6 12,6M12,11A1.5,1.5 0 0,1 10.5,9.5A1.5,1.5 0 0,1 12,8A1.5,1.5 0 0,1 13.5,9.5A1.5,1.5 0 0,1 12,11Z" />
                    </svg>{{ getUsername() }}</div>

            </router-link>

        </div>
    </header>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
    computed: {
        ...mapGetters(['loginData'])
    },
    methods: {
        logout() {
            this.$store.dispatch('logout')
        },
        getUsername() {
            if (this.loginData) {
                return this.loginData.name;
            } else {
                return 'Guest';
            }
        }
    }
}
</script>

<style scoped>
form {
    width: 28%;
    /* background-color: coral; */

    position: relative;
}

input {
    border: 0px;
    padding: 0 14px;
    position: relative;
    font-family: TwCen;
    font-size: 1.1vw;
}

input::placeholder {
    font-family: TwCen;
    font-size: 1.1vw;
}

button {
    border: 0px;
    width: 2vw;
    height: 2vw;
    position: absolute;
    right: 0%;
    top: 50%;
    transform: translate(0, -50%);
    background: none;
}


.header {
    width: 74vw;
    height: 2.5vw;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    top: 0px;
    right: 0px;
    background-color: #ffffffbb;
    backdrop-filter: blur(4px);
    padding: 20px 5vw 20px 1vw;
    border-bottom: #FFFFFF solid 1px;
    z-index: 20;
}

.search-bar {
    background-color: #F9FAFE;
    width: 94%;
    position: relative;
    border-radius: 3vw;
    height: 2.8vw;
    position: relative;
    box-shadow: inset 2px 2px 4px #ebebeb,
        inset -2px -2px 4px #f6f6f6;
}

.search-bar svg {
    height: 2vw;
    position: absolute;
    right: 4%;
    bottom: 20%;
}

.account {
    display: flex;
    gap: 2.4vw;
    padding: 20px;
}

.notifications {
    height: 2vw;
    width: 2vw;
    padding: 0.3vw;
}

.notifications:hover {
    background-color: #f1f1f1;
    border-radius: 200px;
    cursor: pointer;

}

.profile {
    display: flex;
    font-size: 1.2vw;
    padding: 0.3vw;
    cursor: pointer;
    height: 2vw;
    gap: 0.4vw;
    color: black;
    align-items: center;
}

.profile svg {
    height: 2vw;
    width: 2vw;
}
</style>