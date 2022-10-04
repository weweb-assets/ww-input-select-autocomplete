export default {
    editor: {
        label: {
            en: 'Autocomplete select',
            fr: 'Autocomplete select',
        },
        icon: 'fontawesome/solid/search',
    },
    triggerEvents: [
        { name: 'change', label: { en: 'On change' }, event: { value: '' }, default: true },
        { name: 'search', label: { en: 'On search' }, event: { value: '' } },
        { name: 'initValueChange', label: { en: 'On init value change' }, event: { value: '' } },
    ],
    properties: {
        color: {
            label: { en: 'Color', fr: 'Couleur' },
            type: 'Color',
            defaultValue: 'black',
        },
        fontFamily: {
            type: 'FontFamily',
            label: { en: 'Font family', fr: 'Font' },
            defaultValue: '',
        },
        fontSize: {
            type: 'Length',
            label: { en: 'Font size', fr: 'Taille du texte' },
            options: {
                unitChoices: [
                    { value: 'px', label: 'px', min: 10, max: 50 },
                    { value: 'em', label: 'em', min: 1, max: 50 },
                    { value: 'rem', label: 'rem', min: 1, max: 50 },
                ],
            },
            defaultValue: '15px',
        },
        options: {
            label: { en: 'Options', fr: 'Options' },
            type: 'Info',
            options: {
                text: 'Bind options list',
            },
            bindable: true,
            defaultValue: [],
            section: 'settings',
        },
        displayField: {
            hidden: (content, sidepanelContent, boundProps) => !boundProps.options || !content.options,
            label: {
                en: 'Option label',
                fr: 'Option label',
            },
            type: 'Formula',
            options: content => ({ template: content.options.length ? content.options[0] : null }),
            defaultValue: null,
            section: 'settings',
        },
        valueField: {
            hidden: (content, sidepanelContent, boundProps) => !boundProps.options || !content.options,
            label: {
                en: 'Option value',
                fr: 'Option value',
            },
            type: 'Formula',
            options: content => ({ template: content.options.length ? content.options[0] : null }),
            defaultValue: null,
            section: 'settings',
        },
        value: {
            label: {
                en: 'Init value',
            },
            type: 'Text',
            section: 'settings',
            bindable: true,
        },
        placeholder: {
            label: { en: 'Placeholder', fr: 'Placeholder' },
            type: 'Text',
            options: { placeholder: 'Type text' },
            multiLang: true,
            section: 'settings',
            bindable: true,
        },
        required: {
            label: 'Required',
            type: 'OnOff',
            section: 'settings',
            defaultValue: true,
            bindable: true,
        },
        itemsProperties: {
            editorOnly: true,
            hidden: true,
            defaultValue: [],
        },
    },
};
