"""Base entity for Fortum integration."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

from homeassistant.helpers.update_coordinator import (
    CoordinatorEntity,
    DataUpdateCoordinator,
)

if TYPE_CHECKING:
    from homeassistant.helpers.device_registry import DeviceInfo

    from .device import FortumDevice


class FortumEntity(CoordinatorEntity):
    """Base entity for Fortum integration."""

    def __init__(
        self,
        coordinator: DataUpdateCoordinator[Any],
        device: FortumDevice,
        entity_key: str,
        name: str,
    ) -> None:
        """Initialize entity."""
        super().__init__(coordinator)
        self._device = device
        self._entity_key = entity_key
        self._name = name

    @property
    def device_info(self) -> DeviceInfo:
        """Return device information."""
        return self._device.device_info

    @property
    def unique_id(self) -> str:
        """Return unique entity ID."""
        return f"{self._device.unique_id}_{self._entity_key}"

    @property
    def name(self) -> str:
        """Return entity name."""
        return self._name

    @property
    def available(self) -> bool:
        """Return if entity is available."""
        return (
            self.coordinator.last_update_success and self.coordinator.data is not None
        )
