import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    // Get GitHub Token
    const token = core.getInput('github-token', {
      required: true,
      trimWhitespace: false
    })
    core.debug(`Get token: ${token}`)

    // Get Octokit
    const octoKit = github.getOctokit(token, {
      log: {
        debug: core.debug,
        info: core.info,
        warn: core.warning,
        error: core.error
      },
      timeZone: 'Asia/Tokyo'
    })
    core.debug(`Get octoKit: ${octoKit}`)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
