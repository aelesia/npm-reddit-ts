export namespace RedditAPIErr {
  export class General extends Error {
    constructor(msg: string) {
      super(msg)
      this.name = 'RedditAPIGeneralError'
      Object.setPrototypeOf(this, General.prototype)
    }
  }

  export class PostLimit extends General {
    constructor(msg: string) {
      super(msg)
      this.name = 'RedditAPIPostLimitError'
      Object.setPrototypeOf(this, PostLimit.prototype)
    }
  }

  export class ServerBusy extends General {
    constructor(msg: string) {
      super(msg)
      this.name = 'RedditAPIServerBusyError'
      Object.setPrototypeOf(this, ServerBusy.prototype)
    }
  }

  export class Failed extends General {
    constructor(msg: string) {
      super(msg)
      this.name = 'RedditAPIFailedError'
      Object.setPrototypeOf(this, Failed.prototype)
    }
  }

  export class Null extends General {
    constructor(msg: string) {
      super(msg)
      this.name = 'RedditAPINullError'
      Object.setPrototypeOf(this, Null.prototype)
    }
  }

  export class Unauthorized extends General {
    constructor(msg: string) {
      super(msg)
      this.name = 'RedditAPIUnauthorizedError'
      Object.setPrototypeOf(this, Unauthorized.prototype)
    }
  }
}
