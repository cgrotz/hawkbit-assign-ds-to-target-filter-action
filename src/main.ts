import * as core from '@actions/core'
import {assignDistributionSetToTargetFilter} from './api'

async function run(): Promise<void> {
  try {
    const distributionSetId: string = core.getInput('distribution-set-id')
    const targetFilterId: string = core.getInput('target-filter-id')
    const typeString: string = core.getInput('target-filter-type')
    const weight: number = parseInt(core.getInput('target-filter-weight'))
    assignDistributionSetToTargetFilter(
      parseInt(targetFilterId),
      parseInt(distributionSetId),
      typeString,
      weight
    )
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
