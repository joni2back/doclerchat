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