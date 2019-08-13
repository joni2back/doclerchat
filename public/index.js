function formatDate(date) {
    date = new Date(date);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + date.getMonth() + 1).slice(-2);
    const year = date.getFullYear();
    const hour = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    return hour + ':' + minutes + ' ' + day + '/' + month + '/' + year;
}

function getHistory(conversationId, lastOne) {
    return new Promise((resolve, reject) => {
        const url = `/history/${conversationId}/${lastOne || ''}`;

        fetch(url).then(response => {
            const contentType = response.headers.get('content-type');
            const isJson = /(application|text)\/json/.test(contentType);
    
            if (! response.ok) {
                throw isJson ? response.json() : Error('unknown_response');
            }

            response.json()
                .then(resolve)
                .catch(reject);

        }).catch(reject);
    });
};

Vue.component('template-chat-message', {
	template: '#template-chat-message',
    props: {
        body: String,
        date: String,
        type: String,
        userName: String,
        userId: String,
        organizationName: String
	},
	computed: {
        itsMe: function() {
            return this.userName === 'mmmmmmm';
        },
        avatarUrl: function() {
            return 'https://www.nretnil.com/avatar/LawrenceEzekielAmos.png';
        },
        answerClass: function() {
            return this.itsMe ? 'right' : 'left';
        },
        formatedDate: function() {
            return formatDate(this.date);
        },
        fullName: function() {
            return `${this.userName}`;
        },
        mediaHtml: function() {
            const links = this.body.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig) || [];
            const linksParsed = links.map(href => {
                return `<a class="label label-warning" target="_blank" href="${href}"><i class="fa fa-link"></i> ${href}</a>`;
            });

            return [...linksParsed, ...[]].join('&nbsp;');
        }
    }
});

new Vue({
    el: '#chatApp',
    data: {
        config: {
            roomId: 'docler_chat_1',
            userName: 'Anon',
            userId: 1234,
        },
        input: '',
        messages: [],
        socket: null,
        roomId: null,
        connected: false,
        historyLoaded: false,
        typing: null,
        beepSound: null
    },
    mounted: function() {
        this.beepSound = new Audio('./notification.mp3');
        this.initSocket();
        this.registerInfiniteScroll();
    },
    methods: {
        initSocket: function() {
            this.socket = io.connect(location.hostname + ':' + location.port, {
                reconnection: true
            });

            this.socket.once('connect', () => {
                this.socket.emit('join_conversation', this.config.roomId);
                this.connected = true;
                this.loadHistory(this.config.roomId);
                window.console.warn('__chat_connection_success');
            }).once('connect_error', (e) => {
                this.connected = false;
                this.loadHistory(this.config.roomId);
                window.console.warn('__chat_connection_error');
            }).once('connect_timeout', () => {
                this.connected = false;
                this.loadHistory(this.config.roomId);
                window.console.warn('__chat_connection_timeout');
            }).once('disconnect', () => {
                this.connected = false;
                window.console.warn('__chat_connection_disconnect');
                this.initSocket();
            });

            this.socket.emit('user_join_room', this.config);

            this.socket.on('new_message', data => {
                this.typing = null;
                this.beep();
                this.messages.push(data);
                this.scrollDown();
            });
        
            let typingTimeout = null;
            this.socket.on('typing', data => {
                if (data.userName == this.config.userName) {
                    return;
                }
    
                this.typing = data;
                window.clearTimeout(typingTimeout);
                typingTimeout = setTimeout(() => {
                    this.typing = null;
                }, 5000);
            });
        },
        getChatElement: function() {
            return this.chatElement || (this.chatElement = window.document.querySelector('.chat'));
        },
        beep: function() {
            this.beepSound && this.beepSound.play();
        },
        scrollDown: function() {
            setTimeout(() => {
                const el = this.getChatElement();
                return el && el.scrollTo(0, 9999);
            }, 50);
        },
        registerInfiniteScroll: function() {
            const el = this.getChatElement();
            el && (el.onscroll = () => el.scrollTop === 0 && this.loadHistoryFroomScroll());
        },
        loadHistoryFroomScroll: function() {
            const el = this.getChatElement();
            getHistory(this.config.roomId, this.historyLoaded).then(response => {
                if (! response.length) {
                    return;
                }
                this.historyLoaded = response[0]._id;
                this.messages = [...response, ...this.messages];
                el && el.scrollTo(0, 10);
            });
        },
        loadHistory: function() {
            !this.historyLoaded && getHistory(this.config.roomId).then(response => {
                if (! response.length) {
                    this.historyLoaded = true;
                    return;
                }
                this.historyLoaded = response[0]._id;
                this.messages = response;
                this.scrollDown();
            }).catch(error => {
                window.console.warn('__chat_cannot_get_history');
            });
        },
        sendMsg: function(event) {
            if (! this.socket) {
                return;
            }

            this.socket.emit('new_message', {
                body: this.input,
                roomId: this.config.roomId
            });

            this.input = '';
            this.scrollDown();
        },
        update: function (e) {
            this.input = e.target.value;
            this.socket.emit('typing', {
                roomId: this.config.roomId
            });
        }
    }
});