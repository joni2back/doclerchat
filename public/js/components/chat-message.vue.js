function formatDate(date, isAmPmMode) {
    //should be good to use moment() here
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
        avatarUrl: function() {
            //allow mongoose to save profile image url?
            return this.itsMe ? 'https://66.media.tumblr.com/2cf732ea2b706a10c855a01ce90c7c5f/tumblr_oynf74zBnM1ujp508o6_250.png' : 'https://i.pinimg.com/280x280_RS/ae/b0/04/aeb004cc78cb53dba21b8bcf07e71333.jpg';
        },
        answerClass: function() {
            return this.itsMe ? 'right' : 'left';
        },
        formatedDate: function() {
            return formatDate(this.date, this.clockMode == 12);
        },
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