export interface ExpressFormidableOptions {
  encoding?: string;
  uploadDir?: string;
  keepExtensions?: boolean;
  type?: 'multipart' | 'urlencoded';
  maxFileSize?: number;
  maxFieldsSize?: number;
  maxFields?: number;
  hash?: boolean | 'sha1' | 'md5';
  multiples?: boolean;
}
