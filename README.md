### Portfolio Service

#### Intro 
Used to add securities, update securities, get holdings and returns for a portfolio of stocks owned by a user

#### Schema

##### Approach 1

Entities <br />
1. Stocks <br /> Holds Name, CurrentPrice, Quantity of a particular stock.
2. Portfolio <br /> Holds Portfolio Name, Stocks in the portfolio, Avg buy price and list of trades <br /> <br />

Complexity of APIs <br />
1. Fetch portfolios is optimized (since trades are a subdocument)
2. Get all trades for a particular stock is degraded since we have to look through portfolio collection and trade subdocs to collate the results

##### Approach 2

Entities <br />
1. Stocks <br /> Holds Name, CurrentPrice, Quantity of a particular stock.
2. Portfolio <br /> Holds Portfolio Name, Stocks in the portfolio, Avg buy price
3. Trades <br /> Holds trade type, quantity, and price

Complexity of APIs <br />
1. Fetch portfolios needs to queries one to fetch portfolio then to fetch trades on the portfolio.
2. Get all trades for a particular stock is optimized as we only need to fetch trades using stockId.

This is the used approach as trade volume can be very large and may need streaming or MQ support.

#### Solution

1. The current solution supports adding BUY and SELL trades. This updates the trade and portfolio collections. 
2. Approriate referential integrity and schema validations have been placed for maintaining data sanity
3. Application is built using node.js, express and hosted on AWS.
4. Swagger documentation has also been integrated and can be accessed via http://ec2-54-70-110-211.us-west-2.compute.amazonaws.com:4600/v1/api-docs/#/ it is not complete yet but the API can be accessed via post man
4. Base path for all routes is http://ec2-54-70-110-211.us-west-2.compute.amazonaws.com:4600/v1/ <br />
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/6388b607a1fda7d411ba)
5. API REFERENCE
```` 
1. ADD TRADE

curl --location --request POST 'ec2-54-70-110-211.us-west-2.compute.amazonaws.com:4600/v1/trades' \
--header 'Content-Type: application/json' \
--data-raw '{
    "userId": "1",
    "stockId": "1",
    "quantity": 123,
    "type": "Buy",
    "portfolioId": "1"
}'

2. ADD STOCK

curl --location --request POST 'ec2-54-70-110-211.us-west-2.compute.amazonaws.com:4600/v1/stocks' \
--header 'Content-Type: application/json' \
--data-raw '{
    "ticker": "WIPRO",
    "currentPrice": 123,
    "quantity": 40
}'

3. ADD PORTFOLIO

curl --location --request POST 'ec2-54-70-110-211.us-west-2.compute.amazonaws.com:4600/v1/portfolios' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Test portfolio",
    "stocks": [],
    "userId": 1
}'

4. FETCH PORTFOLIO

curl --location --request GET 'ec2-54-70-110-211.us-west-2.compute.amazonaws.com:4600/v1/portfolios/5f207b0576beaf081ccfac33'

5. FETCH HOLDINGS

curl --location --request GET 'ec2-54-70-110-211.us-west-2.compute.amazonaws.com:4600/v1/portfolios/5f214cd92f5d3a093f081f87/holdings'

6. FETCH RETURNS

curl --location --request GET 'ec2-54-70-110-211.us-west-2.compute.amazonaws.com:4600/v1/portfolios/5f214cd92f5d3a093f081f87/returns'

7. UPDATE PORTFOLIOS

curl --location --request PATCH 'ec2-54-70-110-211.us-west-2.compute.amazonaws.com:4600/v1/portfolios' \
--header 'Content-Type: application/json' \
--data-raw '{
    "_id": "5f207b0576beaf081ccfac33",
    "stocks": [
        {
            "ticker": "IPRO",
            "quantity": 2,
            "price": 123,
            "stockId": "5f209e4b7e5bd751ed5de4eb"
        }
    ]
}'
````



#### Improvements

1. The add trade API can be updated to use kafka as a streaming addon for background processing of trades
2. This will allow scheduling trades and conditional buying

#### Assumptions
1. Updation and removal of trade is not implemented as a trade is assumed an atomic operation.
2. Securities are added and removed from the portfolio based on trades performed






