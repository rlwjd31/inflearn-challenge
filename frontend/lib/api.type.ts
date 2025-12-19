export type VideoStorageInfo = Record<string, unknown> & {
  s3: {
    cloudFront: {
      url: string;
    };
  };
};
