"""Device representation for Fortum integration."""

from __future__ import annotations

from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo

from .const import DOMAIN, MANUFACTURER, MODEL


class FortumDevice:
    """Representation of a Fortum device."""

    def __init__(self, identity_id: str, name: str | None = None) -> None:
        """Initialize device."""
        self._identity_id = identity_id
        self._name = name or "Fortum Account"

    @property
    def device_info(self) -> DeviceInfo:
        """Return device information."""
        return DeviceInfo(
            identifiers={(DOMAIN, self._identity_id)},
            name=self._name,
            manufacturer=MANUFACTURER,
            model=MODEL,
            entry_type=DeviceEntryType.SERVICE,
        )

    @property
    def unique_id(self) -> str:
        """Return unique device ID."""
        return self._identity_id
