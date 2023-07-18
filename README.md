# stateborn-sequencer
stateborn-sequencer is a backend service component of the stateborn project. 
It is responsible for processing stateborn data such as daos, proposals and votes and storing it in a database and IPFS.
## Architecutre
![stateborn architecture](stateborn.svg)
## Installation
This is localhost setup guide based on `Docker` and `docker-compose`. The startup configuration is located in `docker-compose-local.yaml`.
### Preequisites
Currently stateborn supports 3 blockchain networks: `Ethereum Mainnet`, `Polygon Mainnet` and `Arbitrum One`.
Archive node providers API keys are required for the proper functioning of the sequencer.
Setup archive node RPC urls in `docker-compose.yaml` file:
- `ETHEREUM_NODE_RPC_URL` for Ethereum
- `POLYGON_NODE_RPC_URL` for Polygon
- `ARBITRUM_NODE_RPC_URL` for Arbitrum One

*If URLs are not set, these network won't be operated currently.*
### Local blockchain network configuration (optional)
It is possible to configure 4th blockchain network - local. Local blockchain network allows to connect to custom blockchain network.
It is useful for development, testing or simply for connection to custom blockchain network. 
Configure connection parameters with these env vars:
- `IS_DEVELOPMENT_MODE=true` - enable local network support 
- `DEVELOPMENT_NETWORK_RPC` - archive node RPC url
- `DEVELOPMENT_NETWORK_CHAIN_ID` - blockchain network chain id
- `DEVELOPMENT_NETWORK_NAME` - blockchain network name (up to you)

### Start
`docker-compose -f docker-compose-local.yaml up`
