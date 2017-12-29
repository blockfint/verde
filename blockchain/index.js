import { default as RequestLib } from './lib/requests_lib'
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

const Requests = contract(require('./build/contracts/Requests.json'))

export default function (host, port, registersAddress, fromAddress) {
  let provider = new Web3.providers.HttpProvider(`http:\/\/${host}:${port}`)
  return new RequestLib (
      Requests,
      registersAddress,
      provider,
      fromAddress
  )
}
