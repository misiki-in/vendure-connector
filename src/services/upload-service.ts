import { Upload } from '../types'
import { BaseService} from './base.service'

export class UploadService extends BaseService {
  private static instance:UploadService 

  /**
   * Get the singleton instance
   *
   * @returns {UploadService} The singleton instance ofUploadService 
   */
  static getInstance(): UploadService {
    if (!UploadService.instance) {
      UploadService.instance = new UploadService()
    }
    return UploadService.instance
  }
   async uploadToS3({
    file,
    folderName,
    type
  }: {
    file: File
    folderName: string
    type: string
  }): Promise<Upload> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folderName)
    formData.append('type', type)
    const res1 = await fetch(`/api/upload`, { method: 'POST', body: formData })
    const res = await res1.json()
    return res?.url
  }

   async uploadMultipleToS3({
    files,
    folderName,
    type
  }: {
    files: File[]
    folderName: string
    type: string
  }): Promise<Upload[]> {
    // Read all files as base64
    const fileData = await Promise.all(
      files.map(async (file) => {
        return new Promise<{ name: string; type: string; data: string }>(
          (resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => {
              resolve({
                name: file.name,
                type: file.type,
                data: reader.result as string
              })
            }
            reader.readAsDataURL(file)
          }
        )
      })
    )

    const res: any = await this.post(`/api/upload/multiple`, {
      files: fileData,
      folder: folderName,
      type: type
    })
    return res?.urls
  }
   async deleteFromS3({ url }: { url: string }): Promise<void> {
    // console.log('url', url)
    await this.post(`/api/upload/delete`, { url })
    return
  }
}

// // Use singleton instance
export const uploadService = UploadService.getInstance()
