<template>
  <span v-if="isAuthenticated">
    <SideBar />
    <HeaderCustom />
    <div class="flex-container">
      <div class="empty"></div>
      <div class="main-content">
        <router-view></router-view>
      </div>
    </div>
  </span>
  <Login v-else />
  <span id="overview"></span>
</template>

<script>
import HeaderCustom from "./components/HeaderCustom.vue";
import SideBar from "./components/SideBar.vue";
import Login from "./components/Login.vue";
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  components: {
    HeaderCustom, SideBar, Login,
  },
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

<style>
:root {
  /* Main stroke color */
  --stroke-color: #919296;
}


/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #F9FAFE;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #575EAE;
  border-radius: 20px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #2f3364;
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

a {
  text-decoration: none;
  color: var(--stroke-color);
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

.main-content {
  width: 74vw;
  border-radius: 10px;
  padding: 0px 5vw 0px 1vw;

  margin-top: 5.5vw;
  display: flex;
  gap: 1vh;
  flex-direction: column;
  /* overflow: auto; */
}

.rotated180 {
  transform: rotate(180deg);
}

.clickable {
  cursor: pointer;
}

.popup,
.leaflet-popup-content-wrapper,
.leaflet-popup-tip {
  background: rgba(0, 0, 0, 0) !important;
  border: none !important;
  font-size: 12px;
  box-shadow: none !important;
  font-family: TwCen;
}

/* this removes tooltips' white triangle from geojson data (pink circle markers) */
.leaflet-tooltip-top:before,
.leaflet-tooltip-bottom:before,
.leaflet-tooltip-left:before,
.leaflet-tooltip-right:before {
  border: none !important;
}
</style>
