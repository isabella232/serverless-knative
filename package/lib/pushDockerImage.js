'use strict'

const { Context } = require('@serverless/core')
const DockerImage = require('@serverless/docker-image')
const { getName, getTag, getRepository } = require('../../shared/utils')

function pushDockerImage(funcName) {
  const { service } = this.serverless.service
  const name = getName(service, funcName)
  const { username } = this.serverless.service.provider.docker
  const { password } = this.serverless.service.provider.docker
  const credentials = {
    docker: {
      username,
      password
    }
  }

  const ctx = new Context()
  const dockerImage = new DockerImage(undefined, ctx)
  // manually setting the credentials of the child-component here
  dockerImage.context.credentials = credentials

  const repository = getRepository(username, name)
  const tag = getTag()

  const inputs = {
    repository,
    tag
  }

  this.serverless.cli.log(`Pushing "${repository}:${tag}" to Container Registry...`)

  return dockerImage.push(inputs)
}

module.exports = pushDockerImage
