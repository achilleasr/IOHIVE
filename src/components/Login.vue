<template>
    <span class="login-container">
        <div class="login-item" @click="login">
            Need to login
        </div>
    </span>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'Login',
    computed: {
        ...mapGetters(['isAuthenticated'])
    },
    methods: {
        login() {
            this.$store.dispatch('login')
        },
        logout() {
            this.$store.dispatch('logout')
        }
    }

}
</script>

<style scoped >
.login-container {
    display: flex;
    align-items: center;
    height: 100vh;
    justify-content: center;
    /* background-color: rgb(245, 180, 76); */
    background: url('../assets/Hives/i_login_bg.jpg');
    background-position: center center;
    background-size: cover;
}

.login-item {
    width: 200px;
    height: 100px;
    text-align: center;
    border-radius: 40px;
    color: rgb(75, 55, 11);
    font-family: TwCen;
    background-color: #ffffff3f;
    backdrop-filter: blur(8px);
    padding: 20px 5vw 20px 1vw;
    font-size: 3vw;
    padding: 2vw;
    box-shadow: 0px 5px 5px #f9f9f97e;
    transition: all 0.2s ease 0s;
}

.login-item:hover {
    box-shadow: 0px 15px 20px #ffffff86;
    transform: translateY(-4px);
    cursor: pointer;
}
</style>