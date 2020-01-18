import RedditAPI from '../src/RedditAPI'
import { Kind, Post } from '../src/types/Post.type'
import * as pkg from '../package.json'

const CLIENT_ID = process.env['CLIENT_ID'] as string
const CLIENT_SECRET = process.env['SECRET'] as string
const USER_AGENT = `npm:reddit-ts:v${pkg.version} (by /u/aelesia)`
const PASSWORD = process.env['PASSWORD'] as string
const USERNAME = process.env['USERNAME'] as string

let Reddit = new RedditAPI({
  client_id: CLIENT_ID,
  client_secret: CLIENT_SECRET,
  password: PASSWORD,
  username: USERNAME,
  user_agent: USER_AGENT
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
    // console.log(results[0])
    expect(results.length).toEqual(25)
    results.forEach(r => {
      expect(r.kind).toEqual(Kind.Comment)
      expect(r.date).not.toBeNull()
      expect(r.url).not.toBeNull()
      expect(r.title).not.toBeNull()
      expect(r.thread_id).not.toBeNull()
      expect(r.id).not.toBeNull()
      expect(r.id).toMatch(new RegExp('t1_[\\w\\d]{7}'))
      expect(r.body).not.toBeNull()
      expect(r.author).not.toBeNull()
    })
  })

  test('Threads', async () => {
    let results = await Reddit.threads('testingground4bots')
    // console.log(results[0])
    expect(results.length).toEqual(25)
    results.forEach(r => {
      expect(r.kind).toEqual(Kind.Thread)
      expect(r.date).not.toBeNull()
      expect(r.url).not.toBeNull()
      expect(r.title).not.toBeNull()
      expect(r.thread_id).not.toBeNull()
      expect(r.id).not.toBeNull()
      expect(r.id).toMatch(new RegExp('t3_[\\w\\d]{6}'))
      expect(r.body).not.toBeNull()
      expect(r.author).not.toBeNull()
    })
  })

  test('Token', async () => {
    // let results = await reddit.token()
    // // console.log(results)
    // expect(results.access_token).not.toBeNull()
    // expect(results.token_type).toEqual('bearer')
    // expect(results.expires_in).toEqual(3600)
    // expect(results.scope).toEqual('*')
  })

  test('Me', async () => {
    let results = await Reddit.me()
    expect(results).not.toBeNull()
    expect(results.name).toEqual(USERNAME)
  })

  test('Reply', async () => {
    await Reddit.reply('t3_eaiqlw', `[Jest Test] ${USER_AGENT}`)
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

  // describe('reply search delete', () => {
  //   let id = ''
  //   test('Reply', async () => {
  //     await reddit.reply('t3_eaiqlw', '[Jest Test: reply search delete] RedditAPI.test.ts')
  //   })
  //   test('Search & Delete', async () => {
  //     let result = (await reddit.search_all('bot-aelesia-dev'))[0]
  //     expect(result.body).toEqual('[Jest Test: reply search delete] RedditAPI.test.ts')
  //     id = result.id
  //     expect(id).not.toEqual('')
  //     await reddit.delete(id)
  //   })
  //   test('Search post was deleted', async () => {
  //     let results = await reddit.search_all(USERNAME)
  //     expect(
  //       results.some(it => {
  //         return it.id === id
  //       })
  //     ).toEqual(false)
  //   })
  // })
})
