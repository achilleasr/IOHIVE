<template>
    <div class="account-wrapper">
        <h2>Account</h2>

        <div v-if="isGuest" class="guest-notice">
            You are browsing as a guest. Log in to manage your account.
        </div>

        <template v-else>
            <h4>Edit Account</h4>

            <div v-if="successMsg" class="success-message">{{ successMsg }}</div>
            <div v-if="error" class="error-message">{{ error }}</div>

            <form class="form" @submit.prevent="save">
                <div class="form-item">
                    <label>Name</label>
                    <input v-model="form.name" type="text" :disabled="submitting" />
                </div>
                <div class="form-item">
                    <label>Email</label>
                    <input v-model="form.email" type="email" :disabled="submitting" />
                </div>
                <div class="form-item">
                    <label>Current Password</label>
                    <input v-model="form.password_current" type="password" placeholder="required to save"
                        :disabled="submitting" />
                </div>
                <div class="form-item">
                    <label>New Password</label>
                    <input v-model="form.password" type="password" :disabled="submitting" />
                </div>
                <div class="form-item">
                    <label>Confirm Password</label>
                    <input v-model="form.password_confirmation" type="password" :disabled="submitting" />
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn-save" :disabled="submitting">
                        {{ submitting ? 'Saving…' : 'Save changes' }}
                    </button>
                </div>
            </form>
        </template>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { updateUser } from '@/services/api/usersApi';

export default {
    name: 'PageAccount',
    data() {
        return {
            submitting: false,
            error: null,
            successMsg: null,
            form: {
                name: '',
                email: '',
                password_current: '',
                password: '',
                password_confirmation: '',
            },
        };
    },
    computed: {
        ...mapState(['loginData']),
        isGuest() {
            return !this.loginData?.api_token;
        },
    },
    mounted() {
        if (this.loginData) {
            this.form.name = this.loginData.name || '';
            this.form.email = this.loginData.email || '';
        }
    },
    methods: {
        async save() {
            this.error = null;
            this.successMsg = null;

            if (this.form.password && this.form.password !== this.form.password_confirmation) {
                this.error = 'New passwords do not match.';
                return;
            }
            if (!this.form.password_current) {
                this.error = 'Current password is required to save changes.';
                return;
            }

            this.submitting = true;
            try {
                const payload = {
                    name: this.form.name,
                    email: this.form.email,
                    password_current: this.form.password_current,
                };
                if (this.form.password) {
                    payload.password = this.form.password;
                    payload.password_confirmation = this.form.password_confirmation;
                }

                await updateUser(this.loginData.id, payload);
                this.$store.commit('setLoginData', {
                    ...this.loginData,
                    name: this.form.name,
                    email: this.form.email,
                });
                this.form.password_current = '';
                this.form.password = '';
                this.form.password_confirmation = '';
                this.successMsg = 'Account updated successfully.';
            } catch (err) {
                const msg = err?.response?.data?.message || Object.values(err?.response?.data?.errors || {})?.[0]?.[0];
                this.error = msg || 'Failed to save. Please try again.';
            } finally {
                this.submitting = false;
            }
        },
    },
};
</script>

<style scoped>
.account-wrapper {
    color: #333;
}

h4 {
    margin: 0 0 20px 0;
    color: #555;
}

.guest-notice {
    background: #f0f0f0;
    border-radius: 10px;
    padding: 16px 20px;
    color: #666;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 420px;
}

.form-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.form-item label {
    font-size: 0.85rem;
    color: #666;
}

.form-item input {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 9px 12px;
    font-family: TwCen, sans-serif;
    font-size: 1rem;
    background: #F9FAFE;
    color: #333;
    transition: border-color 0.15s, box-shadow 0.15s;
}

.form-item input:focus {
    outline: none;
    border-color: #575EAE;
    box-shadow: 0 0 0 3px rgba(87, 94, 174, 0.15);
}

.form-item input:disabled {
    opacity: 0.5;
}

.form-actions {
    margin-top: 8px;
}

.btn-save {
    background: #575EAE;
    color: white;
    border: none;
    border-radius: 100px;
    padding: 10px 28px;
    font-family: TwCen, sans-serif;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.15s;
}

.btn-save:hover:not(:disabled) {
    background: #3e4379;
}

.btn-save:disabled {
    background: #b5b8d4;
    cursor: not-allowed;
}

.success-message {
    background: #eafaf1;
    color: #2d8a4e;
    border-left: 3px solid #2d8a4e;
    border-radius: 8px;
    padding: 10px 14px;
    margin-bottom: 8px;
    font-size: 0.9rem;
}

.error-message {
    color: #c43030;
    font-size: 0.9rem;
    background: #fdeaea;
    padding: 9px 12px;
    border-radius: 8px;
    border-left: 3px solid #d05050;
    margin-bottom: 8px;
}
</style>