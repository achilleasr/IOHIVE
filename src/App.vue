<template>
  <div class="navbar">
    <div class="main-logo"><img src="./assets/IOHIVE-logo-nobg.png" /></div>
    <div class="pages">
      <div class="page">
        <svg xmlns="http://www.w3.org/2000/svg" class="page-icon" viewBox="0 0 24 24">
          <title>view-dashboard-outline</title>
          <path
            d="M19,5V7H15V5H19M9,5V11H5V5H9M19,13V19H15V13H19M9,17V19H5V17H9M21,3H13V9H21V3M11,3H3V13H11V3M21,11H13V21H21V11M11,15H3V21H11V15Z" />
        </svg>
        Overview
      </div>
      <div class="page"><svg class="page-icon2" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0.5" y="0.5" width="15" height="7" />
          <rect x="0.5" y="7.5" width="15" height="7" />
          <line x1="6" y1="3.5" x2="10" y2="3.5" />
          <line x1="6" y1="10.5" x2="10" y2="10.5" />
        </svg>
        Hives</div>
      <div class="page">
        <img class="page-icon" src="./assets/Hives/i_status_grey.svg" />
        Devices
      </div>
      <div class="page"><svg class="page-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>cog-outline</title>
          <path
            d="M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10M10,22C9.75,22 9.54,21.82 9.5,21.58L9.13,18.93C8.5,18.68 7.96,18.34 7.44,17.94L4.95,18.95C4.73,19.03 4.46,18.95 4.34,18.73L2.34,15.27C2.21,15.05 2.27,14.78 2.46,14.63L4.57,12.97L4.5,12L4.57,11L2.46,9.37C2.27,9.22 2.21,8.95 2.34,8.73L4.34,5.27C4.46,5.05 4.73,4.96 4.95,5.05L7.44,6.05C7.96,5.66 8.5,5.32 9.13,5.07L9.5,2.42C9.54,2.18 9.75,2 10,2H14C14.25,2 14.46,2.18 14.5,2.42L14.87,5.07C15.5,5.32 16.04,5.66 16.56,6.05L19.05,5.05C19.27,4.96 19.54,5.05 19.66,5.27L21.66,8.73C21.79,8.95 21.73,9.22 21.54,9.37L19.43,11L19.5,12L19.43,13L21.54,14.63C21.73,14.78 21.79,15.05 21.66,15.27L19.66,18.73C19.54,18.95 19.27,19.04 19.05,18.95L16.56,17.95C16.04,18.34 15.5,18.68 14.87,18.93L14.5,21.58C14.46,21.82 14.25,22 14,22H10M11.25,4L10.88,6.61C9.68,6.86 8.62,7.5 7.85,8.39L5.44,7.35L4.69,8.65L6.8,10.2C6.4,11.37 6.4,12.64 6.8,13.8L4.68,15.36L5.43,16.66L7.86,15.62C8.63,16.5 9.68,17.14 10.87,17.38L11.24,20H12.76L13.13,17.39C14.32,17.14 15.37,16.5 16.14,15.62L18.57,16.66L19.32,15.36L17.2,13.81C17.6,12.64 17.6,11.37 17.2,10.2L19.31,8.65L18.56,7.35L16.15,8.39C15.38,7.5 14.32,6.86 13.12,6.62L12.75,4H11.25Z" />
        </svg>
        Settings</div>
    </div>
  </div>

  <div class="flex-container">
    <div class="empty"></div>
    <div class="main-content">
      <div class="header">
        <div class="search-bar"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>magnify</title>
            <path
              d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
          </svg></div>
        <div class="account">
          <div class="notifications"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <title>bell-outline</title>
              <path
                d="M10 21H14C14 22.1 13.1 23 12 23S10 22.1 10 21M21 19V20H3V19L5 17V11C5 7.9 7 5.2 10 4.3V4C10 2.9 10.9 2 12 2S14 2.9 14 4V4.3C17 5.2 19 7.9 19 11V17L21 19M17 11C17 8.2 14.8 6 12 6S7 8.2 7 11V18H17V11Z" />
            </svg></div>
          <div class="profile"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <title>account-circle-outline</title>
              <path
                d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 10.12,16.5 12,16.5C13.88,16.5 16.5,17.38 16.93,18.28C15.57,19.36 13.86,20 12,20C10.14,20 8.43,19.36 7.07,18.28M18.36,16.83C16.93,15.09 13.46,14.5 12,14.5C10.54,14.5 7.07,15.09 5.64,16.83C4.62,15.5 4,13.82 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,13.82 19.38,15.5 18.36,16.83M12,6C10.06,6 8.5,7.56 8.5,9.5C8.5,11.44 10.06,13 12,13C13.94,13 15.5,11.44 15.5,9.5C15.5,7.56 13.94,6 12,6M12,11A1.5,1.5 0 0,1 10.5,9.5A1.5,1.5 0 0,1 12,8A1.5,1.5 0 0,1 13.5,9.5A1.5,1.5 0 0,1 12,11Z" />
            </svg>Katerina Malisova</div>
        </div>
      </div>
      <AddHive />
      <Apiaries />
      <div class="selected-apiary-title">
        ISD-lab-Syros-001</div>
      <ApiaryMap />
      <Hives />
    </div>
  </div>
</template>

<script>
import Hives from "./components/Hives.vue";
import ApiaryMap from "./components/ApiaryMap.vue";
import Apiaries from "./components/Apiaries.vue";
import AddHive from "./components/AddHive.vue";

export default {
  name: 'App',
  components: {
    Hives, ApiaryMap, Apiaries, AddHive
  },
  data() {
    return {
      strokeColor: "#919296"
    };
  }
}
</script>

<style>
:root {
  /* Main stroke color */
  --stroke-color: #919296;
}

@font-face {
  font-family: "TwCen";
  src: url(./assets/fonts/TwCenMTStd.otf);
}

@font-face {
  font-family: "TwCenLight";
  src: url(./assets/fonts/TwCenMTStd-Light.otf);
}

#app {
  font-family: TwCen, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--stroke-color);
}

body {
  margin: 0px;
  border: 0px;
}


.flex-container {
  display: flex;
  flex-direction: row;
  height: 100vh;
  margin: 0px;
  gap: 1vw;
}

.empty {
  flex: 1;
}

.navbar {
  position: fixed;
  top: 0px;
  left: 0px;
  border-radius: 10px;
  width: 15vw;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  padding: 3vw 3.4vw;
}

.main-logo img {
  width: 12vw;
  margin-bottom: 3em;
}

.pages {
  font-size: 1.5vw;
  display: flex;
  gap: 1.2vw;
  flex-direction: column;
}

.page {
  display: flex;
  gap: 1.4vw;
  align-items: center;
  padding: 1vw;
  border-radius: 4vw;
}

.page-icon {
  width: 2.6vw;
  height: 2.6vw;
  fill: var(--stroke-color);
}

.page-icon2 {
  width: 2.6vw;
  height: 2vw;
  stroke-width: 1.5px;
  stroke: var(--stroke-color);
}

/* .hover-class {
  background-color: #575EAE;
  color: white;
}

.hover-class .page-icon {
  fill: white;
}

.hover-class .page-icon2 {
  stroke: white;
} */

.header {
  width: 100%;
  height: 10vw;
  display: flex;
  align-items: center;
  justify-content: space-between;

}

.search-bar {
  background-color: #F9FAFE;
  width: 40%;
  border-radius: 3vw;
  padding: 1vw;
  height: 1.6vw;
  position: relative;
  /* box-shadow: 15px 15px 30px #bebebe,
    -15px -15px 30px #ffffff; */
}

.search-bar svg {
  height: 2.4vw;
  position: absolute;
  right: 4%;
  bottom: 20%;
}

.account {
  display: flex;
  gap: 2.4vw;
}

.notifications {
  height: 2.2vw;
  width: 2.2vw;
  /* background-color: aquamarine; */
}

.profile {
  display: flex;
  font-size: 1.4vw;
  /* background-color: aquamarine; */
  height: 2.2vw;
  gap: 0.4vw;
  color: black;
  align-items: center;
  /* white-space: nowrap; */
  /* width: 3vw; */
}

.profile svg {
  height: 2.2vw;
  width: 2.2vw;
}

.main-content {
  flex: 4;
  border-radius: 10px;
  padding: 2vw;
  display: flex;
  gap: 2vh;
  flex-direction: column;
}




.selected-apiary-title {
  font-size: 3vw;
  color: black;
  margin: 2vh 0;
}
</style>
