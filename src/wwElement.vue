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
            <option v-for="(item, index) in options" :key="index" :value="getLabel(item)"></option>
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
    emits: ['update:content:effect', 'trigger-event'],
    data() {
        return {
            collectionData: [],
            inputValue: '',
            errorCount: 0,
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
        options() {
            // const data = this.content.collectionId
            //     ? wwLib.wwCollection.getCollection(this.content.collectionId).data
            //     : [];

            // return data.filter(item => !!item);

            return this.collectionData.filter(item => !!item);
        },
    },
    watch: {
        'content.collection': {
            handler: async function (collectionId) {
                if (!collectionId) return;
                await this.getCollection(collectionId);
            },
        },
        collectionData(data) {
            if (data && data[0]) this.$emit('update:content:effect', { itemsProperties: Object.keys(data[0]) });
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
            this.collectionData = data;
            this.$emit('update:content:effect', { itemsProperties: Object.keys(data[0]) });
        },
        handleChange(event) {
            if (!this.collectionData) return;
            const value = event.target.value.toLowerCase();
            const match = this.collectionData.filter(item => item[this.content.displayBy].toLowerCase() === value)[0];
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
