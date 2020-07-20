class General extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = 'RedditAPIGeneralError'
    Object.setPrototypeOf(this, General.prototype)
  }
}

class PostLimit extends General {
  constructor(msg: string) {
    super(msg)
    this.name = 'RedditAPIPostLimitError'
    Object.setPrototypeOf(this, PostLimit.prototype)
  }
}

class ServerBusy extends General {
  constructor(msg: string) {
    super(msg)
    this.name = 'RedditAPIServerBusyError'
    Object.setPrototypeOf(this, ServerBusy.prototype)
  }
}

class Failed extends General {
  constructor(msg: string) {
    super(msg)
    this.name = 'RedditAPIFailedError'
    Object.setPrototypeOf(this, Failed.prototype)
  }
}

class Null extends General {
  constructor(msg: string) {
    super(msg)
    this.name = 'RedditAPINullError'
    Object.setPrototypeOf(this, Null.prototype)
  }
}

class Unauthorized extends General {
  constructor(msg: string) {
    super(msg)
    this.name = 'RedditAPIUnauthorizedError'
    Object.setPrototypeOf(this, Unauthorized.prototype)
  }
}

export const RedditAPIErr = {
  General,
  PostLimit,
  ServerBusy,
  Failed,
  Null,
  Unauthorized
}
