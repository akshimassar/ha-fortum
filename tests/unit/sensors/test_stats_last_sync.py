"""Test statistics last-sync sensor."""

from datetime import datetime
from unittest.mock import Mock

from homeassistant.components.sensor import SensorDeviceClass
from homeassistant.helpers.entity import EntityCategory

from custom_components.fortum.device import FortumDevice
from custom_components.fortum.sensors.stats_last_sync import (
    FortumStatisticsLastSyncSensor,
)


def test_stats_last_sync_sensor_properties() -> None:
    """Test sensor metadata and value."""
    coordinator = Mock()
    coordinator.last_update_success = True
    coordinator.data = []
    coordinator.last_statistics_sync = datetime.now().astimezone()

    device = Mock(spec=FortumDevice)
    device.device_info = {
        "identifiers": {("fortum", "123456")},
        "name": "Fortum Energy Meter",
        "manufacturer": "Fortum",
        "model": "Energy Meter",
    }

    sensor = FortumStatisticsLastSyncSensor(coordinator=coordinator, device=device)

    assert sensor.name == "Statistics Last Sync"
    assert sensor.device_class == SensorDeviceClass.TIMESTAMP
    assert sensor.entity_category == EntityCategory.DIAGNOSTIC
    assert sensor.native_value == coordinator.last_statistics_sync
    assert sensor.available is True
    assert sensor.extra_state_attributes == {"last_update_success": True}


def test_stats_last_sync_sensor_unavailable_without_sync() -> None:
    """Test sensor availability before first sync."""
    coordinator = Mock()
    coordinator.last_update_success = True
    coordinator.data = []
    coordinator.last_statistics_sync = None

    device = Mock(spec=FortumDevice)
    device.device_info = {
        "identifiers": {("fortum", "123456")},
        "name": "Fortum Energy Meter",
        "manufacturer": "Fortum",
        "model": "Energy Meter",
    }

    sensor = FortumStatisticsLastSyncSensor(coordinator=coordinator, device=device)

    assert sensor.native_value is None
    assert sensor.available is False


def test_stats_last_sync_sensor_unavailable_after_failed_update() -> None:
    """Sensor should reflect current coordinator update failure."""
    coordinator = Mock()
    coordinator.last_update_success = False
    coordinator.data = []
    coordinator.last_statistics_sync = datetime.now().astimezone()

    device = Mock(spec=FortumDevice)
    device.device_info = {
        "identifiers": {("fortum", "123456")},
        "name": "Fortum Energy Meter",
        "manufacturer": "Fortum",
        "model": "Energy Meter",
    }

    sensor = FortumStatisticsLastSyncSensor(coordinator=coordinator, device=device)

    assert sensor.native_value == coordinator.last_statistics_sync
    assert sensor.available is False
    assert sensor.extra_state_attributes == {"last_update_success": False}
