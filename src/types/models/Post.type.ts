export type Post = {
  kind: 't1' | 't3'
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
