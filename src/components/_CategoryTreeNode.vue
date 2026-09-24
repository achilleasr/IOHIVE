<template>
    <div class="tree-node">
        <div class="tree-row" :style="{ paddingLeft: depth * 16 + 'px' }">
            <button v-if="hasChildren" type="button" class="expand-btn" @click.stop="expanded = !expanded"
                :aria-label="expanded ? 'Collapse' : 'Expand'">
                <svg viewBox="0 0 16 16" class="chevron" :class="{ rotated: expanded }">
                    <path fill-rule="evenodd" d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" fill="none" />
                </svg>
            </button>
            <span v-else class="expand-spacer"></span>

            <label class="tree-label-row">
                <input type="checkbox" :checked="checkedSet.has(node.id)"
                    :indeterminate.prop="!checkedSet.has(node.id) && someDescendantChecked"
                    @change="$emit('toggle', node)" />
                <span :class="['tree-label', hasChildren ? 'is-parent' : '']">
                    {{ nodeText }}
                    <span v-if="hasChildren" class="child-count">({{ childCount }})</span>
                </span>
            </label>
        </div>

        <div v-if="hasChildren && expanded" class="tree-children">
            <CategoryTreeNode v-for="child in node.children" :key="child.id" :node="child" :checked-set="checkedSet"
                :depth="depth + 1" @toggle="$emit('toggle', $event)" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'CategoryTreeNode',
    props: {
        node: { type: Object, required: true },
        checkedSet: { type: Object, required: true },
        depth: { type: Number, default: 0 },
    },
    emits: ['toggle'],
    data() {
        return {
            expanded: false,
        };
    },
    computed: {
        hasChildren() {
            return Array.isArray(this.node.children) && this.node.children.length > 0;
        },
        nodeText() {
            return (
                this.node.text ||
                this.node.trans?.en ||
                this.node.name ||
                'Item'
            );
        },
        childCount() {
            const count = (nodes) => {
                let n = 0;
                for (const c of nodes || []) {
                    n += 1;
                    if (c.children?.length) n += count(c.children);
                }
                return n;
            };
            return count(this.node.children);
        },
        someDescendantChecked() {
            if (!this.hasChildren) return false;
            const walk = (nodes) =>
                nodes.some(
                    (n) =>
                        this.checkedSet.has(n.id) ||
                        (n.children && n.children.length && walk(n.children))
                );
            return walk(this.node.children);
        },
    },
};
</script>

<style scoped>
.tree-row {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 6px;
    border-radius: 6px;
    cursor: default;
    font-size: 0.9rem;
    color: #555;
    transition: background 0.1s;
}

.tree-row:hover {
    background: #f5f6ff;
}

.expand-btn {
    background: none;
    border: none;
    padding: 0;
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #888;
    border-radius: 4px;
    flex-shrink: 0;
}

.expand-btn:hover {
    background: #e3e4f3;
    color: #575EAE;
}

.expand-spacer {
    width: 18px;
    flex-shrink: 0;
}

.chevron {
    width: 12px;
    height: 12px;
    transition: transform 0.15s ease;
}

.chevron.rotated {
    transform: rotate(90deg);
}

.tree-label-row {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    flex: 1;
}

.tree-label-row input {
    accent-color: #575EAE;
    flex-shrink: 0;
}

.tree-label.is-parent {
    font-weight: bold;
    color: #333;
}

.child-count {
    color: #aaa;
    font-weight: normal;
    font-size: 0.82rem;
    margin-left: 4px;
}

.tree-children {
    display: flex;
    flex-direction: column;
}
</style>