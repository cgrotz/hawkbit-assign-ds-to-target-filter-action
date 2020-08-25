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
export interface TargetFilterSelf {
  href: string
}

export interface TargetFilterLinks {
  self: TargetFilterSelf
}
export interface TargetFilter {
  createdBy: string
  createdAt: number
  lastModifiedBy: string
  lastModifiedAt: number
  name: string
  query: string
  autoAssignDistributionSet: number
  autoAssignActionType: string
  _links: TargetFilterLinks
  id: number
}
export interface Page {
  content: TargetFilter[]
  total: number
  size: number
}

export async function getTargetFilters(
  targetFilterName: string
): Promise<Page | null> {
  const hawkbitHostUrl = core.getInput('hawkbit-host-url')

  const url = `${hawkbitHostUrl}/rest/v1/targetfilters?limit=1&q=name%3D%3D'${targetFilterName}'`

  core.info(`retrieving target filter by name`)

  const response = await Axios.get(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: getBasicAuthHeader()
    }
  })
  return response.data
}

export async function assignDistributionSetToTargetFilter(
  targetFilterId: number,
  distributionSetId: number,
  type: String,
  weight = 200
): Promise<DistributionSet | null> {
  const hawkbitHostUrl = core.getInput('hawkbit-host-url')

  const url = `${hawkbitHostUrl}/rest/v1/targetfilters/${targetFilterId}/autoAssignDS`

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
