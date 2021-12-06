import { S3 } from 'aws-sdk';

let client: S3 = null
const { AWS_ENDPOINT } = process.env;


/**
 * Function to get SQSClient instance.
 */
const getClient = () => {
  if (client === null) {
    client = new S3({
      s3ForcePathStyle: true,
      endpoint: AWS_ENDPOINT
    });
  }

  return client;
};

/**
 * Function to get object from S3.
 * @param bucketName
 * @param fileKey
 * @param [options] - request options
 * @param [options.toStream] - request options
 */
export const getObject = async (bucketName: string, fileKey: string, options) => {
  const { toStream = false } = options;
  const params = {
    Bucket: bucketName,
    Key: fileKey
  };

  const s3BaseRequest = getClient().getObject(params);

  if (toStream) {
    return s3BaseRequest.createReadStream();
  }

  return s3BaseRequest.promise();
}
