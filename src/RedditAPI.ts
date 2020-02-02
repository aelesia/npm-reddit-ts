import { Comments } from './types/Comments.type'
import { Threads } from './types/Threads.type'
import Http, { OAuth2Token } from 'httyp'
import { Post } from './types/Post.type'
import { JQueryResponse, Token } from './types/RedditAPI.type'
import { Me } from './types/Me.type'
import { RedditAPIErr } from './RedditAPIErr'
import { Search } from './types/Search.type'
import { map_search, map_t1, map_t3 } from './Map'
import { DateUtil, rethrow } from '@aelesia/commons'
import { RedditAuthToken } from './RedditAuthToken'

type Credentials = {
  user_agent: string
  o2a?: {
    client_id: string
    client_secret: string
    password: string
    username: string
  }
  o2a_implicit?: {
    client_id: string
    client_secret: string
    redirect_uri: string
    code: string
  }
  bearer_token?: string
}

export default class RedditAPI {
  oauth2: Http = null as any

  constructor(credentials: Credentials) {
    if (credentials.o2a) {
      this.oauth2 = Http.url('')
        .auth_oauth2_password(
          new OAuth2Token({
            access_token_url: 'https://www.reddit.com/api/v1/access_token',
            client_id: credentials.o2a.client_id,
            client_secret: credentials.o2a.client_secret,
            password: credentials.o2a.password,
            username: credentials.o2a.username
          })
        )
        .header('User-Agent', credentials.user_agent)
    } else if (credentials.bearer_token) {
      this.oauth2 = Http.url('')
        .auth_bearer(credentials.bearer_token)
        .header('User-Agent', credentials.user_agent)
    } else if (credentials.o2a_implicit) {
      this.oauth2 = Http.url('')
        .auth_oauth2_password(
          new RedditAuthToken({
            client_id: credentials.o2a_implicit.client_id,
            client_secret: credentials.o2a_implicit.client_secret,
            code: credentials.o2a_implicit.code,
            redirect_uri: credentials.o2a_implicit.redirect_uri
          })
        )
        .header('User-Agent', credentials.user_agent)
    }
  }

  set_token(bearer_token: string): void {
    this.oauth2 = this.oauth2.auth_bearer(bearer_token)
  }

  async comments(subreddit: string): Promise<Post[]> {
    return await this.trycatch<Post[]>(async () => {
      let data = (await Http.url(`https://www.reddit.com/r/${subreddit}/comments.json`).get<Comments>()).data

      return data.data.children.map(map_t1)
    })
  }

  async threads(subreddit: string): Promise<Post[]> {
    return await this.trycatch<Post[]>(async () => {
      let data = (await Http.url(`https://www.reddit.com/r/${subreddit}/new.json`).get<Threads>()).data

      return data.data.children.map(map_t3)
    })
  }

  async reply(thing_id: string, text: string): Promise<void> {
    return await this.trycatch<void>(async () => {
      let resp = await this.oauth2
        .url('https://oauth.reddit.com/api/comment')
        .body_forms({ thing_id, text })
        .post<JQueryResponse>()

      if (!resp.data.success) {
        if (JSON.stringify(resp.data.jquery).includes('you are doing that too much')) {
          throw new RedditAPIErr.PostLimit(`thing_id: ${thing_id}`)
        }
        throw new RedditAPIErr.Failed(`${JSON.stringify(resp.data)}`)
      }
    })
  }

  async implicit_token(
    client_id: string,
    client_secret: string,
    redirect_uri: string,
    code: string
  ): Promise<Token & { expires_on: Date }> {
    return await this.trycatch<Token & { expires_on: Date }>(async () => {
      let resp = (
        await Http.url('https://www.reddit.com/api/v1/access_token')
          .auth_basic(client_id, client_secret)
          .body_forms({
            grant_type: 'authorization_code',
            code,
            redirect_uri
          })
          .post<Token | { error: string }>()
      ).data

      if ('error' in resp) {
        throw new RedditAPIErr.Unauthorized(resp.error)
      }
      return { ...resp, ...{ expires_on: DateUtil.add(resp.expires_in * 1000) } }
    })
  }

  async me(): Promise<Me> {
    return await this.trycatch<Me>(async () => {
      return (await this.oauth2.url('https://oauth.reddit.com/api/v1/me').get<Me>()).data
    })
  }

  private async search(username: string, after?: string): Promise<Search> {
    return (await Http.url(`https://www.reddit.com/user/${username}.json?limit=100&after=${after ?? ''}`).get<Search>())
      .data
  }

  async search_all(username: string, max_results = 999): Promise<Post[]> {
    return await this.trycatch<Post[]>(async () => {
      let data: Search | undefined
      let all_posts: Post[] = []
      do {
        data = await this.search(username, data?.data.after ?? '')
        let map = data.data.children.map(map_search)
        all_posts = all_posts.concat(map)
      } while (data.data.after && all_posts.length < max_results)

      return all_posts
    })
  }

  async delete(id: string): Promise<void> {
    return await this.trycatch<void>(async () => {
      await this.oauth2
        .url('https://oauth.reddit.com/api/del')
        .body_forms({ id })
        .post<JQueryResponse>()
    })
  }

  async edit(thing_id: string, text: string): Promise<void> {
    return await this.trycatch<void>(async () => {
      let resp = await this.oauth2
        .url('https://oauth.reddit.com/api/editusertext')
        .body_forms({ thing_id, text })
        .post<JQueryResponse>()
      if (!resp.data.success) {
        throw new RedditAPIErr.Failed(`${JSON.stringify(resp.data)}`)
      }
    })
  }

  async trycatch<T>(func: () => Promise<T>): Promise<T> {
    try {
      return await func()
    } catch (e) {
      if (e instanceof RedditAPIErr.General) throw e
      else if (e.response?.status === 503 ?? false) rethrow(new RedditAPIErr.ServerBusy('Reddit Servers Busy'), e)
      else if (e.response?.status === 401 ?? false)
        rethrow(new RedditAPIErr.Unauthorized('Unauthorized. Check your credentials'), e)
      else if (e instanceof TypeError && e.message.match(/Cannot read property .* of null/)) {
        rethrow(new RedditAPIErr.Null('Did you forget to initialize RedditAPI Client with O2A or Bearer token?'), e)
      }
      rethrow(new RedditAPIErr.General(e.message), e)
      throw Error('trycatch')
    }
  }
}
