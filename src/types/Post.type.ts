export enum Kind {
  Thread = 't3',
  Comment = 't1'
}

export type Post = {
  kind: Kind
  id: string
  url: string
  author: string
  thread_id: string
  parent_id?: string
  subreddit: string
  title: string
  body: string
  date: Date
}
