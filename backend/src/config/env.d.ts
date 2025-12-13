declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      AUTH_SECRET: string;
      DEVELOPMENT_API_URL: string;
      PRODUCTION_API_URL: string;
      AWS_REGION: string;
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;
      AWS_CLOUDFRONT_DOMAIN: string;
      AWS_MEDIA_S3_BUCKET_NAME: string;
      AWS_MEDIA_S3_ENDPOINT: string;
    }
  }
}

export {};
