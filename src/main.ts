import * as core from '@actions/core'
import {
  assignDistributionSetToTargetFilter,
  deleteDistributionSetFromTargetFilter,
  getTargetFilters
} from './api'

async function run(): Promise<void> {
  try {
    const distributionSetId: string = core.getInput('distribution-set-id')
    const typeString: string = core.getInput('target-filter-type')
    const weight: number = parseInt(core.getInput('target-filter-weight'))
    const targetFilterName: string = core.getInput('target-filter-name')
    const targetFilterPage = await getTargetFilters(targetFilterName)
    if (targetFilterPage) {
      const targetFilterId = targetFilterPage?.content[0].id
      if (targetFilterId) {
        await deleteDistributionSetFromTargetFilter(targetFilterId)
        await assignDistributionSetToTargetFilter(
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
    } else {
      core.setFailed(
        `Couldn't retrieve target filter with name ${targetFilterName}`
      )
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
