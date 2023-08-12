export class Base64 {
  static encode(text: string): string {
    return btoa(text)
  }

  static decode(base64: string): string {
    return atob(base64)
  }
}
