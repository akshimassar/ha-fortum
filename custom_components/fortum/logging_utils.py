"""Logging helpers for Fortum integration."""

from __future__ import annotations

import logging
from typing import Any

from .const import DOMAIN

_LOG_NAMESPACE = f"custom_components.{DOMAIN}"
_ORIGINAL_LOG_RECORD_FACTORY = logging.getLogRecordFactory()
_PREFIX_FACTORY_INSTALLED = False


def _fortum_log_record_factory(*args: Any, **kwargs: Any) -> logging.LogRecord:
    """Create log records and prefix Fortum backend messages with function name."""
    record = _ORIGINAL_LOG_RECORD_FACTORY(*args, **kwargs)

    logger_name = getattr(record, "name", None)
    if not isinstance(logger_name, str):
        return record

    if not logger_name.startswith(_LOG_NAMESPACE):
        return record

    func_name = getattr(record, "funcName", None)
    if not isinstance(func_name, str) or not func_name:
        return record

    message = getattr(record, "msg", None)
    if not isinstance(message, str):
        return record

    record.msg = f"{func_name}: {message}"
    return record


def ensure_function_name_log_prefix() -> None:
    """Install Fortum-specific log record factory once."""
    global _ORIGINAL_LOG_RECORD_FACTORY, _PREFIX_FACTORY_INSTALLED

    if _PREFIX_FACTORY_INSTALLED:
        return

    current_factory = logging.getLogRecordFactory()
    if current_factory is _fortum_log_record_factory:
        _PREFIX_FACTORY_INSTALLED = True
        return

    _ORIGINAL_LOG_RECORD_FACTORY = current_factory
    logging.setLogRecordFactory(_fortum_log_record_factory)
    _PREFIX_FACTORY_INSTALLED = True
