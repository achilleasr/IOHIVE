<template>
    <div class="inspections-header">
        <h2 class="title clickable" @click="toggleExpanded">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="imgicon"
                :class="{ rotated180: expanded }" viewBox="0 0 16 16">
                <path fill-rule="evenodd"
                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
            </svg>
            <svg-icon type="mdi" :path="path" />
            <span>Inspections</span>
            <span v-if="!expanded && list.length" class="count-badge">{{ list.length }}</span>
        </h2>
        <AddInspection v-if="hive && hive.id" :hive="hive" />
    </div>

    <div v-if="expanded" class="inspections-content">
        <div v-if="loading" class="state-msg">Loading…</div>
        <div v-else-if="list.length === 0" class="state-msg">No inspections yet.</div>
        <div v-else class="inspection-list">
            <div v-for="item in list" :key="item.id" class="inspection-row clickable" @click="toggleItem(item.id)">
                <div class="inspection-row-header">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" class="row-chevron"
                        :class="{ rotated180: openItems[item.id] }" viewBox="0 0 16 16">
                        <path fill-rule="evenodd"
                            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
                    </svg>
                    <span class="inspection-date">{{ formatDate(item.created_at) }}</span>
                    <div class="inspection-chips">
                        <span v-if="item.impression" class="chip" :class="impressionClass(item.impression)">
                            {{ impressionLabel(item.impression) }}
                        </span>
                        <span v-if="item.queen_seen === 1" class="chip chip-blue">Queen ✓</span>
                        <span v-if="item.needs_attention === 1" class="chip chip-red">⚠ Attention</span>
                    </div>
                </div>

                <div v-if="openItems[item.id]" class="inspection-detail">
                    <div v-if="item.notes" class="detail-row">
                        <span class="detail-label">Notes</span>
                        <span class="detail-val">{{ item.notes }}</span>
                    </div>
                    <div v-if="item.brood != null" class="detail-row">
                        <span class="detail-label">Brood frames</span>
                        <span class="detail-val">{{ item.brood }}</span>
                    </div>
                    <div v-if="item.queen_seen != null" class="detail-row">
                        <span class="detail-label">Queen seen</span>
                        <span class="detail-val">{{ item.queen_seen === 1 ? 'Yes' : 'No' }}</span>
                    </div>
                    <div v-if="item.needs_attention != null" class="detail-row">
                        <span class="detail-label">Needs attention</span>
                        <span class="detail-val">{{ item.needs_attention === 1 ? 'Yes' : 'No' }}</span>
                    </div>
                    <div v-if="item.impression" class="detail-row">
                        <span class="detail-label">Impression</span>
                        <span class="detail-val">{{ impressionLabel(item.impression) }}</span>
                    </div>
                    <template v-for="entry in extraFields(item)" :key="entry.label">
                        <div class="detail-row">
                            <span class="detail-label">{{ entry.label }}</span>
                            <span class="detail-val">{{ entry.value }}</span>
                        </div>
                    </template>
                    <div v-if="noDetail(item)" class="no-detail">No additional details recorded.</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiArchiveEditOutline } from '@mdi/js';
import { mapState } from 'vuex';
import AddInspection from './AddInspection.vue';

const FIELD_LABELS = {
    eggs: 'Eggs seen',
    summer_feed: 'Summer feed',
    winter_feed: 'Winter feed',
    varroa_treatment: 'Varroa treatment',
    varroa_count: 'Varroa count',
    honey_super: 'Honey super',
    mouse_guard: 'Mouse guard',
    bee_count: 'Bee count',
    population: 'Population',
    larvae: 'Larvae',
    capped_brood: 'Capped brood',
    pollen_collection: 'Pollen collection',
    propolis_collection: 'Propolis collection',
    wax: 'Wax',
    laying_workers: 'Laying workers',
    reminder: 'Reminder',
    reminder_date: 'Reminder date',
};

const SKIP_FIELDS = new Set([
    'id', 'hive_id', 'created_at', 'updated_at',
    'impression', 'queen_seen', 'needs_attention', 'notes', 'brood',
    'checklist_id', 'owner_id', 'items_by_date',
]);

export default {
    name: 'Inspections',
    components: { SvgIcon, AddInspection },
    props: { hive: Object },
    data() {
        return {
            expanded: false,
            path: mdiArchiveEditOutline,
            openItems: {},
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
        async toggleExpanded() {
            this.expanded = !this.expanded;
            if (this.expanded && this.hive?.id && !this.hiveInspections) {
                await this.$store.dispatch('loadHiveInspections', this.hive.id);
            }
        },
        toggleItem(id) {
            this.openItems = { ...this.openItems, [id]: !this.openItems[id] };
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
        extraFields(item) {
            return Object.entries(item)
                .filter(([k, v]) => !SKIP_FIELDS.has(k) && FIELD_LABELS[k] && v != null && v !== '' && v !== 0)
                .map(([k, v]) => ({
                    label: FIELD_LABELS[k],
                    value: typeof v === 'number' && (k.endsWith('_treatment') || k.endsWith('_guard') || k.endsWith('_super') || k.endsWith('_feed') || k === 'eggs' || k === 'laying_workers' || k === 'pollen_collection' || k === 'propolis_collection' || k === 'wax')
                        ? (v === 1 ? 'Yes' : 'No')
                        : String(v),
                }));
        },
        noDetail(item) {
            return !item.notes && item.brood == null && item.queen_seen == null
                && item.needs_attention == null && this.extraFields(item).length === 0;
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
    align-items: center;
    gap: 8px;
    margin: 0;
    user-select: none;
}

.imgicon {
    fill: rgb(190, 190, 190);
    stroke: rgb(190, 190, 190);
    transition: transform 0.15s ease;
}

.rotated180 {
    transform: rotate(180deg);
}

.count-badge {
    background: #575EAE;
    color: white;
    border-radius: 100px;
    font-size: 0.75rem;
    padding: 1px 8px;
    margin-left: 4px;
}

.inspections-content {
    margin-top: 8px;
}

.state-msg {
    color: #bbb;
    font-size: 0.95rem;
    padding: 8px 0;
}

.inspection-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.inspection-row {
    background: #f8f8fe;
    border-radius: 10px;
    overflow: hidden;
    transition: box-shadow 0.15s;
}

.inspection-row:hover {
    box-shadow: 0 2px 8px #575eae18;
}

.inspection-row-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    flex-wrap: wrap;
}

.row-chevron {
    fill: #aaa;
    flex-shrink: 0;
    transition: transform 0.15s ease;
}

.inspection-date {
    font-size: 0.85rem;
    color: #777;
    white-space: nowrap;
}

.inspection-chips {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
    margin-left: 4px;
}

.chip {
    padding: 2px 10px;
    border-radius: 100px;
    font-size: 0.78rem;
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

.inspection-detail {
    background: white;
    border-top: 1px solid #eee;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.detail-row {
    display: flex;
    gap: 12px;
    font-size: 0.88rem;
}

.detail-label {
    color: #aaa;
    min-width: 130px;
    flex-shrink: 0;
}

.detail-val {
    color: #444;
}

.no-detail {
    font-size: 0.85rem;
    color: #ccc;
    font-style: italic;
}
</style>