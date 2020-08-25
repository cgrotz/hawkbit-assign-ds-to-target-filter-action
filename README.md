# hawkbit-assign-ds-to-target-filter-action

GitHub Action for assign distribution sets to target filters in Hawkbit.

## Usage

### Example Workflow file

An example workflow:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - name: Upload Artifact
      uses: cgrotz/hawkbit-assign-ds-to-target-filter-action@v1
      with:
        hawkbit-tenant: ${{ secrets.ROLLOUTS_TENANT }}
        hawkbit-username: ${{ secrets.ROLLOUTS_USERNAME }}
        hawkbit-password: ${{ secrets.ROLLOUTS_PASSWORD }}
```
