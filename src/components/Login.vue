<template>
    <span class="login-container">
        <span id="p5-Canvas" class="p5"></span>
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
                    <input type="password" v-model="password" placeholder="*******" required />
                </div>
                <div class="form-item">
                    <button type="submit" @click="postLogin"> Login </button>
                </div>
            </form>
            <div class="noAccountBox" @click="login">Continue without account</div>
        </div>
        <footer>
            <a href="https://github.com/achilleasr/IOHIVE" target="_blank" class="footer">
                Last updated on {{ latestCommitDate }}
            </a>
        </footer>
    </span>
</template>

<script>
// import { mapGetters } from 'vuex';
import axios from 'axios';

//import p5 from 'p5';
//import beeImage from '@/assets/Hives/i_bee.png';

const sharedGroupsUrl = 'https://api.beep.nl/api/groups';
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
            this.$store.dispatch('login')
        },
        async postLogin(e) {
            e.preventDefault();
            await axios.post(loginUrl, {
                "email": this.email,
                "password": this.password
            }, config)
                .then(response => {
                    this.loginData = response.data;
                    // console.log(response.data);
                    this.apiToken = this.loginData.api_token;
                    // this.loginState = "Login Successful!!";
                    this.$store.dispatch('login');
                    this.$store.dispatch('setLoginData', this.loginData);
                    this.$router.push('/#overview');
                })
                .catch(error => {
                    console.log(error);
                });
        },
    },


    data() {
        return {
            latestCommitDate: null,
            email: null,
            password: null,
        };
    },
    async mounted() {
        const repoUrl = "https://api.github.com/repos/achilleasr/IOHIVE/commits";
        const response = await fetch(repoUrl);
        const commits = await response.json();
        const commitDate = new Date(commits[0].commit.author.date);
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        this.latestCommitDate = commitDate.toLocaleString('en-US', options);




        // const script = function (p5) {
        //     var speed = 2;
        //     var posX = 0;
        //     let img;

        //     p5.preload = _ => {
        //         img = p5.loadImage(beeImage);
        //     }

        //     p5.setup = _ => {
        //         const canvas = p5.createCanvas(window.innerWidth * 0.993, window.innerHeight * 0.993);
        //         canvas.parent('p5-Canvas');
        //     }
        //     p5.draw = _ => {
        //         p5.clear();
        //         const degree = p5.frameCount * 3;
        //         // const y = p5.sin(p5.radians(degree)) * 50;

        //         // p5.push();
        //         // p5.translate(0, p5.height * 0.7);
        //         // p5.translate(posX + 20, y);
        //         // p5.rotate(p5.radians(y + 90));
        //         // p5.image(img, 0, 0, 30, 30);
        //         // p5.pop();

        //         p5.image(img,
        //             p5.width * p5.noise(degree * 0.002),
        //             p5.height * p5.noise(degree * 0.002 - 80),
        //             30, 30);

        //         p5.image(img,
        //             p5.width * p5.noise(degree * 0.002 + 80),
        //             p5.height * p5.noise(degree * 0.002 - 180),
        //             30, 30);
        //         // posX += speed;

        //         // if (posX > p5.width || posX < 0) {
        //         //     speed *= -1;
        //         // }
        //     }
        // }
        // const P5 = require('p5');
        // new P5(script);

    }
}
</script>

<style scoped>
.p5 {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    border: 0px;
}



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
    /* background-color: rgb(245, 180, 76); */
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