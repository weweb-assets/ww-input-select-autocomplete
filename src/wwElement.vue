<template>
    <div class="ww-webapp-autocomplete" :styles="cssVariables">
        <input
            id="autocomplete-choice"
            list="autocomplete-list"
            name="autocomplete-choice"
            :placeholder="wwLang.getText(content.placeholder)"
            @input="handleChange"
        />

        <datalist id="autocomplete-list">
            <option v-for="(item, index) in collectionData" :key="index" :value="getLabel(item)"></option>
        </datalist>
    </div>
</template>

<script>
export default {
    props: {
        /* wwEditor:start */
        wwEditorState: { type: Object, required: true },
        /* wwEditor:end */
        content: { type: Object, required: true },
    },
    emits: ['update:content', 'trigger-event'],
    data() {
        return {
            inputValue: '',
        };
    },
    computed: {
        isEditing() {
            /* wwEditor:start */
            return this.wwEditorState.editMode === wwLib.wwEditorHelper.EDIT_MODES.EDITION;
            /* wwEditor:end */
            // eslint-disable-next-line no-unreachable
            return false;
        },
        cssVariables() {
            return {
                '--input-color': this.content.color,
                '--input-fontFamily': this.content.fontFamily,
                '--input-fontSize': this.content.fontSize,
            };
        },
    },
    watch: {
        'content.collection'(collectionId) {
            if (!collectionId) return;
            this.getCollection(collectionId);
        },
        'content.collectionData'(data) {
            if (data && data[0]) this.$emit('update:content', { itemsProperties: Object.keys(data[0]) });
        },
    },
    async mounted() {
        if (this.content.collection) await this.getCollection(this.content.collection);
    },
    methods: {
        getLabel(item) {
            if (this.content.displayBy === 'none') return '';
            if (item[this.content.displayBy]) return item[this.content.displayBy];
            return '';
        },
        async getCollection(collectionId) {
            const data = await wwLib.wwCollection.getCollection(collectionId).data;
            this.$emit('update:content', { collectionData: data });
        },
        handleChange(event) {
            if (!this.content.collectionData) return;
            const value = event.target.value.toLowerCase();
            const match = this.content.collectionData.filter(
                item => item[this.content.displayBy].toLowerCase() === value
            )[0];
            if (match) this.updateVariableValue(match[this.content.displayBy]);
            else if (value === '') this.updateVariableValue('');
        },
        updateVariableValue(value) {
            if (!this.content.variable) return;
            wwLib.wwVariable.updateValue(this.content.variable, value);
            this.$emit('trigger-event', { name: 'change', event: { value: value } });
        },
    },
};
</script>

<style lang="scss" scoped>
.ww-webapp-autocomplete {
    #autocomplete-choice {
        outline: none;
        width: inherit;
        height: inherit;
        border: none;
        background-color: inherit;
        font-family: var(--input-fontFamily);
        color: var(--input-color);
        font-size: var(--input-fontSize);

        /* wwEditor:start */
        &.editing {
            pointer-events: none;
        }
        /* wwEditor:end */
    }
}
</style>
