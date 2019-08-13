Vue.component('chat-window', {
	template: '#chat-window',
    props: {
        roomId: String,
        userName: String,
        userId: Number,
    },
    data: function() {
        return {
            input: '',
            messages: [],
            socket: null,
            connected: false,
            historyLoaded: false,
            typing: null,
            beepSound: null,
        }
    },
    mounted: function() {
        this.beepSound = new Audio('./media/notification.mp3');
        this.initSocket();
        this.registerInfiniteScroll();
    },
    methods: {
        initSocket: function() {
            
            this.socket = io.connect(location.hostname + ':' + location.port, {
                reconnection: true
            });

            this.socket.once('connect', () => {
                this.socket.emit('join_conversation', this.roomId);
                this.connected = true;
                this.loadHistory(this.roomId);
                window.console.warn('__chat_connection_success');
            }).once('connect_error', (e) => {
                this.connected = false;
                this.loadHistory(this.roomId);
                window.console.warn('__chat_connection_error');
            }).once('connect_timeout', () => {
                this.connected = false;
                this.loadHistory(this.roomId);
                window.console.warn('__chat_connection_timeout');
            }).once('disconnect', () => {
                this.connected = false;
                window.console.warn('__chat_connection_disconnect');
                this.initSocket();
            });
            
            this.socket.emit('user_join_room', {
                roomId: this.roomId,
                userName: this.userName,
                userId: this.userId
            });
            this.socket.on('new_message', data => {
                this.typing = null;
                this.beep();
                this.messages.push(data);
                this.scrollDown();
            });
        
            let typingTimeout = null;
            this.socket.on('typing', data => {
                if (data.userName == this.userName) {
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
            getHistory(this.roomId, this.historyLoaded).then(response => {
                if (! response.length) {
                    return;
                }
                this.historyLoaded = response[0]._id;
                this.messages = [...response, ...this.messages];
                el && el.scrollTo(0, 10);
            });
        },
        loadHistory: function() {
            !this.historyLoaded && getHistory(this.roomId).then(response => {
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
                roomId: this.roomId
            });

            this.input = '';
            this.scrollDown();
        },
        update: function (e) {
            this.input = e.target.value;
            this.socket.emit('typing', {
                roomId: this.roomId
            });
        }
    }
});