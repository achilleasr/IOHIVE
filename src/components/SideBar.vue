<template>
  <div class="sidebar">
    <router-link to="/" class="main-logo">
      <img src="../assets/IOHIVE-logo-nobg.png" alt="IOHIVE" />
    </router-link>

    <nav class="pages">
      <router-link
        :to="{ path: '/', hash: '#overview' }"
        class="page"
        :class="{
          activePage:
            ($route.hash === '' || $route.hash === '#overview') &&
            $route.path === '/',
        }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="page-icon" viewBox="0 0 24 24">
          <path d="M19,5V7H15V5H19M9,5V11H5V5H9M19,13V19H15V13H19M9,17V19H5V17H9M21,3H13V9H21V3M11,3H3V13H11V3M21,11H13V21H21V11M11,15H3V21H11V15Z" />
        </svg>
        <span class="page-label">Overview</span>
      </router-link>

      <router-link
        to="/devices"
        class="page"
        :class="{ activePage: $route.path === '/devices' }"
      >
        <img
          class="page-icon"
          :src="$route.path === '/devices'
            ? require('../assets/Hives/i_status.svg')
            : require('../assets/Hives/i_status_grey.svg')"
          alt=""
        />
        <span class="page-label">Devices</span>
      </router-link>

      <div class="page" @click="logout()">
        <svg-icon type="mdi" :path="path" class="page-icon" />
        <span class="page-label">Logout</span>
      </div>
    </nav>

    <div class="account">
      <AccountLink />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiLogin } from '@mdi/js';
import AccountLink from './AccountLink.vue';

export default {
  name: 'SideBar',
  components: { SvgIcon, AccountLink },
  data() {
    return {
      path: mdiLogin,
    };
  },
  computed: {
    ...mapState(['loginData']),
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
    },
  },
};
</script>

<style scoped>
.sidebar {
  position: sticky;
  top: 0;
  width: 100%;
  height: 56px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  box-sizing: border-box;
  background: #fff;
  z-index: 100;
  gap: 0;
}

.main-logo {
  display: flex;
  align-items: center;
  padding-right: 1.5rem;
  flex-shrink: 0;
}

.main-logo img {
  height: 28px;
  width: auto;
  object-fit: contain;
}

.pages {
  display: flex;
  flex-direction: row;
  gap: 4px;
  flex: 1;
}

.page {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 14px;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.15s ease, box-shadow 0.15s ease;
  white-space: nowrap;
}

.page:hover {
  background-color: rgb(248, 248, 248);
  box-shadow: 0px 5px 10px #575eae29;
}

.page-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  fill: #666;
}

.activePage {
  background-color: #575eae;
  color: white;
}

.activePage:hover {
  background-color: #575eae;
}

.activePage .page-icon {
  fill: white;
}

.account {
  margin-left: auto;
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .main-logo {
    display: none;
  }

  .page-label {
    display: none;
  }

  .page {
    padding: 8px;
    border-radius: 8px;
    gap: 0;
  }

  .page-icon {
    width: 22px;
    height: 22px;
  }
}
</style>
