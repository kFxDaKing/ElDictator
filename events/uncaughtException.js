module.exports = {
    emitter: process,
    run: (error) => {
        if (!error) return;

        if (client.channels.cache.has(process.env.LOG_CHANNEL_ID)) {
            const errorMsg = (error ? error.stack || error : '').toString().replace(new RegExp(`${__dirname}\/`, 'g'), './');

            client
                .channels
                .cache
                .get(process.env.LOG_CHANNEL_ID)
                .send(null, {
                    embed: {
                        color: 15684432,
                        timestamp: new Date(),
                        title: 'Uncaught Exception',
                        description: `\`\`\`x86asm\n${errorMsg.slice(0, 2048)}\n\`\`\``,
                        fields: [
                            {
                                name: 'Error Name:',
                                value: `\`${error.name || 'N/A'}\``
                            }, {
                                name: 'Error Message:',
                                value: `\`${error.message || 'N/A'}\``
                            }
                        ]
                    }
                })
                .catch(console.error);
        }
    }
};