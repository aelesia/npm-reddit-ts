import RedditAPI from '../src/RedditAPI'
import { Post } from '../src/types/models/Post.type'
import { Date_, Time } from '@aelesia/commons'
import * as pkg from '../package.json'

const CLIENT_ID = process.env['O2A_CLIENT_ID'] as string
const CLIENT_SECRET = process.env['O2A_SECRET'] as string
const USER_AGENT = `npm:reddit-ts:v${pkg.version} (by /u/aelesia)`
const PASSWORD = process.env['O2A_PASSWORD'] as string
const USERNAME = process.env['O2A_USERNAME'] as string

let Reddit = new RedditAPI({
  user_agent: USER_AGENT,
  o2a: {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    password: PASSWORD,
    username: USERNAME
  }
})

describe('RedditAPI', () => {
  beforeAll(() => {
    expect(CLIENT_ID).toBeDefined()
    expect(CLIENT_SECRET).toBeDefined()
    expect(USER_AGENT).toBeDefined()
    expect(PASSWORD).toBeDefined()
    expect(USERNAME).toBeDefined()
  })

  test('Comments', async () => {
    let results = await Reddit.comments('testingground4bots')
    expect(results.length).toEqual(25)
    results.forEach(r => {
      expect(r.kind).toEqual('t1')
      expect(r.date).not.toBeNull()
      expect(r.date).toBeInstanceOf(Date)
      expect(Date_.isBefore(r.date, Date_.now())).toBeTruthy()
      expect(Date_.isAfter(r.date, Date_.minus(Time.days(365), Date_.now()))).toBeTruthy()
      expect(r.url).not.toBeNull()
      expect(r.title).not.toBeNull()
      expect(r.thread_id).not.toBeNull()
      expect(r.id).not.toBeNull()
      expect(r.id).toMatch(new RegExp('t1_[\\w\\d]{7}'))
      expect(r.subreddit).toEqual('testingground4bots')
      expect(r.body).not.toBeNull()
      expect(r.author).not.toBeNull()
    })
  })

  test('Threads', async () => {
    let results = await Reddit.threads('testingground4bots')
    expect(results.length).toEqual(25)
    results.forEach(r => {
      expect(r.kind).toEqual('t3')
      expect(r.date).not.toBeNull()
      expect(r.date).toBeInstanceOf(Date)
      expect(Date_.isBefore(r.date, Date_.now())).toBeTruthy()
      expect(Date_.isAfter(r.date, Date_.minus(Time.days(365), Date_.now()))).toBeTruthy()
      expect(r.url).not.toBeNull()
      expect(r.title).not.toBeNull()
      expect(r.thread_id).not.toBeNull()
      expect(r.id).not.toBeNull()
      expect(r.id).toMatch(new RegExp('t3_[\\w\\d]{6}'))
      expect(r.subreddit).toEqual('testingground4bots')
      expect(r.body).not.toBeNull()
      expect(r.author).not.toBeNull()
    })
  })

  test('Me', async () => {
    let results = await Reddit.me()
    expect(results).not.toBeNull()
    expect(results.name).toEqual(USERNAME)
  })

  test('Reply', async () => {
    const results = await Reddit.threads('testingground4bots')
    await Reddit.reply(results[0].id, `[Jest Test Reply ${new Date().toLocaleString()}] ${USER_AGENT}`)
  })

  describe('Search & Delete', () => {
    let post: Post

    test('Search', async () => {
      let results = await Reddit.search_all('bot-aelesia-dev')
      expect(results.length > 0)
      results.forEach(r => {
        expect(r.kind).not.toBeNull()
        expect(r.date).not.toBeNull()
        expect(r.url).not.toBeNull()
        expect(r.title).not.toBeNull()
        expect(r.thread_id).not.toBeNull()
        expect(r.id).not.toBeNull()
        expect(r.body).not.toBeNull()
        expect(r.author).toEqual(USERNAME)
      })
      post = results[0]
    })
    test('Delete', async () => {
      await Reddit.delete(post.id)
    })
  })

  test('Edit', async () => {
    await Reddit.edit('t3_eaiqlw', `[Jest Test Edit ${new Date().toLocaleString()}] ${USER_AGENT}`)
  })

  test('Search Max Posts 100', async () => {
    let results = await Reddit.search_all('aelesia-', 100)
    expect(results.length).toBeLessThanOrEqual(100)
  })

  test('User', async () => {
    let results = await Reddit.user('bot-aelesia-dev')
    expect(results.is_employee).toEqual(false)
    expect(results.is_friend).toEqual(false)
    expect(results.awardee_karma).toEqual(0)
    expect(results.id).toEqual('18vcwzqz')
    expect(results.verified).toEqual(true)
    expect(results.is_gold).toEqual(false)
    expect(results.is_mod).toEqual(false)
    expect(results.awarder_karma).toEqual(0)
    expect(results.has_verified_email).toEqual(false)
    expect(results.icon_img).toEqual('https://www.redditstatic.com/avatars/avatar_default_16_EA0027.png')
    expect(results.hide_from_robots).toEqual(false)
    expect(results.link_karma).toBeGreaterThanOrEqual(1)
    expect(results.pref_show_snoovatar).toEqual(false)
    expect(results.total_karma).toBeGreaterThanOrEqual(3)
    expect(results.name).toEqual('bot-aelesia-dev')
    expect(results.created).toEqual(1524598131)
    expect(results.created_utc).toEqual(1524569331)
    expect(results.comment_karma).toBeGreaterThanOrEqual(2)
    expect(results.has_subscribed).toEqual(false)
    // @ts-ignore
    expect(results['subreddit']).toBeUndefined()
  })

  test('post_t3', async () => {
    let results = await Reddit.post('t3_irtuce')
    expect(results.author).toEqual('aelesia-dev')
    expect(results.id).toEqual('t3_irtuce')
    expect(results.parent_id).toBeUndefined()
    expect(results.body).toEqual('Body')
    expect(results.date).toEqual(Date_.parse(1599981923))
    expect(results.title).toEqual('Title')
    expect(results.kind).toEqual('t3')
    expect(results.subreddit).toEqual('testingground4bots')
    expect(results.url).toContain('r/testingground4bots/comments/irtuce/title')
  })

  test('post_t1', async () => {
    let results = await Reddit.post('t1_g52b546')
    expect(results.author).toEqual('aelesia-dev')
    expect(results.id).toEqual('t1_g52b546')
    expect(results.parent_id).toEqual('t3_irtuce')
    expect(results.body).toEqual('Comment')
    expect(results.date).toEqual(Date_.parse(1599981934))
    expect(results.title).toBeUndefined()
    expect(results.kind).toEqual('t1')
    expect(results.subreddit).toEqual('testingground4bots')
    expect(results.url).toContain('/r/testingground4bots/comments/irtuce/title/g52b546')
  })

  test('compose', async () => {
    await Reddit.compose(USERNAME, 'Jest Test', Date_.now().toUTCString())
  })
})
