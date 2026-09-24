<template>
    <teleport to="body">
        <div v-if="open" class="overlay" @click.self="close">
            <div class="modal-card" @click.stop>
                <div class="modal-header">
                    <h2>Checklists</h2>
                    <button class="close-btn" @click="close">×</button>
                </div>

                <div class="manager-body">
                    <!-- Sidebar: list of checklists -->
                    <aside class="cl-list">
                        <button v-for="cl in checklists" :key="cl.id"
                            :class="['cl-row', cl.id === selectedId ? 'active' : '']" @click="select(cl.id)">
                            <span class="cl-name">{{ cl.name }}</span>
                            <span v-if="defaultChecklist && cl.id === defaultChecklist.id"
                                class="cl-default">default</span>
                        </button>

                        <button class="cl-new" @click="startCreate">
                            <svg viewBox="0 0 24 24" class="mini-plus">
                                <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                            </svg>
                            New checklist
                        </button>
                    </aside>

                    <!-- Detail: editor -->
                    <section class="cl-detail">
                        <div v-if="loadingCats" class="loading-block">
                            <div class="spinner"></div>
                            <span class="muted">Loading all checklists…</span>
                        </div>

                        <template v-else>
                            <div class="detail-head">
                                <input v-model="editName" class="name-input" placeholder="Checklist name"
                                    :disabled="saving" maxlength="120" />
                                <div class="detail-actions">
                                    <button class="btn-secondary sm" @click="duplicate" :disabled="saving || creating">
                                        Duplicate
                                    </button>
                                    <button v-if="!creating && checklists.length > 1" class="btn-danger sm"
                                        @click="confirmDelete = true" :disabled="saving">
                                        Delete
                                    </button>
                                </div>
                            </div>

                            <p class="hint">Check items to include them in this checklist. Checking a group includes
                                everything under it.</p>

                            <div v-if="bodyLoading" class="muted tree-loading">Loading this checklist…</div>
                            <div v-else-if="taxonomy.length === 0" class="muted tree-loading">
                                No categories available for this checklist.
                            </div>
                            <div v-else class="cat-tree">
                                <CategoryTreeNode v-for="node in taxonomy" :key="node.id" :node="node"
                                    :checked-set="included" @toggle="toggleNode" />
                            </div>

                            <div v-if="error" class="error-message">{{ error }}</div>

                            <div class="save-bar">
                                <span class="muted sm">
                                    {{ included.size }} items selected
                                    <span v-if="dirty" class="unsaved-dot">• unsaved changes</span>
                                </span>
                                <div class="save-bar-actions">
                                    <button v-if="dirty && !creating" class="btn-secondary sm" @click="discardChanges"
                                        :disabled="saving">Revert</button>
                                    <button class="btn-primary" @click="save"
                                        :disabled="saving || bodyLoading || !editName.trim()">
                                        {{ saving ? 'Saving…' : (creating ? 'Create checklist' : 'Save changes') }}
                                    </button>
                                </div>
                            </div>
                        </template>
                    </section>
                </div>

                <!-- delete confirm -->
                <div v-if="confirmDelete" class="confirm-overlay" @click.self="confirmDelete = false">
                    <div class="confirm-card">
                        <p>Delete <strong>{{ editName }}</strong>? Inspections already saved with it are kept.</p>
                        <div class="confirm-actions">
                            <button class="btn-secondary" @click="confirmDelete = false"
                                :disabled="saving">Cancel</button>
                            <button class="btn-danger" @click="doDelete" :disabled="saving">
                                {{ saving ? 'Deleting…' : 'Delete' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script>
import { mapState } from 'vuex';
import {
    createChecklist,
    updateChecklist,
    deleteChecklist,
} from '@/services/api/checklistsApi';
import CategoryTreeNode from './CategoryTreeNode.vue';
import { pruneTree, isNoiseId } from './checklistUtils';

export default {
    name: 'ChecklistManager',
    components: { CategoryTreeNode },
    props: {
        open: { type: Boolean, default: false },
    },
    emits: ['close'],
    data() {
        return {
            selectedId: null,
            editName: '',
            included: new Set(),
            creating: false,
            saving: false,
            loadingCats: false, // initial full load (list + all bodies)
            bodyLoading: false, // switching to a not-yet-cached checklist (rare after prefetch)
            error: null,
            confirmDelete: false,
            createTaxonomy: null, // taxonomy used when building a brand-new checklist
        };
    },
    computed: {
        ...mapState({
            checklists: (s) => s.checklists,
            defaultChecklist: (s) => s.defaultChecklist,
            checklistsById: (s) => s.checklistsById,
        }),
        activeChecklist() {
            return this.selectedId != null ? this.checklistsById[this.selectedId] : null;
        },
        taxonomy() {
            const raw = this.creating
                ? (this.createTaxonomy || [])
                : (this.activeChecklist?.taxonomy || []);
            return pruneTree(raw);
        },
        dirty() {
            if (this.creating) return this.included.size > 0;
            const saved = new Set(this.activeChecklist?.category_ids || []);
            if (saved.size !== this.included.size) return true;
            for (const id of this.included) if (!saved.has(id)) return true;
            return false;
        },
    },
    watch: {
        async open(val) {
            if (val) await this.init();
        },
    },
    methods: {
        async init() {
            this.error = null;
            this.confirmDelete = false;
            this.loadingCats = true;
            try {
                await this.$store.dispatch('loadChecklists');
                // Prefetch EVERY checklist body up front so switching is instant
                // and checkboxes are correct immediately (no unchecked flicker).
                await Promise.all(
                    this.checklists.map((cl) =>
                        this.$store.dispatch('loadChecklist', { id: cl.id }).catch(() => null)
                    )
                );
                const first = this.defaultChecklist?.id ?? this.checklists[0]?.id ?? null;
                if (first != null) this.select(first);
                else this.startCreate();
            } catch {
                this.error = 'Could not load checklists.';
            } finally {
                this.loadingCats = false;
            }
        },

        // Collect a node + all its descendant ids (for cascade select/deselect).
        descendantIds(node) {
            const ids = [node.id];
            const walk = (children) => {
                for (const c of children || []) {
                    ids.push(c.id);
                    if (c.children && c.children.length) walk(c.children);
                }
            };
            walk(node.children);
            return ids;
        },

        // Cascading toggle: checking/unchecking a node applies to all descendants.
        toggleNode(node) {
            const ids = this.descendantIds(node);
            const next = new Set(this.included);
            const turningOn = !next.has(node.id);
            if (turningOn) ids.forEach((id) => next.add(id));
            else ids.forEach((id) => next.delete(id));
            this.included = next;
        },

        async select(id) {
            this.creating = false;
            this.selectedId = id;
            this.error = null;
            let cl = this.checklistsById[id];
            if (!cl) {
                // not prefetched yet — fetch on demand with a small loader
                this.bodyLoading = true;
                try {
                    cl = await this.$store.dispatch('loadChecklist', { id });
                } catch {
                    this.error = 'Could not open this checklist (it may not be editable).';
                } finally {
                    this.bodyLoading = false;
                }
            }
            if (!cl) return;
            this.editName = cl.name || '';
            const ids = (cl.category_ids || []).filter((id) => !isNoiseId(id));
            this.included = new Set(ids);
        },

        startCreate() {
            this.creating = true;
            this.selectedId = null;
            this.editName = 'New checklist';
            this.included = new Set();
            // Seed the picker tree from the default checklist's taxonomy (full catalogue).
            const src = this.defaultChecklist?.id
                ? this.checklistsById[this.defaultChecklist.id]
                : this.checklistsById[this.checklists[0]?.id];
            this.createTaxonomy = src?.taxonomy || [];
        },

        duplicate() {
            const currentTax = this.activeChecklist?.taxonomy || [];
            this.creating = true;
            this.selectedId = null;
            this.editName = (this.editName || 'Checklist') + ' (copy)';
            this.createTaxonomy = currentTax;
            // keep current `included` selection
        },

        async save() {
            const name = this.editName.trim();
            if (!name) { this.error = 'Name is required'; return; }
            this.saving = true;
            this.error = null;
            const categoryIds = [...this.included];
            try {
                if (this.creating) {
                    const res = await createChecklist({ name, categoryIds, owner: true });
                    const newId = res.data?.checklist_id ?? null;
                    await this.$store.dispatch('loadChecklists', true);
                    if (newId) {
                        await this.$store.dispatch('loadChecklist', { id: newId, force: true });
                        this.creating = false;
                        this.select(newId);
                    } else {
                        this.creating = false;
                    }
                } else {
                    await updateChecklist(this.selectedId, { name, categoryIds });
                    await this.$store.dispatch('loadChecklist', { id: this.selectedId, force: true });
                    await this.$store.dispatch('loadChecklists', true);
                    // invalidate the inspection-form tree cache so a re-open reflects edits
                    this.$store.commit('invalidateChecklistTree', this.selectedId);
                }
            } catch (err) {
                const msg = err?.response?.data?.message
                    || Object.values(err?.response?.data?.errors || {})?.[0]?.[0];
                this.error = msg || 'Failed to save. Please try again.';
            } finally {
                this.saving = false;
            }
        },
        async doDelete() {
            this.saving = true;
            this.error = null;
            try {
                await deleteChecklist(this.selectedId);
                this.confirmDelete = false;
                await this.$store.dispatch('loadChecklists', true);
                const next = this.defaultChecklist?.id ?? this.checklists[0]?.id ?? null;
                if (next != null) await this.select(next);
                else this.startCreate();
            } catch (err) {
                this.error = err?.response?.data?.message || 'Failed to delete.';
                this.confirmDelete = false;
            } finally {
                this.saving = false;
            }
        },
        close() {
            if (this.saving) return;
            // Discard any unsaved checkbox edits so a re-open shows the saved state.
            this.discardChanges();
            this.$emit('close');
        },
        // Rebuild `included` from the currently-selected checklist's saved category_ids.
        discardChanges() {
            if (this.creating) {
                this.included = new Set();
                return;
            }
            const cl = this.selectedId != null ? this.checklistsById[this.selectedId] : null;
            this.included = new Set((cl?.category_ids || []).filter((id) => !isNoiseId(id)));
        },
    },
};
</script>

<style scoped>
.overlay {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(4px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: fadeIn 0.18s ease-out;
}

.modal-card {
    background: white;
    color: #333;
    border-radius: 20px;
    padding: 24px 28px 20px;
    width: 760px;
    max-width: 95vw;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
    font-family: TwCen, sans-serif;
    animation: slideUp 0.22s ease-out;
    position: relative;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #333;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.8rem;
    line-height: 1;
    cursor: pointer;
    color: #999;
    padding: 0 8px;
}

.close-btn:hover {
    color: #333;
}

.manager-body {
    display: flex;
    gap: 18px;
    min-height: 0;
    flex: 1;
    overflow: hidden;
}

.cl-list {
    width: 210px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
    overflow-y: auto;
    padding-right: 4px;
}

.cl-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    text-align: left;
    background: #F9FAFE;
    border: 1px solid transparent;
    border-radius: 10px;
    padding: 10px 12px;
    cursor: pointer;
    font-family: TwCen, sans-serif;
    font-size: 0.95rem;
    color: #444;
    transition: all 0.12s;
}

.cl-row:hover {
    background: #f0f1ff;
}

.cl-row.active {
    background: #575EAE;
    color: white;
    border-color: #3e4379;
}

.cl-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.cl-default {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    opacity: 0.7;
    flex-shrink: 0;
}

.cl-new {
    display: flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: 1px dashed #b9bce0;
    color: #575EAE;
    border-radius: 10px;
    padding: 9px 12px;
    cursor: pointer;
    font-family: TwCen, sans-serif;
    font-size: 0.9rem;
    margin-top: 4px;
}

.cl-new:hover {
    background: #f5f6ff;
}

.mini-plus {
    width: 14px;
    height: 14px;
    fill: #575EAE;
}

.cl-detail {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow: hidden;
}

.detail-head {
    display: flex;
    gap: 10px;
    align-items: center;
}

.name-input {
    flex: 1;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 9px 12px;
    font-family: TwCen, sans-serif;
    font-size: 1.05rem;
    background: #F9FAFE;
    color: #333;
}

.name-input:focus {
    outline: none;
    border-color: #575EAE;
    box-shadow: 0 0 0 3px rgba(87, 94, 174, 0.15);
}

.detail-actions {
    display: flex;
    gap: 6px;
    flex-shrink: 0;
}

.hint {
    font-size: 0.8rem;
    color: #999;
    margin: 0;
}

.cat-tree {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding-right: 6px;
}

.loading-block {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
}

.tree-loading {
    padding: 30px 0;
    text-align: center;
}

.spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #e3e4f3;
    border-top-color: #575EAE;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.cat-section {
    border: 1px solid #eee;
    border-radius: 12px;
    overflow: hidden;
}

.cat-section-head {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    background: #f8f8fe;
    cursor: pointer;
    font-size: 0.95rem;
    color: #333;
}

.cat-section-name {
    font-weight: bold;
    flex: 1;
}

.cat-count {
    font-size: 0.78rem;
    color: #999;
}

.cat-items {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px 14px;
    padding: 10px 14px 12px;
}

.cat-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.88rem;
    color: #555;
    cursor: pointer;
}

.cat-section-head input,
.cat-item input {
    accent-color: #575EAE;
}

.save-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #eee;
    padding-top: 12px;
}

.save-bar-actions {
    display: flex;
    gap: 8px;
    align-items: center;
}

.unsaved-dot {
    color: #e0922a;
    font-style: italic;
    margin-left: 6px;
}

.muted {
    color: #999;
}

.sm {
    font-size: 0.82rem;
}

.error-message {
    color: #c43030;
    font-size: 0.9rem;
    background: #fdeaea;
    padding: 9px 12px;
    border-radius: 8px;
    border-left: 3px solid #d05050;
}

.btn-primary,
.btn-secondary,
.btn-danger {
    padding: 9px 20px;
    border-radius: 100px;
    font-family: TwCen, sans-serif;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.15s ease;
    border: none;
}

.btn-primary {
    background: #575EAE;
    color: white;
}

.btn-primary:hover:not(:disabled) {
    background: #3e4379;
}

.btn-primary:disabled {
    background: #b5b8d4;
    cursor: not-allowed;
}

.btn-secondary {
    background: #f0f0f0;
    color: #555;
}

.btn-secondary:hover:not(:disabled) {
    background: #e0e0e0;
}

.btn-danger {
    background: #e46268;
    color: white;
}

.btn-danger:hover:not(:disabled) {
    background: #c94049;
}

.btn-secondary.sm,
.btn-danger.sm {
    padding: 6px 14px;
    font-size: 0.82rem;
}

.confirm-overlay {
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
}

.confirm-card {
    background: white;
    border: 1px solid #f0d0d0;
    border-radius: 16px;
    padding: 22px;
    width: 360px;
    max-width: 90%;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
}

.confirm-card p {
    margin: 0 0 16px;
    color: #555;
    font-size: 0.95rem;
}

.confirm-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(8px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>