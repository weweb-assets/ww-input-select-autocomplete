<template>
    <div class="ww-webapp-autocomplete" :styles="cssVariables">
        <input
            list="autocomplete-list"
            id="autocomplete-choice"
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
    emits: ['update:content'],
    data() {
        return {
            collectionData: null,
            inputValue: '',
        };
    },
    watch: {
        'content.collection'(collectionId) {
            if (!collectionId) return;
            this.collectionData = wwLib.wwCollectionHelper.getCollection(collectionId).data;
            this.$emit('update:content', { itemsProperties: Object.keys(this.collectionData[0]) });
        },
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
    methods: {
        getLabel(item) {
            if (this.content.displayBy === 'none') return '';
            if (item[this.content.displayBy]) return item[this.content.displayBy];
            return '';
        },
        handleChange(event) {
            const value = event.target.value.toLowerCase();
            const match = this.collectionData.filter(item => item[this.content.displayBy].toLowerCase() === value)[0];
            if (match) this.$emit('trigger-event', { name: 'change', event: { value: match } });
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
