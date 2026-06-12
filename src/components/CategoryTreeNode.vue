<template>
    <div class="tree-node">
        <label class="tree-row" :style="{ paddingLeft: depth * 16 + 'px' }">
            <input type="checkbox" :checked="checkedSet.has(node.id)"
                :indeterminate.prop="!checkedSet.has(node.id) && someDescendantChecked"
                @change="$emit('toggle', node)" />
            <span :class="['tree-label', hasChildren ? 'is-parent' : '']">{{ nodeText }}</span>
        </label>

        <div v-if="hasChildren" class="tree-children">
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
        checkedSet: { type: Object, required: true }, // a Set of checked ids
        depth: { type: Number, default: 0 },
    },
    emits: ['toggle'],
    computed: {
        hasChildren() {
            return Array.isArray(this.node.children) && this.node.children.length > 0;
        },
        nodeText() {
            // taxonomy nodes use `text`; fall back to trans/name for safety
            return (
                this.node.text ||
                this.node.trans?.en ||
                this.node.name ||
                'Item'
            );
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
    gap: 8px;
    padding: 5px 6px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    color: #555;
    transition: background 0.1s;
}

.tree-row:hover {
    background: #f5f6ff;
}

.tree-row input {
    accent-color: #575EAE;
    flex-shrink: 0;
}

.tree-label.is-parent {
    font-weight: bold;
    color: #333;
}

.tree-children {
    display: flex;
    flex-direction: column;
}
</style>