import san from 'san';

const InputComponent = san.defineComponent({
    template: `
        <input type="text" value="{{ value }}" />
    `
});

const LabelComponent = san.defineComponent({
    template: `
        <u>{{ value }}</u>
    `
});

const inputLoader = san.createComponentLoader({
    load() {
        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve(InputComponent);
            }, 1e3);
        });
    },
    placeholder: LabelComponent
});

const MyApp = san.defineComponent({
    components: {
        'x-input': inputLoader
    },
    template: `
        <div>
            <x-input value="{{ name }}"></x-input>
        </div>
    `
});

const myApp = new MyApp({
    data: {
        name: 'San'
    }
});

myApp.attach(document.body);
