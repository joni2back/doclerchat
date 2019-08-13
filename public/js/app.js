new Vue({
    el: '#chatApp',
    data: {
        selectedWindow: 'chat',
        userName: localStorage.userName,
        roomId: 'docler_chat_room',
        theme: 'light',
        clockMode: 12
    },
    mounted: function() {
        if (! localStorage.userName) {
            this.userName = `Anonymous_${Math.floor(Math.random() * 100)}`;
            localStorage.userName = this.userName;
        }

        if (localStorage.theme) {
            this.theme = localStorage.theme;
        }
        if (localStorage.clockMode) {
            this.clockMode = localStorage.clockMode;
        }
    },
    watch: {
        userName: function(value) {
            localStorage.userName = value;
        },
        theme: function(value) {
            localStorage.theme = value;
        },
        clockMode: function(value) {
            localStorage.clockMode = value;
        }
    },

    methods: {
        setWindow: function(value) {
            this.selectedWindow = value;
        }
    }
});