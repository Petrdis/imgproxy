const sharp = require('sharp')
const config = require('./config')

module.exports = async ({ path, width, height, quality, crop }) => {
    if (!width || !path) {
        return null
    }
    const imagePath = `${config.basePath}${path}`
    const image = sharp(imagePath)
    let metadata = await image.metadata()

    if (width) {
        if (crop !== null) {
            [cropHeight, cropWidth, left, top] = crop
            if (parseInt(cropHeight) > metadata.height) {
                cropHeight = metadata.height
            }
            if (parseInt(cropWidth) > metadata.width) {
                cropWidth = metadata.width
            }
            image.extract({
                left: parseInt(left),
                top: parseInt(top),
                width: parseInt(cropWidth),
                height: parseInt(cropHeight)
            })
        }
        let options = {
            fit: 'cover',
            withoutEnlargement: false
        }

        options.width = parseInt(width);
        height = parseInt(height);
        options.height = height;

        image.resize(options)
    }

    if (quality && ['jpeg', 'tiff', 'webp'].includes(metadata.format)) {
        image[metadata.format]({ quality : parseInt(quality) })
    }

    return image
}
