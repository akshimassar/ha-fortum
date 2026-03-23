"""Platform for sensor integration."""

from __future__ import annotations

from typing import TYPE_CHECKING

from .const import (
    CONF_DEBUG_ENTITIES,
    CONF_REGION,
    DEFAULT_DEBUG_ENTITIES,
    DEFAULT_REGION,
    DOMAIN,
)
from .sensors import (
    FortumMeteringPointSensor,
    FortumPriceSensor,
    FortumStatisticsLastSyncSensor,
    FortumTomorrowMaxPriceSensor,
    FortumTomorrowMaxPriceTimeSensor,
)

if TYPE_CHECKING:
    from homeassistant.config_entries import ConfigEntry
    from homeassistant.core import HomeAssistant
    from homeassistant.helpers.entity_platform import AddEntitiesCallback


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up Fortum sensors based on a config entry."""
    data = hass.data[DOMAIN][entry.entry_id]
    coordinator = data["coordinator"]
    price_coordinator = data.get("price_coordinator", coordinator)
    device = data["device"]
    metering_points = data.get("metering_points", [])
    region = entry.data.get(CONF_REGION, DEFAULT_REGION)

    # Create sensor entities
    entities = [
        FortumPriceSensor(price_coordinator, device, region),
        FortumTomorrowMaxPriceSensor(price_coordinator, device, region),
        FortumTomorrowMaxPriceTimeSensor(price_coordinator, device),
        *[
            FortumMeteringPointSensor(device, metering_point)
            for metering_point in metering_points
        ],
    ]

    if entry.options.get(CONF_DEBUG_ENTITIES, DEFAULT_DEBUG_ENTITIES):
        entities.append(FortumStatisticsLastSyncSensor(coordinator, device))

    # Coordinators are refreshed during integration setup, so forcing another
    # refresh before adding entities only slows down reload/startup.
    async_add_entities(entities, update_before_add=False)
