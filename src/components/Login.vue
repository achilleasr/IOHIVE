<template>
  <span class="login-container">
    <img src="../assets/IOHIVE-logo-nobg.png" class="logo" />

    <div class="login-item">
      Login
      <form class="form">
        <div class="form-item">
          <label>Email</label>
          <input
            type="email"
            v-model="email"
            placeholder="beepExample@gmail.com"
            required
          />
        </div>
        <div class="form-item">
          <label>Password</label>
          <input
            type="password"
            v-model="password"
            placeholder="********"
            required
          />
        </div>
        <div class="form-item btn-row">
          <button type="submit" @click="postLogin">Login</button>
        </div>
      </form>
    </div>

    <footer>
        <a
          href="https://github.com/achilleasr/IOHIVE"
          target="_blank"
          rel="noopener noreferrer"
          class="github-link"
          aria-label="View source on GitHub"
        >
        <span>Github: achilleasr/IOHIVE</span>
        </a>
    </footer>
  </span>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      email: null,
      password: null,
    };
  },
  methods: {
    async loginAsGuest() {
      await this.$store.dispatch('loginAsGuest');
      this.$router.push('/');
    },
    async postLogin(e) {
      e.preventDefault();
      try {
        await this.$store.dispatch('login', {
          email: this.email,
          password: this.password,
        });
        this.$router.push('/');
      } catch (error) {
        console.log('login failed', error);
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1.5rem 1rem 4rem; /* bottom pad clears footer */
  background: url('../assets/Hives/i_login_bg.jpg') center center / cover
    no-repeat;
  overflow: hidden;
  color: white;
  box-sizing: border-box;
}

.logo {
  width: min(50vw, 280px);  /* shrinks on mobile, caps on desktop */
  max-width: 180px;
  animation: animatetop 1.2s ease-in-out;
  margin-bottom: 20px;
}

.login-item {
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: center;
  border-radius: 40px;
  font-family: TwCen, sans-serif;
  background-color: #ffb35d83;
  backdrop-filter: blur(8px);
  padding: clamp(1.2rem, 4vw, 2rem) clamp(1.4rem, 5vw, 2.5rem);
  font-size: clamp(1rem, 3.5vw, 1.4rem);
  box-shadow: 0px 5px 5px #f9f9f97e;
  transition: all 0.2s ease;
  animation: animatebottom 1.2s ease-in-out;
  width: min(90vw, 420px); /* fluid, never overflows */
  box-sizing: border-box;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
  font-size: clamp(0.85rem, 3vw, 1rem);
}

.form-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.form-item label {
  white-space: nowrap;
  flex-shrink: 0;
}

.form-item input {
  flex: 1;
  min-width: 0; /* prevents input from overflowing flex container */
}

.btn-row {
  justify-content: center;
}

input {
  border: 0;
  border-radius: 100px;
  padding: 0.4em 0.8em;
  height: 2.2em;
  font-family: TwCen, sans-serif;
  font-size: clamp(0.8rem, 2.5vw, 1rem);
  background-color: #f9fafe;
  box-shadow: inset 2px 2px 4px #ebebeb, inset -2px -2px 4px #f6f6f6;
  box-sizing: border-box;
}

input::placeholder {
  font-family: TwCen, sans-serif;
  font-size: clamp(0.75rem, 2.2vw, 0.95rem);
  color: rgb(177, 177, 177);
}

button {
  border: 0;
  border-radius: 100px;
  padding: 0.4em 1.6em;
  font-family: TwCen, sans-serif;
  cursor: pointer;
  color: white;
  font-size: clamp(0.85rem, 2.5vw, 1rem);
  background-color: black;
  transition: opacity 0.15s;
}

button:active {
  opacity: 0.75;
}

footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  padding: 12px 16px;
}

.github-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: black;
  text-decoration: none;
  font-family: TwCen, sans-serif;
  font-size: clamp(0.75rem, 2.5vw, 0.9rem);
  opacity: 0.8;
  transition: opacity 0.2s;
}

.github-link:hover {
  opacity: 1;
}

.github-link svg {
  flex-shrink: 0;
}
</style>
