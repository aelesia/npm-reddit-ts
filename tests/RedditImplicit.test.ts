import RedditAPI from '../src/RedditAPI'
import * as pkg from '../package.json'

const CLIENT_ID = process.env['O2A_CLIENT_ID'] as string
const CLIENT_SECRET = process.env['O2A_SECRET'] as string
const USER_AGENT = `npm:reddit-ts:v${pkg.version} (by /u/aelesia)`
// const PASSWORD = process.env['O2A_PASSWORD'] as string

let Reddit = new RedditAPI({
  user_agent: USER_AGENT,
  o2a_implicit: {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code: '',
    redirect_uri: 'http://localhost:3000/oauth'
  }
})

describe('RedditAPI Authorization Code', () => {
  // test('Implicit Token', async () => {
  //   let results = await Reddit.implicit_token(
  //     CLIENT_ID,
  //     CLIENT_SECRET,
  //     'http://localhost:3000/oauth',
  //     'ZHLIyz_lEVj3JEQ0gxnU-Lu-vlg'
  //   )
  //   console.log(results)
  // })
  // test('RedditAuthToken', async () => {
  //   console.log(await Reddit.me())
  // })
  test('Placeholder', async () => {
    // This test exists so that Jest doesn't fail on empty tests
  })
})
