import * as core from '@actions/core'
import {assignDistributionSetToTargetFilter, getTargetFilters} from './api'

async function run(): Promise<void> {
  try {
    const distributionSetId: string = core.getInput('distribution-set-id')
    const typeString: string = core.getInput('target-filter-type')
    const weight: number = parseInt(core.getInput('target-filter-weight'))

    const targetFilterName: string = core.getInput('target-filter-name')
    const targetFilterPage = await getTargetFilters(targetFilterName)
    const targetFilterId = targetFilterPage?.content[1].id
    if (targetFilterId) {
      assignDistributionSetToTargetFilter(
        targetFilterId,
        parseInt(distributionSetId),
        typeString,
        weight
      )
    } else {
      core.setFailed(
        `Couldn't retrive target filter with name ${targetFilterName}`
      )
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
