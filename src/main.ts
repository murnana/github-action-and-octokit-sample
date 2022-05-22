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

    //---------------------------------------------------------------
    const GITHUB_RUN_ATTEMPT = process.env.GITHUB_RUN_ATTEMPT as string
    core.debug(`GITHUB_RUN_ATTEMPT: ${GITHUB_RUN_ATTEMPT}`)
    const gitHubRunAttempt = parseInt(GITHUB_RUN_ATTEMPT, 10)
    core.debug(`gitHubRunAttempt: ${gitHubRunAttempt}`)

    if (gitHubRunAttempt > 1) {
      const context = github.context
      core.debug(`github.context: ${JSON.stringify(github.context, null, 2)}`)

      // Get before run workflow
      const result = await octoKit.rest.actions.listJobsForWorkflowRunAttempt({
        owner: context.repo.owner,
        repo: context.repo.repo,
        run_id: context.runId,
        attempt_number: gitHubRunAttempt - 1
      })

      const job = result.data.jobs.find(value => value.name === context.job)
      if (!job) {
        throw new Error(`job: ${context.job} is not found`)
      }
      core.debug(`job: ${JSON.stringify(job, null, 2)}`)
    } else {
      // First random
      core.setOutput('random', Math.ceil(Math.random() * 1000))
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
