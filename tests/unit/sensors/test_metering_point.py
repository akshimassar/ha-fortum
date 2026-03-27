"""Test metering point info sensor."""

from unittest.mock import Mock

from homeassistant.components.sensor import SensorStateClass

from custom_components.fortum.device import FortumDevice
from custom_components.fortum.models import MeteringPoint
from custom_components.fortum.sensors.metering_point import (
    FortumCurrentMonthConsumptionSensor,
    FortumCurrentMonthCostSensor,
    FortumMeteringPointSensor,
    FortumNorgesprisConsumptionLimitSensor,
)


def test_metering_point_sensor_exposes_address_and_ids() -> None:
    """Test metering point sensor state and attributes."""
    device = Mock(spec=FortumDevice)
    device.unique_id = "customer_123"
    device.device_info = {
        "identifiers": {("fortum", "customer_123")},
        "name": "Fortum Account",
        "manufacturer": "Fortum",
        "model": "Fortum",
    }

    metering_point = MeteringPoint(
        metering_point_no="6094111",
        metering_point_id="643003825101336249",
        address="Somethingtie 123, 00100 Helsinki",
        price_area="FI",
    )

    sensor = FortumMeteringPointSensor(device, metering_point)

    assert sensor.name == "Metering Point 6094111"
    assert sensor.native_value == "Somethingtie 123, 00100 Helsinki [FI]"
    assert sensor.extra_state_attributes == {
        "metering_point_no": "6094111",
        "metering_point_id": "643003825101336249",
        "address": "Somethingtie 123, 00100 Helsinki",
        "price_area": "FI",
    }


def test_metering_point_sensor_uses_unknown_when_address_missing() -> None:
    """Test metering point sensor fallback when address is not available."""
    device = Mock(spec=FortumDevice)
    device.unique_id = "customer_123"
    device.device_info = {
        "identifiers": {("fortum", "customer_123")},
        "name": "Fortum Account",
        "manufacturer": "Fortum",
        "model": "Fortum",
    }

    metering_point = MeteringPoint(
        metering_point_no="6094111",
        metering_point_id=None,
        address=None,
    )

    sensor = FortumMeteringPointSensor(device, metering_point)

    assert sensor.native_value == "Unknown"
    assert sensor.extra_state_attributes == {"metering_point_no": "6094111"}


def test_metering_point_sensor_area_without_address() -> None:
    """Metering point sensor should expose area in state when address is missing."""
    device = Mock(spec=FortumDevice)
    device.unique_id = "customer_123"
    device.device_info = {
        "identifiers": {("fortum", "customer_123")},
        "name": "Fortum Account",
        "manufacturer": "Fortum",
        "model": "Fortum",
    }

    metering_point = MeteringPoint(
        metering_point_no="6094111",
        metering_point_id=None,
        address=None,
        price_area="SE3",
    )

    sensor = FortumMeteringPointSensor(device, metering_point)

    assert sensor.native_value == "[SE3]"
    assert sensor.extra_state_attributes == {
        "metering_point_no": "6094111",
        "price_area": "SE3",
    }


def test_norgespris_consumption_limit_sensor() -> None:
    """Norgespris consumption-limit sensor should expose kWh value."""
    device = Mock(spec=FortumDevice)
    device.unique_id = "customer_123"
    device.device_info = {
        "identifiers": {("fortum", "customer_123")},
        "name": "Fortum Account",
        "manufacturer": "Fortum",
        "model": "Fortum",
    }

    metering_point = MeteringPoint(
        metering_point_no="6094111",
        norgespris_consumption_limit=4000.0,
    )

    sensor = FortumNorgesprisConsumptionLimitSensor(device, metering_point)

    assert sensor.name == "Norgespris consumption limit 6094111"
    assert sensor.native_value == 4000.0
    assert sensor.native_unit_of_measurement == "kWh"


def test_current_month_consumption_sensor_uses_coordinator_totals() -> None:
    """Current-month consumption sensor should read coordinator totals/units."""
    coordinator = Mock()
    coordinator.last_update_success = True
    coordinator.get_current_month_consumption_total.return_value = 321.5
    coordinator.get_current_month_consumption_unit.return_value = "kWh"

    device = Mock(spec=FortumDevice)
    device.unique_id = "customer_123"
    device.device_info = {
        "identifiers": {("fortum", "customer_123")},
        "name": "Fortum Account",
        "manufacturer": "Fortum",
        "model": "Fortum",
    }

    metering_point = MeteringPoint(metering_point_no="6094111")
    sensor = FortumCurrentMonthConsumptionSensor(coordinator, device, metering_point)

    assert sensor.name == "Current Month Consumption 6094111"
    assert sensor.native_value == 321.5
    assert sensor.native_unit_of_measurement == "kWh"
    assert sensor.state_class == SensorStateClass.TOTAL
    assert sensor.suggested_display_precision == 2
    assert sensor.available is True


def test_current_month_cost_sensor_falls_back_to_region_unit() -> None:
    """Current-month cost sensor should fallback unit when metadata missing."""
    coordinator = Mock()
    coordinator.last_update_success = True
    coordinator.get_current_month_cost_total.return_value = 12.3
    coordinator.get_current_month_cost_unit.return_value = None

    device = Mock(spec=FortumDevice)
    device.unique_id = "customer_123"
    device.device_info = {
        "identifiers": {("fortum", "customer_123")},
        "name": "Fortum Account",
        "manufacturer": "Fortum",
        "model": "Fortum",
    }

    metering_point = MeteringPoint(metering_point_no="6094111")
    sensor = FortumCurrentMonthCostSensor(coordinator, device, "fi", metering_point)

    assert sensor.name == "Current Month Cost 6094111"
    assert sensor.native_value == 12.3
    assert sensor.native_unit_of_measurement == "EUR"
    assert sensor.state_class == SensorStateClass.TOTAL
    assert sensor.suggested_display_precision == 2
    assert sensor.available is True
