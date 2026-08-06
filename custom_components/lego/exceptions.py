"""Exceptions raised by the LEGO integration."""

from __future__ import annotations


class BricksetError(Exception):
    """Base error for Brickset API failures."""


class BricksetConnectionError(BricksetError):
    """Raised when Brickset cannot be reached."""


class BricksetAuthError(BricksetError):
    """Raised when the API key is rejected."""


class BricksetUserHashError(BricksetError):
    """Raised when the stored user hash is rejected and reauth is needed."""


class BricksetQuotaError(BricksetError):
    """Raised at the configured budget, below Brickset's own 100-call cutoff."""
