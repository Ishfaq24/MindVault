export interface UploadFileDTO {
  originalName: string;
  filename: string;
  extension: string;
  mimeType: string;
  size: number;
  storageKey: string;
}