import * as core from '@actions/core'
import Axios from 'axios'

function getBasicAuthHeader(): String {
  const tenant = core.getInput('hawkbit-tenant')
  const username = core.getInput('hawkbit-username')
  const password = core.getInput('hawkbit-password')
  const token = Buffer.from(`${tenant}\\${username}:${password}`).toString(
    'base64'
  )
  return `Basic ${token}`
}

export interface SoftwareModuleSelf {
  href: string
}

export interface SoftwareModuleLinks {
  self: SoftwareModuleSelf
}

export interface SoftwareModule {
  createdBy: string
  createdAt: number
  lastModifiedBy: string
  lastModifiedAt: number
  name: string
  description?: string
  version: string
  type: string
  vendor?: string
  deleted: boolean
  _links: SoftwareModuleLinks
  id: number
}

export interface DistributionSetSelf {
  href: string
}

export interface DistributionSetLinks {
  self: DistributionSetSelf
}

export interface DistributionSet {
  createdBy: string
  createdAt: number
  lastModifiedBy: string
  lastModifiedAt: number
  name: string
  description: string
  version: string
  modules: SoftwareModule[]
  requiredMigrationStep: boolean
  type: string
  complete: boolean
  deleted: boolean
  _links: DistributionSetLinks
  id: number
}

export enum AssignmentType {
  forced,
  soft,
  downloadonly
}
export async function assignDistributionSetToTargetFilter(
  targetFilterId: number,
  distributionSetId: number,
  type: String,
  weight = 200
): Promise<DistributionSet | null> {
  const hawkbitHostUrl = core.getInput('hawkbit-host-url')

  const url = `https://${hawkbitHostUrl}/rest/v1/targetfilters/${targetFilterId}/autoAssignDS`

  core.info(
    `Assigning Distribution Set with id ${distributionSetId} to targetFilter ${targetFilterId}`
  )
  const response = await Axios.post(
    url,
    [
      {
        weight,
        type,
        id: distributionSetId
      }
    ],
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: getBasicAuthHeader()
      }
    }
  )
  return response.data
}
