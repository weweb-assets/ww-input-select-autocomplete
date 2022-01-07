<template>
    <div class="ww-webapp-autocomplete" :styles="cssVariables">
        <input
            id="autocomplete-choice"
            ref="input"
            list="autocomplete-list"
            :name="wwElementState.name"
            :placeholder="wwLang.getText(content.placeholder)"
            @input="handleChange"
        />

        <datalist id="autocomplete-list">
            <option v-for="(option, index) in options" :key="index" :value="option.name"></option>
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
        uid: { type: String, required: true },
        wwElementState: { type: Object, required: true },
    },
    emits: ['update:content:effect', 'trigger-event', 'update:sidepanel-content'],
    setup(props) {
        const { value: variableValue, setValue } = wwLib.wwVariable.useComponentVariable(props.uid, 'value', '');
        return { variableValue, setValue };
    },
    data() {
        return {
            internalValue: this.variableValue,
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
        value: {
            get() {
                return this.variableValue;
            },
            set(value) {
                if (value !== undefined && value !== this.variableValue) {
                    this.$emit('trigger-event', { name: 'change', event: { value } });
                    this.internalValue = value;
                    this.setValue(value);
                }
            },
        },
        cssVariables() {
            return {
                '--input-color': this.content.color,
                '--input-fontFamily': this.content.fontFamily,
                '--input-fontSize': this.content.fontSize,
            };
        },
        options() {
            if (!this.content.options) return;
            let data = this.content.options;
            if (data && !Array.isArray(data) && typeof data === 'object') {
                data = new Array(data);
            } else if ((data && !Array.isArray(data)) || typeof data !== 'object') {
                return [];
            }

            return data
                .filter(item => !!item)
                .map(item => {
                    if (typeof item !== 'object') return { name: item, value: item };
                    return {
                        name: wwLib.wwLang.getText(item[this.content.displayField || 'name'] || ''),
                        value: item[this.content.valueField || 'value'],
                    };
                });
        },
    },
    watch: {
        /* wwEditor:start */
        'content.options': {
            immediate: true,
            handler(options) {
                const objectOptions = (options || []).filter(option => option && typeof option === 'object');
                if (objectOptions[0]) {
                    this.$emit('update:sidepanel-content', {
                        path: 'itemsProperties',
                        value: Object.keys(objectOptions[0]),
                    });
                } else {
                    this.$emit('update:sidepanel-content', { path: 'itemsProperties', value: [] });
                }
            },
        },
        'wwEditorState.sidepanelContent.itemsProperties'(newProperties, oldProperties) {
            if (_.isEqual(newProperties, oldProperties)) return;
            if (this.wwEditorState.boundProps.options && newProperties && newProperties[0]) {
                this.$emit('update:content:effect', { displayField: newProperties[0], valueField: newProperties[0] });
            } else {
                this.$emit('update:content:effect', { displayField: null, valueField: null });
            }
        },
        'wwEditorState.boundProps.options'(isBind) {
            if (!isBind) this.$emit('update:content:effect', { displayField: null, valueField: null });
        },
        'content.value'(value) {
            if (value !== undefined) {
                this.value = value;
                if (!this.options) return;
                this.$refs.input.value = this.options.find(
                    item => item.value.toString().toLowerCase() === value.toString().toLowerCase()
                ).name;
            }
        },
        /* wwEditor:end */
    },
    methods: {
        handleChange(event) {
            if (!this.options) return;
            const value = event.target.value.toLowerCase();
            if (value === '') {
                this.value = '';
                return;
            }

            this.value = this.options.find(item => item.name.toString().toLowerCase() === value).value;
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
