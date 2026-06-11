<template>
    <h2 class="clickable title" @click="expanded = !expanded">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="imgicon"
            :class="{ rotated180: expanded }" viewBox="0 0 16 16">
            <path fill-rule="evenodd"
                d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
        </svg>
        <svg-icon type="mdi" :path="path" /><span></span><span>Alerts</span>
    </h2>

    <div v-if="expanded" class="alerts-content">
        <div v-if="!alertList.length" class="state-msg">No alerts for this hive.</div>
        <div v-else v-for="(alert, index) in alertList" :key="index" class="alert-row">
            <div class="alert-date">{{ formatDate(alert.created_at || alert.date) }}</div>
            <div class="alert-note">{{ alert.note || alert.message || 'Alert triggered' }}</div>
        </div>
    </div>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiAlertCircleOutline } from '@mdi/js';

export default {
    name: 'Alerts',
    components: { SvgIcon },
    props: {
        alerts: Array,
    },
    data() {
        return {
            expanded: false,
            path: mdiAlertCircleOutline,
        };
    },
    computed: {
        alertList() {
            return Array.isArray(this.alerts) ? this.alerts.filter(a => a.alert || a.note || a.message) : [];
        },
    },
    methods: {
        formatDate(val) {
            if (!val) return '';
            return new Date(val).toLocaleString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric',
                hour: 'numeric', minute: 'numeric', hour12: true,
            });
        },
    },
};
</script>

<style scoped>
.title {
    display: flex;
    gap: 10px;
}

.imgicon {
    fill: rgb(190, 190, 190);
    stroke: rgb(190, 190, 190);
    transition: all 0.15s ease 0s;
}

.alerts-content {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 8px;
}

.state-msg {
    color: #bbb;
    font-size: 0.95rem;
    padding: 8px 0;
}

.alert-row {
    background: #fff5f5;
    border-radius: 10px;
    padding: 10px 14px;
    display: flex;
    flex-direction: column;
    gap: 3px;
    border-left: 3px solid #e46268;
}

.alert-date {
    font-size: 0.82rem;
    color: #999;
}

.alert-note {
    font-size: 0.9rem;
    color: #555;
    font-family: TwCenLight, TwCen, sans-serif;
}
</style>