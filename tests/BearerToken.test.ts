import RedditAPI from '../src/RedditAPI'
import * as pkg from '../package.json'
import Http from 'httyp'
import { Token, TokenForm } from '../src/types/RedditAPI.type'
import { RedditAPIErr } from '../src/RedditAPIErr'

const CLIENT_ID = process.env['O2A_CLIENT_ID'] as string
const CLIENT_SECRET = process.env['O2A_SECRET'] as string
const USER_AGENT = `npm:reddit-ts:v${pkg.version} (by /u/aelesia)`
const PASSWORD = process.env['O2A_PASSWORD'] as string
const USERNAME = process.env['O2A_USERNAME'] as string

let Reddit: RedditAPI = null as any

describe('Bearer Token', () => {
  let token: string

  beforeAll(async () => {
    expect(CLIENT_ID).toBeDefined()
    expect(CLIENT_SECRET).toBeDefined()
    expect(USER_AGENT).toBeDefined()
    expect(PASSWORD).toBeDefined()
    expect(USERNAME).toBeDefined()

    token = (
      await Http.url('https://www.reddit.com/api/v1/access_token')
        .auth_basic(CLIENT_ID, CLIENT_SECRET)
        .body_forms<TokenForm>({
          grant_type: 'password',
          username: USERNAME,
          password: PASSWORD
        })
        .post<Token>()
    ).data.access_token

    Reddit = new RedditAPI({ user_agent: USER_AGENT, bearer_token: token })
  })

  test('Me', async () => {
    let results = await Reddit.me()
    expect(results).not.toBeNull()
    expect(results.name).toEqual(USERNAME)
  })

  test('Update Wrong Token', async () => {
    Reddit.set_token('rubbish')
    await expect(Reddit.me()).rejects.toThrow(RedditAPIErr.Unauthorized)
  })

  test('Update Correct Token', async () => {
    Reddit.set_token(token)
    let results = await Reddit.me()
    expect(results.name).toEqual(USERNAME)
  })
})
