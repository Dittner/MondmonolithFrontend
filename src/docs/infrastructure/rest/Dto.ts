export interface RequestBody {
  serialize: () => string
}

export interface UserDto {
  id: number
  email: string
  role: string
  token: string
}

export class SignUpRequest implements RequestBody {
  username: string
  password: string
  verificationCode: string
  constructor(username: string, password: string, verificationCode: string) {
    this.username = username
    this.password = password
    this.verificationCode = verificationCode
  }

  serialize() {
    return JSON.stringify(this)
  }
}

export class SignInRequest implements RequestBody {
  username: string
  password: string
  constructor(username: string, password: string) {
    this.username = username
    this.password = password
  }

  serialize() {
    return JSON.stringify(this)
  }
}

export class DirDto implements RequestBody {
  id: number
  title: string
  constructor(id: number, title: string) {
    this.id = id
    this.title = title
  }

  serialize() {
    return JSON.stringify(this)
  }
}

export class DocDto implements RequestBody {
  id: number
  dirId: number
  title: string
  publicKey: string
  constructor(id: number, dirId: number, title: string, publicKey: string) {
    this.id = id
    this.dirId = dirId
    this.title = title
    this.publicKey = publicKey
  }

  serialize() {
    return JSON.stringify(this)
  }
}

export class PageDto implements RequestBody {
  id: number
  docId: number
  title: string
  blocks: string[]
  constructor(id: number, docId: number, title: string, blocks: string[]) {
    this.id = id
    this.docId = docId
    this.title = title
    this.blocks = blocks
  }

  serialize() {
    return JSON.stringify(this)
  }
}
