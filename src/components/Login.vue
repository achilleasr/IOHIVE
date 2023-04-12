<template>
    <span class="login-container">

        <img src="../assets/IOHIVE-logo-nobg.png" class="logo">
        <div class="login-item" @click="login">
            Login
        </div>
        <footer>
            <a href="https://github.com/achilleasr/IOHIVE" target="_blank">
                Last updated on {{ latestCommitDate }}
            </a>
        </footer>
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
    },
    data() {
        return {
            latestCommitDate: null,
        };
    },
    async mounted() {
        const repoUrl = "https://api.github.com/repos/achilleasr/IOHIVE/commits";
        const response = await fetch(repoUrl);
        const commits = await response.json();
        const commitDate = new Date(commits[0].commit.author.date);
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        this.latestCommitDate = commitDate.toLocaleString('en-US', options);
    },

}
</script>

<style scoped >
footer {
    position: absolute;
    bottom: 0;
    right: 0;

    padding: 10px;
}

a {
    color: black;
}

.login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    justify-content: center;
    /* background-color: rgb(245, 180, 76); */
    background: url('../assets/Hives/i_login_bg.jpg');
    background-position: center center;
    background-size: cover;
    overflow: hidden;
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
    position: relative;
    animation: animatebottom 1.2s ease-in-out;
}

.login-item:hover {
    box-shadow: 0px 15px 20px #ffffff86;
    transform: translateY(-4px);
    cursor: pointer;
}

.logo {
    width: 30vw;
    position: relative;
    animation: animatetop 1.2s ease-in-out;
    margin-bottom: 20px;
}

@keyframes animatetop {
    from {
        top: -300px;
        opacity: 0
    }

    to {
        top: 0;
        opacity: 1
    }
}

@keyframes animatebottom {
    from {
        bottom: -300px;
        opacity: 0
    }

    to {
        bottom: 0;
        opacity: 1
    }
}
</style>