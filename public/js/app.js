new Vue({
    el: '#chatApp',
    data: {
        userName: null,
        selectedWindow: 'chat',
        roomId: 'Docler',
        theme: 'light',
        clockMode: 12,
        availableClockModes: [12, 24],
        availableThemes: ['light', 'dark'],
        availableRooms: ['Docler', 'Music', 'Movies', 'Development'],
    },
    beforeMount: function() {
        this.userName = localStorage.userName || `guest_${Math.floor(Math.random() * 1000)}`;

        if (localStorage.roomId) {
            this.roomId = localStorage.roomId;
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
        roomId: function(value) {
            localStorage.roomId = value;
        },
        theme: function(value) {
            localStorage.theme = value;
        },
        clockMode: function(value) {
            localStorage.clockMode = value;
        }
    },
    methods: {
        applyTitle: function(value) {
            document.title = value;
        },
        setWindow: function(value) {
            this.selectedWindow = value;
        },
        revertSettings: function() {
            return Object.assign(this, {
                selectedWindow: 'chat',
                roomId: 'Docler',
                theme: 'light',
                clockMode: 12,
            })
        }
    }
});