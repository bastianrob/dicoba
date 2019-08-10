# Dicoba

Repo web app <https://lapelio.com>

* Build with sapper + svelte
* Transpiled with babel
* Polyfilled with core-js  & regenerator-runtime

## Running the webapp

1. Checkout and run <https://github.com/bastianrob/go-oauth> & <https://github.com/bastianrob/restsuite> locally
2. Checkout <https://github.com/bastianrob/dicoba> and `cd` to the directory
3. Create `.env` file in the workspace root and add
   1. `CRED_HOST=http://{go-oauth-host}:{go-oauth-port}`
   2. `RESTSUITE_HOST=http://{restsuite-host}:{restsuite-port}`
4. npm install
5. npm run dev
6. open localhost:3000

## Deployment

1. Create `.env.prod` file in the workspace root and add
   1. `CRED_HOST=https://{go-oauth-host}:{go-oauth-port}`
   2. `RESTSUITE_HOST=https://{restsuite-host}:{restsuite-port}`
2. docker build -t `{docker-image-repo/dicoba:latest}` -f Dockerfile .
3. docker push `{docker-image-repo/dicoba:latest}`
