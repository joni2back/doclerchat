Vue.component('chat-message', {
	template: '#chat-message',
    props: {
        body: String,
        date: String,
        userName: String,
        itsMe: Boolean,
        clockMode: String
	},
	computed: {
        /**
         * get avatar url for user message
         * @todo allow mongoose to save profile image url?
         * @returns String
         */
        avatarUrl: function() {
            return this.itsMe ? 'https://bit.ly/2OVxBxY' : 'https://bit.ly/2KHREdP';
        },

        /**
         * get the class to align message to left or right based on own messages
         * @returns String
         */
        answerClass: function() {
            return this.itsMe ? 'right' : 'left';
        },

        /**
         * format date from utc date
         * @returns String
         */
        formatedDate: function() {
            return formatDate(this.date, this.clockMode == 12);
        },

        /**
         * parse message body to detect media sources such as links, youtube links and images
         * @returns String
         */
        mediaHtml: function() {
            const links = this.body.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig) || [];
            const linksParsed = links.map(href => {
                if (/youtube.com/.test(href)) {
                    //will be parsed as video thumb below
                    return;
                }
                
                if (/(jpe?g|png|bmp|tiff?|gif)$/.test(href)) {
                    return `<a target="_blank" href="${href}">
                        <img class="img-thumbnail message-media-img" src="${href}" />
                    </a>`;
                }

                return `<a class="label label-warning" target="_blank" href="${href}"><i class="fa fa-link"></i> ${href}</a>`;
            });

            const youtubeIds = this.body.match(/(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?/g) || [];
            const youtubeIdsParsed = youtubeIds.map(href => {
                const videoId = href.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/).pop();
                return videoId ? `<a target="_blank" href="https://www.youtube.com/watch?v=${videoId}">
                    <img class="img-thumbnail message-media-img" src="//img.youtube.com/vi/${videoId}/0.jpg" />
                </a>` : '';
            });

            return [...linksParsed, ...youtubeIdsParsed].join('&nbsp;');
        }
    }
});

/**
 * Date formatter
 * @todo should be good to use moment() here
 * @param String|Date|Number date 
 * @param Boolean isAmPmMode 
 * @returns String
 */
function formatDate(date, isAmPmMode) {
    date = new Date(date);

    let hour = ('0' + date.getHours()).slice(-2);
    let ampm = '';
    
    if (isAmPmMode) {
        ampm = hour > 12 ? 'PM' : 'AM';
        hour = (hour % 12) || 12;
        hour = ('0' + hour).slice(-2);
    }
    
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + date.getMonth() + 1).slice(-2);
    const year = date.getFullYear();
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);

    return `${hour}:${minutes} ${ampm} - ${day}/${month}/${year}`;
}