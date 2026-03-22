"""Button entities for Fortum."""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING

from homeassistant.components.button import ButtonEntity
from homeassistant.exceptions import HomeAssistantError

from .const import (
    CLEAR_STATS_BUTTON_KEY,
    CONF_DEBUG_ENTITIES,
    DEFAULT_DEBUG_ENTITIES,
    DOMAIN,
    FULL_SYNC_BUTTON_KEY,
)
from .entity import MittFortumEntity
from .exceptions import APIError

if TYPE_CHECKING:
    from homeassistant.config_entries import ConfigEntry
    from homeassistant.core import HomeAssistant
    from homeassistant.helpers.entity_platform import AddEntitiesCallback

    from .coordinators import HourlyConsumptionSyncCoordinator
    from .device import MittFortumDevice

_LOGGER = logging.getLogger(__name__)


def _has_authenticated_session(hass: HomeAssistant, entry_id: str) -> bool:
    """Return whether the integration has a usable auth/session context."""
    entry_data = hass.data.get(DOMAIN, {}).get(entry_id)
    if not isinstance(entry_data, dict):
        return False

    api_client = entry_data.get("api_client")
    auth_client = getattr(api_client, "_auth_client", None)
    if auth_client is None:
        return False

    session_data = getattr(auth_client, "session_data", None)
    if isinstance(session_data, dict) and isinstance(session_data.get("user"), dict):
        return True

    access_token = getattr(auth_client, "access_token", None)
    return isinstance(access_token, str) and bool(access_token)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up Fortum button entities from config entry."""
    if not entry.options.get(CONF_DEBUG_ENTITIES, DEFAULT_DEBUG_ENTITIES):
        return

    data = hass.data[DOMAIN][entry.entry_id]
    coordinator: HourlyConsumptionSyncCoordinator = data["coordinator"]
    device: MittFortumDevice = data["device"]

    async_add_entities(
        [
            MittFortumFullHistoryResyncButton(
                coordinator=coordinator,
                device=device,
                entry=entry,
            ),
            MittFortumClearStatisticsButton(
                coordinator=coordinator,
                device=device,
                entry=entry,
            ),
        ]
    )


class MittFortumFullHistoryResyncButton(MittFortumEntity, ButtonEntity):
    """Debug button to run full history re-sync."""

    def __init__(
        self,
        coordinator: HourlyConsumptionSyncCoordinator,
        device: MittFortumDevice,
        entry: ConfigEntry,
    ) -> None:
        """Initialize full sync button."""
        super().__init__(
            coordinator=coordinator,
            device=device,
            entity_key=FULL_SYNC_BUTTON_KEY,
            name="Full History Re-Sync",
        )
        self._entry = entry

    @property
    def available(self) -> bool:
        """Return if button is available."""
        return _has_authenticated_session(self.coordinator.hass, self._entry.entry_id)

    async def async_press(self) -> None:
        """Run full history re-sync from earliest available date."""
        try:
            imported_points = await self.coordinator.async_run_statistics_sync(
                force_resync=True,
            )
        except APIError as exc:
            raise HomeAssistantError(f"Full history re-sync failed: {exc}") from exc

        _LOGGER.info(
            "Full history re-sync triggered manually, processed %d points",
            imported_points,
        )


class MittFortumClearStatisticsButton(MittFortumEntity, ButtonEntity):
    """Debug button to clear imported statistics."""

    def __init__(
        self,
        coordinator: HourlyConsumptionSyncCoordinator,
        device: MittFortumDevice,
        entry: ConfigEntry,
    ) -> None:
        """Initialize clear statistics button."""
        super().__init__(
            coordinator=coordinator,
            device=device,
            entity_key=CLEAR_STATS_BUTTON_KEY,
            name="Clear Statistics",
        )
        self._entry = entry

    @property
    def available(self) -> bool:
        """Return if button is available."""
        return _has_authenticated_session(self.coordinator.hass, self._entry.entry_id)

    async def async_press(self) -> None:
        """Clear all imported statistics for Fortum metering points."""
        try:
            cleared = await self.coordinator.async_clear_statistics()
        except APIError as exc:
            raise HomeAssistantError(f"Clear statistics failed: {exc}") from exc

        _LOGGER.info(
            "Statistics clear triggered manually, removed %d statistic ids",
            cleared,
        )
