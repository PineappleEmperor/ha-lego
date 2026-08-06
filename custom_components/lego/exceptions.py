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
    """Raised when the daily getSets allowance is spent.

    Brickset raises this itself at 100 calls; the integration raises it earlier,
    at the user's configured budget, so manual actions keep some headroom.
    """
