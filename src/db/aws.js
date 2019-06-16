var aws = require('aws-sdk')

var s3Bucket = new aws.S3({
    params: {
        Bucket: 'kizuna',
        ACL: "public-read"
    }
})

module.exports = s3Bucket