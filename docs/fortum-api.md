# Fortum API

## Session

GET `https://www.fortum.com/fi/sahkoa/api/auth/session`

- A Fortum account can include multiple metering points.
- Each metering point has a metering point number (`meteringPointNo`), which is exposed in Home Assistant (for example in entity names and statistics IDs).
- Spot pricing is resolved by price area (`priceArea`) per metering point.
- In Home Assistant, price area is shown with square-bracket notation (for example `[FI]`, `[SE3]`).
- If the account has metering points in different price areas, spot prices must be fetched per area.

```jsonc
{
  "user": {
    "email": "kettunen@example.com",
    "customerId": "99887766",
    "customerFirstName": "Liisa",
    "deliverySites": [
      {
        "priceArea": "FI",
        "consumption": {
          "meteringPointId": "643000000000001234",
          "meteringPointNo": "1234111", // exposed in HA, statistics per metering point
          "priceArea": "FI", // exposed in HA as [FI] suffix
          "houseType": "UNKNOWN",
          "measurementType": "PER_15_MIN", // integration uses HOUR resolution
          "measurementDates": [
            {
              // usually only hourly data is available from that time
              // 15-minutes resolution only available for last couple of months
              "firstDate": "2025-01-06T00:00:00.000+02:00",
              "latestDate": "2026-03-25T00:00:00.000+02:00",
              "type": "PER_15_MIN",
              "__typename": "MeasurementDates"
            }
          ],
          "nettingDates": [],
          "meteringType": "CONSUMPTION",
          "measurementTime": "TWO_TIME_MEASUREMENT_SEASONAL",
          "norgespris": { // available in Norway
            "consumptionMaxLimit": null,
            "endDate": null,
            "hasSignedUp": false,
            "isActive": false,
            "priceDetails": null,
            "propertyType": null,
            "startDate": null,
            "__typename": "NorgesprisSignup"
          },
          "__typename": "DeliverySite",
          "contractStatus": {
            "statusName": "ACTIVE",
            "startDate": "2025-01-07T00:00:00.000+02:00",
            "systemStatusCode": "A"
          },
          "contractNo": 2,
          "futureMainProduct": {
            "validity": {}
          }
        },
        "address": { // exposed in HA to distinguish metering points
          "addressId": "addr_test_00100_helsinki",
          "streetName": "Testikatu",
          "houseNumber": "123",
          "houseLetter": null,
          "residence": null,
          "cityName": "Helsinki",
          "zipCode": "00100",
          "__typename": "StreetAddress"
        },
        "id": "1234111-undefined"
      }
    ],
    "idToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake-id-token-signature",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake-access-token-signature",
    "expires": "2026-03-26T22:59:27.000Z",
    "termsDate": "2025-05-18T21:11:20.775Z",
    "customerType": "PRIVATE",
    "hasOnlyFutureContract": false,
    "hasOnlyStandaloneVas": false,
    "hasAcceptedMobileTermsAndConditions": true,
    "customerRepresentAccounts": [
      {
        "relation": "OWNER",
        "customerType": "PRIVATE",
        "customerId": "99887766",
        "firstName": "Liisa",
        "lastName": "Kettunen"
      }
    ],
    "hasPriceLockAddon": false,
    "redirectLegacy": false
  },
  "expires": "2026-04-25T21:59:29.252Z"
}
```

## Spot Price

Procedure: `shared.spotPrices.listPriceAreaSpotPrices`

Fortum usually provides spot prices for the current day and tomorrow. Tomorrow prices are typically published around 15:00 local time.

GET `https://www.fortum.com/fi/sahkoa/api/trpc/shared.spotPrices.listPriceAreaSpotPrices?batch=1&input=<input>`

`input`:

```json
{
  "0": {
    "json": {
      "priceArea": "FI",
      "fromDate": "2026-03-25",
      "toDate": "2026-03-28",
      "resolution": "PER_15_MIN"
    }
  }
}
```

```jsonc
[
  {
    "result": {
      "data": {
        "json": [
          {
            "priceArea": "FI",
            "priceUnit": "c/kWh",
            "spotPriceSeries": [
              {
                "atLocal": "2026-03-25T00:00:00.000+02:00",
                "atUTC": "2026-03-24T22:00:00.000Z",
                "spotPrice": {
                  "value": 0.412,
                  "total": 0.517,
                  "vatPercentage": 25.5,
                  "__typename": "Price"
                },
                "__typename": "SpotPriceSeries"
              },
              // ... 384 records total
              {
                "atLocal": "2026-03-28T23:45:00.000+02:00",
                "atUTC": "2026-03-28T21:45:00.000Z",
                "spotPrice": null,
                "__typename": "SpotPriceSeries"
              }
            ],
            "__typename": "AreaPrices"
          }
        ]
      }
    }
  }
]
```

Hourly payload semantics used by the integration:

- Core hourly metrics are treated as a bundle (`energy`, `cost`, `price`): observed payloads use all-present or all-missing core hours.
- Missing core hours are represented as `energy: []`, `cost: null`, `price: null`.
- `temperatureReading` can still be present on a core-missing hour, so temperature presence is not used as core-hour existence.

## Consumption

Procedure: `loggedIn.timeSeries.listTimeSeries`

Consumption data is usually delayed and is often 1-2 days old.

GET `https://www.fortum.com/fi/sahkoa/api/trpc/loggedIn.timeSeries.listTimeSeries?batch=1&input=<input>`

`input`:

```json
{
  "0": {
    "json": {
      "meteringPointNo": [
        "1234111"
      ],
      "fromDate": "2026-03-24T23:44:19.880Z",
      "toDate": "2026-03-26T23:44:19.880Z",
      "resolution": "HOUR",
      "type": "CONSUMPTION"
    }
  }
}
```

```jsonc
[
  {
    "result": {
      "data": {
        "json": [
          {
            "deliverySiteCategory": "CONSUMPTION",
            "measurementUnit": "kWh",
            "meteringPointNo": "1234111",
            "priceUnit": "c/kWh",
            "costUnit": "EUR",
            "temperatureUnit": "celsius",
            "series": [
              {
                "atUTC": "2026-03-24T23:00:00.000Z",
                "energy": [
                  {
                    "value": 3.76,
                    "type": "ENERGY",
                    "__typename": "EnergyDataPoint"
                  },
                  {
                    "value": 3.76,
                    "type": "OTHER_SEASON_ENERGY",
                    "__typename": "EnergyDataPoint"
                  }
                ],
                "cost": [
                  {
                    "total": 0.00806,
                    "value": 0.00642,
                    "type": "COST_SALES_BASE_RATE",
                    "__typename": "Cost"
                  },
                  {
                    "total": 0.04008,
                    "value": 0.03194,
                    "type": "COST_SALES_ELECTRICITY",
                    "__typename": "Cost"
                  }
                ],
                "__typename": "TimeSeriesDataPoint",
                "price": {
                  "total": 1.0655,
                  "value": 0.849,
                  "vatAmount": 0.2165,
                  "vatPercentage": 25.5,
                  "__typename": "Price"
                },
                "temperatureReading": {
                  "temperature": 3.7,
                  "__typename": "TemperatureReading"
                }
              },
              // ... 49 records total
              {
                "atUTC": "2026-03-26T23:00:00.000Z",
                "energy": [],
                "cost": null,
                "__typename": "TimeSeriesDataPoint",
                "price": null,
                "temperatureReading": null
              }
            ],
            "__typename": "TimeSeries"
          }
        ]
      }
    }
  }
]
```
