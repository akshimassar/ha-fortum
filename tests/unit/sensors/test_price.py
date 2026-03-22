"""Test price sensors."""

from datetime import datetime
from unittest.mock import Mock

import pytest
from homeassistant.components.sensor import SensorStateClass

from custom_components.fortum.device import MittFortumDevice
from custom_components.fortum.models import ConsumptionData
from custom_components.fortum.sensors.price import MittFortumPriceSensor


@pytest.fixture
def mock_coordinator():
    """Create a mock coordinator."""
    coordinator = Mock()
    coordinator.data = [
        ConsumptionData(
            value=150.5,
            unit="kWh",
            date_time=datetime(2026, 3, 10, 12, 0, 0),
            cost=25.50,
            price=0.119,
            price_unit="EUR/kWh",
        ),
        ConsumptionData(
            value=200.0,
            unit="kWh",
            date_time=datetime(2026, 3, 11, 12, 0, 0),
            cost=30.00,
            price=0.125,
            price_unit="EUR/kWh",
        ),
    ]
    coordinator.last_update_success = True
    return coordinator


@pytest.fixture
def mock_device():
    """Create a mock device."""
    device = Mock(spec=MittFortumDevice)
    device.device_info = {
        "identifiers": {("fortum", "123456")},
        "name": "Fortum Energy Meter",
        "manufacturer": "Fortum",
        "model": "Energy Meter",
    }
    return device


class TestMittFortumPriceSensor:
    """Test Fortum price sensor."""

    @pytest.fixture
    def sensor(self, mock_coordinator, mock_device):
        """Create price sensor."""
        return MittFortumPriceSensor(
            coordinator=mock_coordinator,
            device=mock_device,
            region="fi",
        )

    def test_sensor_properties(self, sensor):
        """Test sensor properties."""
        assert sensor.name == "Price per kWh"
        assert sensor.state_class == SensorStateClass.MEASUREMENT
        assert sensor.native_unit_of_measurement == "EUR/kWh"

    def test_native_value_returns_latest_price(self, sensor):
        """Test latest price is used as native value."""
        assert sensor.native_value == 0.125

    def test_native_value_no_price_data(self, sensor, mock_coordinator):
        """Test sensor value when no price is available."""
        mock_coordinator.data = [
            ConsumptionData(
                value=100.0, unit="kWh", date_time=datetime.now(), price=None
            )
        ]
        assert sensor.native_value is None
        assert sensor.available is False

    def test_fallback_unit_uses_region_currency(self, mock_coordinator, mock_device):
        """Test fallback unit when API does not provide price unit."""
        mock_coordinator.data = [
            ConsumptionData(
                value=0.0,
                unit="kWh",
                date_time=datetime.now(),
                price=0.1,
                price_unit=None,
            )
        ]
        sensor = MittFortumPriceSensor(
            coordinator=mock_coordinator,
            device=mock_device,
            region="se",
        )

        assert sensor.native_unit_of_measurement == "SEK/kWh"
