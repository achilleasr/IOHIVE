<template>
    <div class="inspections-header">
        <h2 class="clickable title" @click="expandContentButton">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="imgicon"
                :class="{ rotated180: expanded }" viewBox="0 0 16 16">
                <path fill-rule="evenodd"
                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
            </svg>
            <svg-icon type="mdi" :path="path" /><span></span><span>Inspections</span>
        </h2>
        <AddInspection v-if="hive && hive.id" :hive="hive" />
    </div>

    <div v-if="expanded" class="inspections-content">
        <div v-if="loading" class="state-msg">Loading…</div>
        <div v-else-if="!hiveInspections || list.length === 0" class="state-msg">No inspections yet.</div>
        <div v-else>
            <div v-for="item in list" :key="item.id" class="inspection-row">
                <div class="inspection-date">{{ formatDate(item.created_at) }}</div>
                <div class="inspection-chips">
                    <span v-if="item.impression" class="chip" :class="impressionClass(item.impression)">
                        {{ impressionLabel(item.impression) }}
                    </span>
                    <span v-if="item.queen_seen === 1" class="chip chip-blue">Queen ✓</span>
                    <span v-if="item.needs_attention === 1" class="chip chip-red">Attention needed</span>
                </div>
                <div v-if="item.notes" class="inspection-notes">{{ item.notes }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiArchiveEditOutline } from '@mdi/js';
import { mapState } from 'vuex';
import AddInspection from './AddInspection.vue';

export default {
    name: 'Inspections',
    props: {
        inspections: Array,
        hive: Object,
    },
    components: { SvgIcon, AddInspection },
    data() {
        return {
            expanded: false,
            path: mdiArchiveEditOutline,
        };
    },
    computed: {
        ...mapState(['inspectionsByHive']),
        hiveInspections() {
            return this.hive?.id ? (this.inspectionsByHive[this.hive.id] || null) : null;
        },
        list() {
            return this.hiveInspections?.inspections?.data ?? [];
        },
        loading() {
            return this.expanded && this.hive?.id && !this.hiveInspections;
        },
    },
    methods: {
        async expandContentButton() {
            this.expanded = !this.expanded;
            if (this.expanded && this.hive?.id && !this.hiveInspections) {
                await this.$store.dispatch('loadHiveInspections', this.hive.id);
            }
        },
        formatDate(val) {
            if (!val) return '';
            return new Date(val).toLocaleString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric',
                hour: 'numeric', minute: 'numeric', hour12: true,
            });
        },
        impressionLabel(val) {
            return val === 3 ? '😊 Good' : val === 2 ? '😐 Ok' : '😞 Bad';
        },
        impressionClass(val) {
            return val === 3 ? 'chip-green' : val === 2 ? 'chip-yellow' : 'chip-red';
        },
    },
};
</script>

<style scoped>
.inspections-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.title {
    display: flex;
    gap: 10px;
    margin: 0;
}

.imgicon {
    fill: rgb(190, 190, 190);
    stroke: rgb(190, 190, 190);
    transition: all 0.15s ease 0s;
}

.inspections-content {
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

.inspection-row {
    background: #f8f8fe;
    border-radius: 10px;
    padding: 10px 14px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.inspection-date {
    font-size: 0.85rem;
    color: #999;
}

.inspection-chips {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
}

.chip {
    padding: 3px 10px;
    border-radius: 100px;
    font-size: 0.8rem;
    font-family: TwCen, sans-serif;
}

.chip-green {
    background: #d4f0dc;
    color: #2a7a40;
}

.chip-yellow {
    background: #fdf3cc;
    color: #7a6000;
}

.chip-red {
    background: #fde8e8;
    color: #a32020;
}

.chip-blue {
    background: #dde8f8;
    color: #1a4a8a;
}

.inspection-notes {
    font-size: 0.9rem;
    color: #555;
    font-family: TwCenLight, TwCen, sans-serif;
}
</style>
