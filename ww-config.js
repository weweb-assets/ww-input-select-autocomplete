export default {
    editor: {
        label: {
            en: 'Autocomplete select',
            fr: 'Autocomplete select',
        },
        icon: 'fontawesome/solid/search',
    },
    triggerEvents: [{ name: 'change', label: { en: 'On change' }, event: { value: '' } }],
    properties: {
        placeholder: {
            label: { en: 'Placeholder', fr: 'Placeholder' },
            type: 'Text',
            options: { placeholder: 'Type text' },
            multiLang: true,
            section: 'settings',
        },
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
        collection: {
            label: {
                en: 'Select from (unpaginated collection)',
            },
            type: 'Collection',
            options: {
                paginated: false,
            },
            section: 'settings',
            bindable: true,
            defaultValue: null,
        },
        displayBy: {
            hidden: content => !content.collection,
            label: {
                en: 'Display by',
                fr: 'Display by',
            },
            type: 'TextSelect',
            options: content => {
                const options = content.itemsProperties.map(item => {
                    return { value: item, label: { en: item } };
                });

                return {
                    options: [{ value: 'none', label: { en: 'Select a property' } }, ...options],
                };
            },
            defaultValue: 'none',
            section: 'settings',
        },
        variableId: {
            label: {
                en: 'Associated variable',
            },
            type: 'Variable',
            options: {
                type: ['String', 'Query', 'Number'],
            },
            section: 'settings',
            defaultValue: null,
        },
        initialValue: {
            label: {
                en: 'Initial value',
            },
            type: 'Text',
            section: 'settings',
            bindable: true,
            hidden: content => content.variableId,
            defaultValue: '',
        },
        itemsProperties: {
            hidden: true,
            defaultValue: [],
        },
    },
};
