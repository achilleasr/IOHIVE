<template>
    <div class="login-wrapper">

        <h2>Login Debug Page</h2>
        <form class="form">
            <div class="form-item">
                <label>Email</label>
                <input type="email" v-model="email" placeholder="katemail.gmail.com" />
            </div>
            <div class="form-item">
                <label>Password</label>
                <input type="password" v-model="password" placeholder="*******" />
            </div>
            <div class="form-item">
                <button type="submit" @click="postLogin"> Login </button>
            </div>
        </form>
        <button type="submit" @click="getSharedGroups" :class="{ 'button-enabled': (loginState == 'Login Successful!!') }">
            GET DATA </button>
        <div class='login-state'>{{ loginState && loginState }} </div>
        <div class="data"> {{ groupsData &&
            JSON.stringify(loginData) + JSON.stringify(groupsData.groups[0].hives) }} </div>
    </div>
</template>

<script>
import axios from 'axios';


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
    name: 'PageLogin',
    data() {
        return {
            loginData: null,
            groupsData: null,
            apiToken: null,
            email: null,
            password: null,
            res: null,
            loginState: null,
        }
    },
    methods: {
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
                    this.loginState = "Login Successful!!";
                })
                .catch(error => {
                    console.log(error);
                    this.loginState = "Login Failed";
                });
        },
        async getSharedGroups(e) {
            e.preventDefault();
            await axios.get(sharedGroupsUrl, {
                headers: {
                    "Authorization": "Bearer " + this.apiToken,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Accept-language": "en",
                }
            }).then(response => {
                this.groupsData = response.data;
                // console.log(response.data);
            })
                .catch(error => {
                    console.log(error);
                    this.loginState = "Error " + error;
                });
        },
    }
}

</script>

<style scoped>
.login-wrapper {
    color: black;
}

button {
    border: solid #9baae8 1px;
    border-radius: 100px;
    /* width: 350px; */
    padding: 0 14px;
    position: relative;
    font-family: TwCen;
    cursor: pointer;
    color: white;
    font-size: 1.1vw;
    background-color: #9baae8;
    box-shadow: 2px 2px 4px #ebebeb,
        -2px -2px 4px #f6f6f6;
}

button:active {
    border: rgb(0, 0, 0) solid 1px;
}

input {
    border: 0px;
    border-radius: 100px;
    padding: 0 14px;
    position: relative;
    font-family: TwCen;
    font-size: 1.4vw;
    background-color: #F9FAFE;
    box-shadow: inset 2px 2px 4px #ebebeb,
        inset -2px -2px 4px #f6f6f6;
}


input::placeholder {
    font-family: TwCen;
    font-size: 1.4vw;
    color: rgb(177, 177, 177);
}

.form {
    display: flex;
    flex-direction: column;
    gap: 20px;
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

.login-state {
    font-size: larger;
}

.data {
    font-size: smaller;
    overflow: hidden;
}

.button-enabled {
    background-color: rgb(26, 181, 220);
}
</style>