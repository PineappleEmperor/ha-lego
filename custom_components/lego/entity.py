"""Base entity for the LEGO integration."""

from __future__ import annotations

from homeassistant.const import CONF_USERNAME
from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import ATTRIBUTION, DOMAIN
from .coordinator import CollectionData, LegoBaseCoordinator, LegoCollectionCoordinator


class LegoEntity[DataT](CoordinatorEntity[LegoBaseCoordinator[DataT]]):
    """Common device and attribution wiring for LEGO entities."""

    _attr_has_entity_name = True
    _attr_attribution = ATTRIBUTION

    def __init__(self, coordinator: LegoBaseCoordinator[DataT]) -> None:
        """Initialise the entity."""
        super().__init__(coordinator)
        entry = coordinator.config_entry
        username = str(entry.data.get(CONF_USERNAME, "Brickset"))
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, entry.entry_id)},
            entry_type=DeviceEntryType.SERVICE,
            manufacturer="Brickset",
            name=f"Brickset ({username})",
            configuration_url=f"https://brickset.com/sets/ownedby-{username}",
        )


class LegoCollectionEntity(LegoEntity[CollectionData]):
    """An entity backed by the collection coordinator."""

    coordinator: LegoCollectionCoordinator
