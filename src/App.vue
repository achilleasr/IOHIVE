<template>
  <SideBar />
  <div class="flex-container">
    <div class="empty"></div>
    <div class="main-content">
      <HeaderCustom />
      <AddHive />
      <Apiaries />
      <SelectedApiary />

    </div>
  </div>
</template>

<script>
import SelectedApiary from "./components/SelectedApiary.vue";
import Apiaries from "./components/Apiaries.vue";
import AddHive from "./components/AddHive.vue";
import HeaderCustom from "./components/HeaderCustom.vue";
import SideBar from "./components/SideBar.vue";

export default {
  name: 'App',
  components: {
    SelectedApiary, Apiaries, AddHive, HeaderCustom, SideBar
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

.main-content {
  flex: 4;
  border-radius: 10px;
  padding: 0px 1vw;
  /* width: 90%; */
  /* background-color: blueviolet; */
  display: flex;
  gap: 1vh;
  flex-direction: column;
}
</style>
