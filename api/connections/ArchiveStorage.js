const SwiftClient = require('openstack-swift-client')

const credentials = {
  endpointUrl: process.env.NCLOUD_ARCHIVE_STORAGE_ENDPOINT,
  username: process.env.NCLOUD_ACCESS_KEY,
  password: process.env.NCLOUD_SECRET_KEY,
  domainId: process.env.NCLOUD_DOMAIN_ID,
  projectId: process.env.NCLOUD_PROJECT_ID,
}

// swift client
const client = new SwiftClient(
  new SwiftClient.KeystoneV3Authenticator(credentials)
)

module.exports = client
