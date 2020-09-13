import { Comment } from './types/CommentsResult.type'
import { Post } from './types/models/Post.type'
import { Thread } from './types/ThreadsResult.type'
import { Child } from './types/SearchResult.type'
import { _, Err } from '@aelesia/commons'

export function map_t1(it: Comment): Post {
  return {
    id: `t1_${it.data.id}`,
    author: it.data.author,
    body: it.data.body,
    date: _.date.parse(it.data.created_utc),
    kind: 't1',
    subreddit: it.data.subreddit,
    parent_id: it.data.parent_id,
    thread_id: it.data.link_id,
    title: it.data.link_title,
    url: `https://reddit.com${it.data.permalink}`
  }
}

export function map_t3(it: Thread): Post {
  // HACK: AWS DyanmoDB cannot insert keys with empty values
  //  Please fix AWS DynamoDB insert function instead!
  return {
    id: it.data.name,
    author: it.data.author,
    // body: it.data.selftext
    body: it.data.selftext === '' ? '<empty>' : it.data.selftext,
    date: _.date.parse(it.data.created_utc),
    kind: 't3',
    subreddit: it.data.subreddit,
    thread_id: it.data.name,
    title: it.data.title,
    url: it.data.url
  }
}

export function map_search(it: Child): Post {
  if (it.kind === 't1') {
    return map_t1(it as any)
  } else if (it.kind === 't3') {
    return map_t3(it as any)
  } else {
    throw new Err.IllegalArgumentErr(`Invalid kind: ${it.kind}, id: ${it.data.id}`)
  }
}
