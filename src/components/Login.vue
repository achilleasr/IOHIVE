<template>
    <span class="login-container">
        <img src="../assets/IOHIVE-logo-nobg.png" class="logo">
        <div class="login-item">
            Login
            <form class="form">
                <div class="form-item">
                    <label>Email</label>
                    <input type="email" v-model="email" placeholder="katemail.gmail.com" required />
                </div>
                <div class="form-item">
                    <label>Password</label>
                    <input type="password" v-model="password" placeholder="********" required />
                </div>
                <div class="form-item">
                    <button type="submit" @click="postLogin"> Login </button>
                </div>
            </form>
            <div class="noAccountBox" @click="login">Continue without account</div>
        </div>
    </span>
</template>

<script>
import axios from 'axios';

const loginUrl = 'https://api.beep.nl/api/login';
const config = {
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Accept-language": "en",
    }
};

export default {
    name: 'Login',
    methods: {
        login() {
            this.$store.commit('login')
        },
        async postLogin(e) {
            e.preventDefault();
            await axios.post(loginUrl, {
                "email": this.email,
                "password": this.password
            }, config)
                .then(response => {
                    console.log(response.data);
                    this.$store.commit('login');
                    this.$store.commit('setLoginData', response.data);
                    this.$router.push('/#overview');
                })
                .catch(error => {
                    console.log(error);
                });
        },
    },

    data() {
        return {
            email: null,
            password: null,
        };
    }
}
</script>

<style scoped>
.logo {
    width: 30vw;
    position: relative;
    animation: animatetop 1.2s ease-in-out;
    margin-bottom: 20px;
}

.login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    justify-content: center;
    background: url('../assets/Hives/i_login_bg.jpg');
    background-position: center center;
    background-size: cover;
    overflow: hidden;
    color: white;
}

.login-item {
    /* width: 200px; */
    /* height: 100px; */
    display: flex;
    gap: 20px;
    flex-direction: column;
    text-align: center;
    border-radius: 40px;
    /* color: rgb(75, 55, 11); */
    font-family: TwCen;
    background-color: #ffb35d83;
    backdrop-filter: blur(8px);
    padding: 20px 5vw 20px 1vw;
    font-size: 2vw;
    padding: 2vw;
    box-shadow: 0px 5px 5px #f9f9f97e;
    transition: all 0.2s ease 0s;
    position: relative;
    animation: animatebottom 1.2s ease-in-out;
}


button {
    /* border: solid #9baae8 1px; */
    border: 0px;
    border-radius: 100px;
    /* width: 350px; */
    padding: 0 14px;
    position: relative;
    font-family: TwCen;
    cursor: pointer;
    color: white;
    font-size: 1.1vw;
    background-color: black;
    /* box-shadow: 2px 2px 4px #ebebeb,
        -2px -2px 4px #f6f6f6; */
}

button:active {
    border: rgb(0, 0, 0) solid 1px;
}

input {
    border: 0px;
    border-radius: 100px;
    padding: 0 10px;
    position: relative;
    font-family: TwCen;
    font-size: 1.2vw;
    background-color: #F9FAFE;
    box-shadow: inset 2px 2px 4px #ebebeb,
        inset -2px -2px 4px #f6f6f6;
}


input::placeholder {
    font-family: TwCen;
    font-size: 1.2vw;
    color: rgb(177, 177, 177);
}

.form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    text-align: left;
    font-size: 1.2vw;
}

.form-item {
    height: 2.5em;
    line-height: 3em;
    width: 350px;
    display: flex;
    justify-content: flex-end;
    text-align: right;
    gap: 30px;
}

.noAccountBox {
    background-color: rgb(255, 166, 34);
    border-radius: 30px;
    font-size: 2vw;
    backdrop-filter: blur(8px);
    transition: all 0.3s;
    box-shadow: 0px 2px 3px #ffffff86;
}

.noAccountBox:hover {
    box-shadow: 0px 5px 10px #ffffff86;
    transform: translateY(-4px);
    cursor: pointer;
}



footer {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 10px;
    /* color: black; */
}

.footer {
    color: white;
}
</style>