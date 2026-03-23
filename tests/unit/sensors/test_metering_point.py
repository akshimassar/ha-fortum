"""Test metering point info sensor."""

from unittest.mock import Mock

from custom_components.fortum.device import FortumDevice
from custom_components.fortum.models import MeteringPoint
from custom_components.fortum.sensors.metering_point import (
    FortumMeteringPointSensor,
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
    )

    sensor = FortumMeteringPointSensor(device, metering_point)

    assert sensor.name == "Metering Point 6094111"
    assert sensor.native_value == "Somethingtie 123, 00100 Helsinki"
    assert sensor.extra_state_attributes == {
        "metering_point_no": "6094111",
        "metering_point_id": "643003825101336249",
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
