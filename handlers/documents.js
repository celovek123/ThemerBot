const allowedMimeTypes = [`image/png`, `image/jpeg`];

module.exports = bot => {
    bot.on(`document`, async ctx => {
        const mimeType = ctx.message.document.mime_type;

        if (allowedMimeTypes.includes(mimeType)) {
            const typing = ctx.action(`upload_photo`);

            try {
                const photo = await ctx.downloadFile();
                const colors = await ctx.getImageColors(photo, mimeType);
                const previewPhoto = await ctx.makeColorsPreview(colors);
                const keyboard = ctx.keyboard();

                await ctx.replyWithPhoto(
                    { source: previewPhoto },
                    {
                        reply_markup: keyboard,
                        caption: ctx.i18n(`choose_color_1`),
                        reply_to_message_id: ctx.message.message_id,
                    }
                );

                ctx.theme = {
                    photo,
                    colors,
                    using: [],
                };
            } catch (e) {
                await ctx.reply(ctx.i18n(`error`));
            } finally {
                typing.stop();
            }
        }
    });
};