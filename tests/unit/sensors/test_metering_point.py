"""Test metering point info sensor."""

from unittest.mock import Mock

from custom_components.mittfortum.device import MittFortumDevice
from custom_components.mittfortum.models import MeteringPoint
from custom_components.mittfortum.sensors.metering_point import (
    MittFortumMeteringPointSensor,
)


def test_metering_point_sensor_exposes_address_and_ids() -> None:
    """Test metering point sensor state and attributes."""
    device = Mock(spec=MittFortumDevice)
    device.unique_id = "customer_123"
    device.device_info = {
        "identifiers": {("mittfortum", "customer_123")},
        "name": "MittFortum Account",
        "manufacturer": "Fortum",
        "model": "MittFortum",
    }

    metering_point = MeteringPoint(
        metering_point_no="6094111",
        metering_point_id="643003825101336249",
        address="Somethingtie 123, 00100 Helsinki",
    )

    sensor = MittFortumMeteringPointSensor(device, metering_point)

    assert sensor.name == "Metering Point 6094111"
    assert sensor.native_value == "Somethingtie 123, 00100 Helsinki"
    assert sensor.extra_state_attributes == {
        "metering_point_no": "6094111",
        "metering_point_id": "643003825101336249",
    }


def test_metering_point_sensor_uses_unknown_when_address_missing() -> None:
    """Test metering point sensor fallback when address is not available."""
    device = Mock(spec=MittFortumDevice)
    device.unique_id = "customer_123"
    device.device_info = {
        "identifiers": {("mittfortum", "customer_123")},
        "name": "MittFortum Account",
        "manufacturer": "Fortum",
        "model": "MittFortum",
    }

    metering_point = MeteringPoint(
        metering_point_no="6094111",
        metering_point_id=None,
        address=None,
    )

    sensor = MittFortumMeteringPointSensor(device, metering_point)

    assert sensor.native_value == "Unknown"
    assert sensor.extra_state_attributes == {"metering_point_no": "6094111"}
