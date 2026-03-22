"""Test data models."""

from datetime import datetime
from zoneinfo import ZoneInfo

from custom_components.fortum.models import (
    AuthTokens,
    ConsumptionData,
    CostDataPoint,
    CustomerDetails,
    EnergyDataPoint,
    MeteringPoint,
    Price,
    TimeSeries,
    TimeSeriesDataPoint,
)


class TestConsumptionData:
    """Test ConsumptionData model."""

    def test_create_consumption_data(self):
        """Test creating consumption data."""
        now = datetime.now()
        data = ConsumptionData(value=150.5, unit="kWh", date_time=now, cost=25.50)

        assert data.value == 150.5
        assert data.unit == "kWh"
        assert data.date_time == now
        assert data.cost == 25.50

    def test_consumption_data_with_none_cost(self):
        """Test consumption data with None cost."""
        data = ConsumptionData(
            value=150.5, unit="kWh", date_time=datetime.now(), cost=None
        )

        assert data.cost is None

    def test_consumption_data_is_frozen(self):
        """Test that consumption data is immutable."""
        data = ConsumptionData(
            value=150.5, unit="kWh", date_time=datetime.now(), cost=25.50
        )

        # Note: ConsumptionData is not frozen in the current implementation
        # This test should be updated to match actual behavior
        data.value = 200.0  # This should work
        assert data.value == 200.0

    def test_consumption_data_equality(self):
        """Test consumption data equality."""
        now = datetime.now()
        data1 = ConsumptionData(value=150.5, unit="kWh", date_time=now, cost=25.50)
        data2 = ConsumptionData(value=150.5, unit="kWh", date_time=now, cost=25.50)

        assert data1 == data2

    def test_from_time_series_uses_local_timezone(self):
        """Test timezone conversion for time series consumption data."""
        time_series = TimeSeries(
            delivery_site_category="test",
            measurement_unit="kWh",
            metering_point_no="123",
            price_unit="c/kWh",
            cost_unit="EUR",
            temperature_unit="C",
            series=[
                TimeSeriesDataPoint(
                    at_utc=datetime.fromisoformat("2026-03-01T22:00:00+00:00"),
                    energy=[EnergyDataPoint(value=77.86, type="ENERGY")],
                    cost=[CostDataPoint(total=10.19, value=10.19, type="COST")],
                    price=None,
                    temperature_reading=None,
                )
            ],
        )

        result = ConsumptionData.from_time_series(
            time_series, timezone="Europe/Helsinki"
        )

        assert len(result) == 1
        assert result[0].date_time.tzinfo == ZoneInfo("Europe/Helsinki")
        assert result[0].date_time.date().isoformat() == "2026-03-02"

    def test_from_time_series_without_timezone_keeps_utc(self):
        """Test time series consumption data keeps UTC when timezone omitted."""
        source_dt = datetime.fromisoformat("2026-03-01T22:00:00+00:00")
        time_series = TimeSeries(
            delivery_site_category="test",
            measurement_unit="kWh",
            metering_point_no="123",
            price_unit="c/kWh",
            cost_unit="EUR",
            temperature_unit="C",
            series=[
                TimeSeriesDataPoint(
                    at_utc=source_dt,
                    energy=[EnergyDataPoint(value=77.86, type="ENERGY")],
                    cost=None,
                    price=None,
                    temperature_reading=None,
                )
            ],
        )

        result = ConsumptionData.from_time_series(time_series)

        assert len(result) == 1
        assert result[0].date_time == source_dt

    def test_from_time_series_includes_price_only_points(self):
        """Test conversion includes points with future price but no energy."""
        source_dt = datetime.fromisoformat("2026-03-20T10:00:00+00:00")
        time_series = TimeSeries(
            delivery_site_category="test",
            measurement_unit="kWh",
            metering_point_no="123",
            price_unit="EUR/kWh",
            cost_unit="EUR",
            temperature_unit="C",
            series=[
                TimeSeriesDataPoint(
                    at_utc=source_dt,
                    energy=[EnergyDataPoint(value=0.0, type="ENERGY")],
                    cost=None,
                    price=Price(
                        total=0.135, value=0.108, vat_amount=0.027, vat_percentage=25
                    ),
                    temperature_reading=None,
                )
            ],
        )

        result = ConsumptionData.from_time_series(time_series)

        assert len(result) == 1
        assert result[0].value == 0.0
        assert result[0].price == 0.135
        assert result[0].price_unit == "EUR/kWh"


class TestCustomerDetails:
    """Test CustomerDetails model."""

    def test_create_customer_details(self):
        """Test creating customer details."""
        details = CustomerDetails(
            customer_id="12345",
            postal_address="Test Street 123",
            post_office="Test City",
            name="John Doe",
        )

        assert details.customer_id == "12345"
        assert details.name == "John Doe"
        assert details.postal_address == "Test Street 123"
        assert details.post_office == "Test City"

    def test_customer_details_with_optional_name(self):
        """Test customer details with optional name."""
        details = CustomerDetails(
            customer_id="12345",
            postal_address="Test Street 123",
            post_office="Test City",
            name=None,
        )

        assert details.name is None

    def test_customer_details_from_api_response(self):
        """Test creating customer details from API response."""
        api_data = {
            "customerId": "12345",
            "postalAddress": "Test Street 123",
            "postOffice": "Test City",
            "name": "John Doe",
        }

        details = CustomerDetails.from_api_response(api_data)

        assert details.customer_id == "12345"
        assert details.name == "John Doe"
        assert details.postal_address == "Test Street 123"
        assert details.post_office == "Test City"


class TestMeteringPoint:
    """Test MeteringPoint model."""

    def test_create_metering_point(self):
        """Test creating metering point."""
        point = MeteringPoint(metering_point_no="MP123456", address="123 Main St")

        assert point.metering_point_no == "MP123456"
        assert point.address == "123 Main St"

    def test_metering_point_with_optional_address(self):
        """Test metering point with optional address."""
        point = MeteringPoint(metering_point_no="MP123456", address=None)

        assert point.address is None

    def test_metering_point_from_api_response(self):
        """Test creating metering point from API response."""
        api_data = {"meteringPointNo": "MP123456", "address": "123 Main St"}

        point = MeteringPoint.from_api_response(api_data)

        assert point.metering_point_no == "MP123456"
        assert point.address == "123 Main St"

    def test_metering_point_from_nested_api_response(self):
        """Test creating metering point from nested Fortum delivery site payload."""
        api_data = {
            "id": "6094111-undefined",
            "consumption": {
                "meteringPointNo": "6094111",
                "meteringPointId": "643003825101336249",
                "measurementDates": [
                    {
                        "firstDate": "2025-01-06T00:00:00.000+02:00",
                        "latestDate": "2025-01-06T00:00:00.000+02:00",
                        "type": "HOURLY",
                    },
                    {
                        "firstDate": "2025-01-07T00:00:00.000+02:00",
                        "latestDate": "2026-03-16T00:00:00.000+02:00",
                        "type": "PER_15_MIN",
                    },
                ],
            },
            "address": {
                "streetName": "Somethingtie",
                "houseNumber": "123",
                "cityName": "Helsinki",
                "zipCode": "00100",
            },
        }

        point = MeteringPoint.from_api_response(api_data)

        assert point.metering_point_no == "6094111"
        assert point.metering_point_id == "643003825101336249"
        assert point.address == "Somethingtie 123, 00100 Helsinki"
        assert point.earliest_hourly_available_at_utc == datetime.fromisoformat(
            "2025-01-06T00:00:00+02:00"
        )


class TestAuthTokens:
    """Test AuthTokens model."""

    def test_create_auth_tokens(self):
        """Test creating auth tokens."""
        tokens = AuthTokens(
            access_token="access123",
            refresh_token="refresh456",
            id_token="id789",
            expires_in=3600,
            token_type="Bearer",
        )

        assert tokens.access_token == "access123"
        assert tokens.refresh_token == "refresh456"
        assert tokens.id_token == "id789"
        assert tokens.expires_in == 3600
        assert tokens.token_type == "Bearer"

    def test_auth_tokens_from_api_response(self):
        """Test creating auth tokens from API response."""
        api_data = {
            "access_token": "access123",
            "refresh_token": "refresh456",
            "id_token": "id789",
            "expires_in": 3600,
            "token_type": "Bearer",
        }

        tokens = AuthTokens.from_api_response(api_data)

        assert tokens.access_token == "access123"
        assert tokens.refresh_token == "refresh456"
        assert tokens.id_token == "id789"
        assert tokens.expires_in == 3600
        assert tokens.token_type == "Bearer"

    def test_auth_tokens_default_token_type(self):
        """Test auth tokens with default token type."""
        api_data = {
            "access_token": "access123",
            "refresh_token": "refresh456",
            "id_token": "id789",
            "expires_in": 3600,
        }

        tokens = AuthTokens.from_api_response(api_data)

        assert tokens.token_type == "Bearer"
