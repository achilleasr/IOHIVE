<template>
  <div v-if="isAuthenticated" class="app-layout">
    <SideBar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
  <Login v-else />
</template>

<script>
import SideBar from './components/SideBar.vue';
import Login from './components/Login.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'App',
  components: { SideBar, Login },
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
};
</script>

<style>
:root {
  --stroke-color: #919296;
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #f9fafe;
}

::-webkit-scrollbar-thumb {
  background: #575eae;
  border-radius: 20px;
}

::-webkit-scrollbar-thumb:hover {
  background: #2f3364;
}

@font-face {
  font-family: 'TwCen';
  src: url(./assets/fonts/TwCenMTStd.otf);
}

@font-face {
  font-family: 'TwCenLight';
  src: url(./assets/fonts/TwCenMTStd-Light.otf);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: TwCen, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--stroke-color);
}

a {
  text-decoration: none;
  color: var(--stroke-color);
}

.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 0.5rem 5%;
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

.leaflet-tooltip-top:before,
.leaflet-tooltip-bottom:before,
.leaflet-tooltip-left:before,
.leaflet-tooltip-right:before {
  border: none !important;
}
</style>
