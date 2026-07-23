export interface UploadResult {
  storageKey: string;
}

export abstract class StorageService {
  abstract upload(
    file: Buffer,
    filename: string
  ): Promise<UploadResult>;

  abstract delete(
    storageKey: string
  ): Promise<void>;

  abstract getSignedUrl(
    storageKey: string
  ): Promise<string>;

  abstract download(
    storageKey: string
  ): Promise<Buffer>;
}
