# oms

# oms-assignment

## Solution
![architecture](./.github/architecture.jpg?raw=true)

#### Steps of execution
* Scenario 1
  * Invoke `createOrder` lambda via `HTTP:PUT` with "Order" data
  * Push "Order" to SQS to process and trigger `placeOrder` lambda
  * `placeOrder` lambda process the order and invoke `OMS-API`
* Scenario 2
  * Upload "export-1.csv, export-2.csv, export-3.csv" to `storage.local.orders.csv` bucket (See "#How to Test" for bash scripts help)
  * Invoke `processOrder` lambda

## Developer Guide

### Prerequisites

- git
- docker-compose

### Init Steps

1. git clone `https://github.com/icode96/oms-assignment.git`
2. `cd oms-assignment`
3. create `preconfig.sh` from template.
4. create `docker network` : `docker network create omsnet`

### How to Test

1. spin up containers `docker compose up -d`
2. log into "proxy container" > `docker exec -it oms-proxy /bin/bash`
3. install node_modules > `npm install`
4. deploy serverless application `npm run deploy:local`
5. log into "localstack container" > `docker exec -it oms-localstack /bin/bash`
6. upload csv files to S3 bucket
```bash
awslocal s3 cp /docker-entrypoint-initaws.d/assets/export-1.csv s3://storage.local.orders.csv/export-1.csv
awslocal s3 cp /docker-entrypoint-initaws.d/assets/export-2.csv s3://storage.local.orders.csv/export-2.csv
awslocal s3 cp /docker-entrypoint-initaws.d/assets/export-3.csv s3://storage.local.orders.csv/export-3.csv
```
6. login back to "proxy container"
7. run `npx serverless invoke local -f processOrder --stage local` to process CSV files


### Next
1. do API-data validations
2. process rejected OMS API calls by moving them to the dead letter queue.

