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
            <div v-for="(item, idx) in list" :key="item.id" class="inspection-row clickable"
                @click="toggleItem(item.id)">
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
                        <span v-if="item.attention === 1" class="chip chip-red">⚠ Attention</span>
                    </div>
                </div>

                <div v-if="openItems[item.id]" class="inspection-detail" @click.stop>
                    <div v-if="item.notes" class="general-row">
                        <span class="general-label">Notes</span>
                        <span class="general-val">{{ item.notes }}</span>
                    </div>
                    <div v-if="item.reminder" class="general-row">
                        <span class="general-label">Reminder</span>
                        <span class="general-val">
                            {{ item.reminder }}
                            <span v-if="item.reminder_date" class="reminder-date">
                                ({{ formatDate(item.reminder_date) }})
                            </span>
                        </span>
                    </div>

                    <div v-if="groupedItems.length" class="checklist-data">
                        <div v-for="group in groupedItems" :key="group.title" class="data-group">
                            <div class="group-title">{{ group.title }}</div>
                            <div class="group-rows">
                                <div v-for="row in group.rows" :key="row.id" class="data-row">
                                    <span class="data-label">{{ row.label }}</span>
                                    <span class="data-val">
                                        {{ formatVal(row) }}
                                        <span v-if="row.unit" class="data-unit">{{ row.unit }}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else-if="idx === 0" class="no-detail">
                        No checklist data recorded.
                    </div>
                    <div v-else class="no-detail">
                        Detailed checklist data is only loaded for the most recent inspection.
                    </div>
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
        ...mapState(['inspectionsByHive', 'locations']),
        hiveInspections() {
            return this.hive?.id ? (this.inspectionsByHive[this.hive.id] || null) : null;
        },
        list() {
            return this.hiveInspections?.inspections?.data ?? [];
        },
        itemsByDate() {
            return this.hiveInspections?.items_by_date ?? [];
        },
        hivesById() {
            const map = {};
            for (const loc of this.locations?.locations || []) {
                for (const h of loc.hives || []) map[h.id] = h.name;
            }
            return map;
        },
        groupedItems() {
            const groups = {};
            for (const entry of this.itemsByDate) {
                if (!entry?.items?.length) continue;
                const path = entry.anc ? entry.anc.replace(/\s*>\s*$/, '').trim() : 'General';
                const topLevel = path.split(' > ')[0] || 'General';
                const subPath = path.split(' > ').slice(1).join(' › ');
                const fullName = subPath ? `${subPath} › ${entry.name}` : entry.name;

                if (!groups[topLevel]) groups[topLevel] = { title: topLevel, rows: [] };

                const it = entry.items[0];
                groups[topLevel].rows.push({
                    id: it.id,
                    label: fullName,
                    val: it.val,
                    type: it.type,
                    unit: it.unit,
                });
            }
            return Object.values(groups);
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
        formatVal(row) {
            if (row.val == null || row.val === '') return '—';
            if (row.type === 'select_hive' && this.hivesById[row.val]) {
                return this.hivesById[row.val];
            }
            if (row.type === 'date') {
                const d = new Date(row.val);
                if (!isNaN(d.getTime())) {
                    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                }
            }
            if (row.type === 'smileys_3') {
                if (row.val === '8-)') return '😊';
                if (row.val === '8-|') return '😐';
                if (row.val === '8-(') return '😞';
            }
            return row.val;
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

.inspection-detail {
    background: white;
    border-top: 1px solid #eee;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    cursor: default;
}

.general-row {
    display: flex;
    gap: 12px;
    font-size: 0.88rem;
}

.general-label {
    color: #aaa;
    min-width: 90px;
    flex-shrink: 0;
}

.general-val {
    color: #444;
}

.reminder-date {
    color: #888;
    font-size: 0.82rem;
    margin-left: 4px;
}

.checklist-data {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.data-group {
    background: #f8f8fe;
    border-radius: 10px;
    padding: 10px 14px;
}

.group-title {
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #575EAE;
    font-weight: bold;
    margin-bottom: 8px;
    padding-bottom: 4px;
    border-bottom: 1px solid #e3e4f3;
}

.group-rows {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px 18px;
}

.data-row {
    display: flex;
    gap: 8px;
    font-size: 0.85rem;
    padding: 3px 0;
    align-items: baseline;
}

.data-label {
    color: #888;
    flex: 1;
    min-width: 0;
}

.data-val {
    color: #333;
    text-align: right;
    flex-shrink: 0;
    font-weight: 500;
}

.data-unit {
    color: #999;
    font-size: 0.78rem;
    font-weight: normal;
    margin-left: 2px;
}

.no-detail {
    font-size: 0.85rem;
    color: #ccc;
    font-style: italic;
}

@media (max-width: 700px) {
    .group-rows {
        grid-template-columns: 1fr;
    }
}
</style>