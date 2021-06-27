# Ledger Web

Open Web OS for the whole web3/defi on any chain leveraging the ledger devices

## App examples

- https://github.com/machard/ledger-web-catalog
- https://github.com/machard/ledger-web-wallet-btc
- any dapp using https://github.com/blockmason/web3-provider-ledger (soon!)

## Client libs

- https://github.com/machard/ledger-web-client
- https://github.com/machard/ledger-web-hw-transport
- ledger-web-u2f to use when instantiating https://github.com/blockmason/web3-provider-ledger (soon!)

## TODO

- Currently the API / cross app data layer is centralized on the host/top window https://github.com/machard/ledger-web/blob/master/src/api.tsx . Not great.
The next step is to have every app defining a web worker that the host is going to keep alive.
The web worker expose the api/data of the app and is accessible all the time from other apps.

- Plug the navigation